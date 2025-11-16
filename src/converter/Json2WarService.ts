import path from 'path'
import { LoggerFactory } from '../logging/LoggerFactory'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import { translatorRecord } from './TranslatorRecord'
import { copyFileWithDirCreation } from './FileCopier'
import { readFile } from 'fs/promises'
import EnhancementManager from '../enhancements/EnhancementManager'
import ImportComposer from '../enhancements/ImportComposer'
import { type TriggerTranslatorOutput, TriggersTranslator } from '../translator/TriggerTranslator'
import { CustomScriptsTranslator } from '../translator/CustomScriptsTranslator'
import { type TriggerContainer } from '../translator/data/TriggerContainer'
import { ContentType, type TriggerContent } from '../translator/data/content/TriggerContent'
import { type ScriptContent } from '../translator/data/properties/ScriptContent'
import { type MapHeader } from '../translator/data/MapHeader'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import { FileBlacklist } from '../enhancements/FileBlacklist'
import { TriggerComposer } from '../enhancements/TriggerComposer'
import { type Asset } from '../wc3maptranslator/data'
import { type Translator, ImportsTranslator } from '../wc3maptranslator/translators'
import { FormatConverters } from './formats/FormatConverters'
const log = LoggerFactory.createLogger('Json2War')

let translatorCount = 0
async function processFile<T> (input: string, translator: Translator<T>, output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Processing', input)
  const buffer = FormatConverters[EnhancementManager.mapDataExtension].parse(await readFile(input, { encoding: 'utf8' })) as T
  const result = translator.jsonToWar(buffer)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
  } else {
    await WriteAndCreatePath(output, result.buffer)
    asyncLog.info('Finished processing', output)
  }
}

async function exportImportsFile (data: Asset[], output: string): Promise<void> {
  const translator = ImportsTranslator.getInstance()
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Exporting generated war3map.imp file.')
  const result = translator.jsonToWar(data)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
  } else {
    await WriteAndCreatePath(output, result.buffer)
    asyncLog.info('Finished exporting', output)
  }
}

function getAllContentForScriptFile (root: TriggerContainer): TriggerContent[] {
  const triggerStack: TriggerContent[] = [root]
  const result: TriggerContent[] = []
  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue
    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
        result.push(currentTrigger)
      // eslint-disable-next-line no-fallthrough
      case ContentType.LIBRARY:
      case ContentType.CATEGORY:
        triggerStack.push(...(currentTrigger as TriggerContainer).children.reverse())
        break
      case ContentType.CUSTOM_SCRIPT:
      case ContentType.TRIGGER:
      case ContentType.TRIGGER_SCRIPTED:
        result.push(currentTrigger)
        break
    }
  }

  return result
}

async function exportTriggers (triggersJson: TriggerContainer, output: string): Promise<void> {
  const tasks: Array<Promise<unknown>> = []
  const triggerTranslator = TriggersTranslator.getInstance()
  const triggerLog = log.getSubLogger({ name: `${triggerTranslator.constructor.name}-${translatorCount++}` })
  const triggerAndScript: TriggerTranslatorOutput = {
    roots: [triggersJson],
    scriptReferences: getAllContentForScriptFile(triggersJson) as ScriptContent[]
  }

  const triggerResult = triggerTranslator.jsonToWar(triggerAndScript)
  tasks.push(WriteAndCreatePath(path.join(output, 'war3map.wtg'), triggerResult.buffer)
    .then(() => triggerLog.info('Finished exporting triggers.')))

  const scriptTranslator = CustomScriptsTranslator.getInstance()
  const scriptLog = log.getSubLogger({ name: `${scriptTranslator.constructor.name}-${translatorCount++}` })

  const scriptArg: { headerComments: string[], scripts: string[] } = { headerComments: [], scripts: [] }
  for (const trigger of triggerAndScript.scriptReferences) {
    if (trigger != null) {
      if ((trigger as MapHeader).children != null) { // Found header
        scriptArg.headerComments.push(trigger.description)
      }
      scriptArg.scripts.push(trigger.script)
    } else {
      scriptArg.scripts.push('')
    }
  }

  const scriptResult = scriptTranslator.jsonToWar(scriptArg)
  tasks.push(WriteAndCreatePath(path.join(output, 'war3map.wct'), scriptResult.buffer)
    .then(() => scriptLog.info('Finished exporting custom scripts.')))

  await Promise.all(tasks)
}

async function processTriggers (input: string, output: string): Promise<void> {
  log.info('Reading triggers file')
  const buffer = FormatConverters[EnhancementManager.mapDataExtension].parse(await readFile(input, { encoding: 'utf8' })) as TriggerContainer[]
  await exportTriggers(buffer[0], output)
}

const Json2WarService = {
  convert: async function (inputPath: string, outputPath: string): Promise<void> {
    log.info(`Converting Warcraft III json data in '${inputPath}' and outputting to '${outputPath}'`)

    const promises: Array<Promise<void>> = []
    const fileStack: Array<DirectoryTree<Record<string, unknown>>> = [directoryTree(inputPath, { attributes: ['type', 'extension'] })]
    let importDirectoryTree: DirectoryTree<Record<string, unknown>> | null = null

    while (fileStack.length > 0) {
      const file = fileStack.pop()
      if (file == null) break
      if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue

      if (file.type === 'directory') {
        if (EnhancementManager.smartImport && file.path.endsWith(EnhancementManager.importFolder)) {
          importDirectoryTree = file
          continue // skip imports
        }

        if (EnhancementManager.composeTriggers && file.path.endsWith(EnhancementManager.sourceFolder)) {
          log.debug('ComposeTriggers requested')
          promises.push((async (): Promise<void> => {
            const triggerJson = await TriggerComposer.composeTriggerJson(file)
            await exportTriggers(triggerJson, outputPath)
          })())

          continue // skip triggers
        }

        const children = file.children

        if (children != null) {
          for (const child of children) {
            fileStack.push(child)
          }
        }
      } else {
        let translator: Translator<unknown> | null = null

        if (!EnhancementManager.composeTriggers && file.name.endsWith(`triggers${EnhancementManager.mapDataExtension}`)) {
          promises.push(processTriggers(file.path, outputPath))
          continue
        }

        for (const [extension, thisTranslator] of Object.entries(translatorRecord)) {
          if (file.name.endsWith(extension)) {
            translator = thisTranslator
            break
          }
        }
        let outputFile = path.join(outputPath, path.relative(inputPath, file.path))
        if (translator != null) {
          outputFile = outputFile.substring(0, outputFile.lastIndexOf('.')) // remove final extension

          if (!EnhancementManager.smartImport || !(translator instanceof ImportsTranslator)) {
            promises.push(processFile(file.path, translator, outputFile))
          }
        } else {
          promises.push(copyFileWithDirCreation(file.path, outputFile))
        }
      }
    }

    if (EnhancementManager.smartImport) {
      log.debug('SmartImports requested')
      const importFileOutputPath = path.join(outputPath, 'war3map.imp')
      if (importDirectoryTree != null) {
        const importedFiles = ImportComposer.composeImportRegistry(importDirectoryTree)
        promises.push(exportImportsFile(importedFiles, importFileOutputPath))

        fileStack.push(importDirectoryTree)

        while (fileStack.length > 0) {
          const file = fileStack.pop()
          if (file == null) break

          if (file.type === 'directory') {
            const children = file.children

            if (children != null) {
              for (const child of children) {
                fileStack.push(child)
              }
            }
          } else {
            const outputFile = path.join(outputPath, path.relative(importDirectoryTree.path, file.path))
            promises.push(copyFileWithDirCreation(file.path, outputFile))
          }
        }
      } else {
        promises.push(exportImportsFile([], importFileOutputPath))
      }
    }

    await Promise.all(promises)
  }
}

export default Json2WarService
