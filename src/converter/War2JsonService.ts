import { LoggerFactory } from '../logging/LoggerFactory'
import { readFile, writeFile } from 'fs/promises'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import path from 'path'
import { copyFileWithDirCreation } from './FileCopier'
import EnhancementManager from '../enhancements/EnhancementManager'
import { type TriggerContainer } from '../translator/data/TriggerContainer'
import { type MapHeader } from '../translator/data/MapHeader'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import { FileBlacklist } from '../enhancements/FileBlacklist'
import { TriggerComposer } from '../enhancements/TriggerComposer'
import { type Info, type Asset } from '../wc3maptranslator/data'
import { FormatConverters } from './formats/FormatConverters'
import { TranslatorManager } from './TranslatorManager'
import { CustomScriptsTranslator, TriggersTranslator } from '../translator'
import { AssetsTranslator } from '../wc3maptranslator/translators'
import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { type TargetProfile } from './Profile'

const log = LoggerFactory.createLogger('War2Json')

let translatorCount = 0
async function processFile (input: string, translator: ((buffer: Buffer) => unknown), output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` }) // TODO: move this log
  asyncLog.info('Processing', input)
  const buffer = await readFile(input)
  const json = translator(buffer)
  await WriteAndCreatePath(output, FormatConverters[EnhancementManager.mapDataExtension].stringify(json), { encoding: 'utf8' })
  asyncLog.info('Finished processing', output)
}

async function processImportsRegistry (importsFile: string): Promise<Asset[]> {
  const asyncLog = log.getSubLogger({ name: `${AssetsTranslator.constructor.name}-${translatorCount++}` }) // TODO: move this log
  asyncLog.info('Reading war3map.imp file.')
  const buffer = await readFile(importsFile)
  const json = AssetsTranslator.warToJson(buffer)
  asyncLog.info('Read war3map.imp, found', json.length, 'imports')
  return json
}

async function processTriggers (triggersFile: string, customScriptsFile?: string): Promise<TriggerContainer> {
  const asyncLog = log.getSubLogger({ name: `${TriggersTranslator.constructor.name}-${translatorCount++}` }) // TODO: move this log

  asyncLog.info('Reading war3map.wtg file.')
  const triggerBuffer = await readFile(triggersFile)
  const triggerJson = TriggersTranslator.warToJson(triggerBuffer)
  asyncLog.info('Read war3map.wtg file.')

  if (customScriptsFile != null) {
    asyncLog.info('Reading war3map.wct file.')
    const csBuffer = await readFile(customScriptsFile)
    const csResults = CustomScriptsTranslator.warToJson(csBuffer)
    asyncLog.info('Read war3map.wct file, found', csResults.scripts.length, 'custom scripts.')

    // Combine custom scripts into trigger JSON
    for (let i = 0; i < triggerJson.scriptReferences.length; i++) {
      const scriptRef = triggerJson.scriptReferences[i]
      if (scriptRef != null) {
        scriptRef.script = csResults.scripts[i]
      }
    }

    (triggerJson.root as MapHeader).description = csResults.headerComment
  }

  return triggerJson.root
}

const War2JsonService = {
  convert: async function (inputPath: string, outputPath: string, profile?: TargetProfile) {
    log.info('Converting Warcraft III binaries in', inputPath, 'and outputting to', outputPath)

    let editorVersionSupplier: Promise<integer>
    let editorVersionResolver: ((version: integer) => void) | undefined
    let editorVersionRejector: ((reason?: unknown) => void) | undefined
    if (profile) {
      editorVersionSupplier = new Promise<integer>((resolve) => { resolve(profile.editorVersion) })
    } else {
      editorVersionSupplier = new Promise<integer>((resolve, reject) => {
        editorVersionResolver = resolve
        editorVersionRejector = reject
      })
    }
    const promises: Array<Promise<unknown>> = []
    const fileStack: Array<DirectoryTree<Record<string, unknown>>> = [directoryTree(inputPath, { attributes: ['type', 'extension'] })]

    const copyFiles: Record<string, string> = {}
    let importFile: string | null = null
    let triggerFile: string | null = null
    let customScriptFile: { input: string, output: string } | null = null
    let foundW3i = false
    let waitingForW3i = false

    while (fileStack.length > 0) {
      const file = fileStack.pop()
      if (file == null) break
      if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue

      if (file.type === 'directory') {
        const children = file.children

        if (children != null) {
          for (const child of children) {
            fileStack.push(child)
          }
        }
      } else {
        const translator = TranslatorManager.FindAppropriateTranslationMethodBinary2Text(file.name, editorVersionSupplier)
        if (translator != null) {
          if (EnhancementManager.smartImport && (file.name.endsWith('.imp'))) {
            importFile = file.path
          } else if (file.name.endsWith('.wtg')) {
            triggerFile = file.path
          } else if (file.name.endsWith('.wct')) {
            const outputFile = path.join(outputPath, path.relative(inputPath, file.path)) + EnhancementManager.mapDataExtension
            customScriptFile = { input: file.path, output: outputFile }
          } else if (file.name.endsWith('w3i')) {
            foundW3i = true
            const outputFile = path.join(outputPath, path.relative(inputPath, file.path)) + EnhancementManager.mapDataExtension
            promises.push(async function (): Promise<void> {
              const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` }) // TODO: move this log
              asyncLog.info('Processing', file.path)
              const buffer = await readFile(file.path)
              const json = translator(buffer) as Info
              await WriteAndCreatePath(outputFile, FormatConverters[EnhancementManager.mapDataExtension].stringify(json), { encoding: 'utf8' })
              asyncLog.info('Finished processing', outputFile)
              editorVersionResolver?.(json.editorVersion)
            }())
          } else {
            const outputFile = path.join(outputPath, path.relative(inputPath, file.path)) + EnhancementManager.mapDataExtension
            promises.push(processFile(file.path, translator, outputFile))
          }
          if (file.name.endsWith('w3c') || file.name.endsWith('.doo')) {
            waitingForW3i = true
          }
        } else {
          const outputFile = path.join(outputPath, path.relative(inputPath, file.path))
          if (EnhancementManager.smartImport) {
            copyFiles[file.path] = outputFile
          } else {
            promises.push(copyFileWithDirCreation(file.path, outputFile))
          }
        }
      }
    }

    if (triggerFile != null) {
      promises.push(async function () {
        const triggerJSON = await processTriggers(triggerFile, customScriptFile?.input)
        if (EnhancementManager.composeTriggers) {
          await TriggerComposer.explodeTriggersJsonIntoSource(outputPath, triggerJSON)
        } else {
          await writeFile(path.join(outputPath, `triggers${EnhancementManager.mapDataExtension}`), FormatConverters[EnhancementManager.mapDataExtension].stringify(triggerJSON), { encoding: 'utf8' })
        }
      }())
    } else if (customScriptFile != null) {
      promises.push(copyFileWithDirCreation(customScriptFile.input, customScriptFile.output))
    }

    if (EnhancementManager.smartImport) {
      log.debug('SmartImports requested')
      if (importFile != null) {
        const imports = await processImportsRegistry(importFile)
        for (const [input, output] of Object.entries(copyFiles)) {
          const relativeInput = path.relative(inputPath, input)
          let found = false
          for (const importEntry of imports) {
            if (path.normalize(importEntry.path) === path.normalize(relativeInput)) {
              found = true
              break
            }
          }
          if (found) {
            const outputFile = path.join(outputPath, EnhancementManager.importFolder, relativeInput)
            promises.push(copyFileWithDirCreation(input, outputFile))
          } else {
            promises.push(copyFileWithDirCreation(input, output))
          }
        }
      } else {
        log.error('File war3map.imp not found, unable to determine imports from map files, will copy-paste all non-translated files')
        for (const [input, output] of Object.entries(copyFiles)) {
          promises.push(copyFileWithDirCreation(input, output))
        }
      }
    }

    if (waitingForW3i && !foundW3i) {
      editorVersionRejector?.('Editor version not supplied, nor is war3map.w3i file found.')
    }

    return await Promise.all(promises)
  }
}

export default War2JsonService
