import { LoggerFactory } from '../logging/LoggerFactory'
import { readFile, writeFile, mkdir } from 'fs/promises'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import path from 'path'
import { translatorRecord } from './TranslatorRecord'
import { type Data, ImportsTranslator, type Translator } from 'wc3maptranslator'
import { copyFileWithDirCreation } from './FileCopier'
import EnhancementManager from '../enhancements/EnhancementManager'
import { type TriggerContainer } from '../translator/data/Trigger'
import { TriggersTranslator } from '../translator/TriggerTranslator'
import { CustomScriptsTranslator } from '../translator/CustomScriptsTranslator'

const log = LoggerFactory.createLogger('War2Json')

let translatorCount = 0
async function processFile<T> (input: string, translator: Translator<T>, output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Processing', input)
  const buffer = await readFile(input)
  const result = translator.warToJson(buffer)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
  } else {
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, JSON.stringify(result.json), { encoding: 'utf8' })
    asyncLog.info('Finished processing', output)
  }
}

async function processImportsRegistry (importsFile: string): Promise<Data.Import[]> {
  const translator = ImportsTranslator.getInstance()
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Reading war3map.imp file.')
  const buffer = await readFile(importsFile)
  const result = translator.warToJson(buffer)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
    throw new Error('Failed reading imports file.')
  } else {
    asyncLog.info('Read war3map.imp, found', result.json.length, 'imports')
    return result.json
  }
}

async function processTriggers (triggersFile: string, customScriptsFile?: string): Promise<TriggerContainer[]> {
  const triggerTranslator = TriggersTranslator.getInstance()
  const customScriptTranslator = CustomScriptsTranslator.getInstance()
  const asyncLog = log.getSubLogger({ name: `${triggerTranslator.constructor.name}-${translatorCount++}` })

  asyncLog.info('Reading war3map.wtg file.')
  const triggerBuffer = await readFile(triggersFile)
  const triggerResult = triggerTranslator.warToJson(triggerBuffer)
  if (triggerResult.errors != null && triggerResult.errors.length > 0) {
    for (const error of triggerResult.errors) {
      asyncLog.error(error)
    }
    throw new Error('Failed reading triggers file.')
  }
  const triggerJson = triggerResult.json
  asyncLog.info('Read war3map.wtg file.')

  if (customScriptsFile != null) {
    asyncLog.info('Reading war3map.wct file.')
    const csBuffer = await readFile(customScriptsFile)
    const csResults = customScriptTranslator.warToJson(csBuffer)
    if (csResults.errors != null && csResults.errors.length > 0) {
      for (const error of csResults.errors) {
        asyncLog.error(error)
      }
      throw new Error('Failed reading custom scripts file.')
    }
    asyncLog.info('Read war3map.wct file, found', csResults.json.length, 'custom scripts.')

    // Combine custom scripts into trigger JSON
    for (let i = 0; i < triggerJson.scriptReferences.length; i++) {
      triggerJson.scriptReferences[i].script = csResults.json[i]
    }
  }

  return triggerJson.roots
}

const War2JsonService = {
  convert: async function (inputPath: string, outputPath: string) {
    log.info('Converting Warcraft III binaries in', inputPath, 'and outputting to', outputPath)

    const promises: Array<Promise<unknown>> = []
    const fileStack: Array<DirectoryTree<Record<string, unknown>>> = [directoryTree(inputPath, { attributes: ['type', 'extension'] })]

    const copyFiles: Record<string, string> = {}
    let importFile: string | null = null
    let triggerFile: string | null = null
    let customScriptFile: { input: string, output: string } | null = null

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
        let translator: Translator<unknown> | null = null
        for (const [extension, thisTranslator] of Object.entries(translatorRecord)) {
          if (file.name.includes(extension)) {
            translator = thisTranslator
            break
          }
        }
        if (translator != null) {
          if (EnhancementManager.smartImport && (translator instanceof ImportsTranslator)) {
            importFile = file.path
          } else if (translator instanceof TriggersTranslator) {
            triggerFile = file.path
          } else if (translator instanceof CustomScriptsTranslator) {
            const outputFile = path.join(outputPath, path.relative(inputPath, file.path)) + '.json'
            customScriptFile = { input: file.path, output: outputFile }
          } else {
            const outputFile = path.join(outputPath, path.relative(inputPath, file.path)) + '.json'
            promises.push(processFile(file.path, translator, outputFile))
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
        await writeFile(path.join(outputPath, 'triggers.json'), JSON.stringify(triggerJSON), { encoding: 'utf8' })
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

    return await Promise.all(promises)
  }
}

export default War2JsonService
