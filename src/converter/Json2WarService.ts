import path from 'path'
import { LoggerFactory } from '../logging/LoggerFactory'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import { ImportsTranslator, type Translator, type Data } from 'wc3maptranslator'
import { translatorRecord } from './TranslatorRecord'
import { copyFileWithDirCreation } from './FileCopier'
import { mkdir, readFile, writeFile } from 'fs/promises'

import EnhancementManager from '../enhancements/EnhancementManager'
import ImportComposer from '../enhancements/ImportComposer'
import { type TriggerTranslatorOutput, TriggersTranslator } from '../translator/TriggerTranslator'
import { CustomScriptsTranslator } from '../translator/CustomScriptsTranslator'
import { type TriggerContainer } from '../translator/data/TriggerContainer'
import { ContentType, type TriggerContent } from '../translator/data/content/TriggerContent'
import { type ScriptContent } from '../translator/data/properties/ScriptContent'
import { type MapHeader } from '../translator/data/MapHeader'

const log = LoggerFactory.createLogger('Json2War')

let translatorCount = 0
async function processFile<T> (input: string, translator: Translator<T>, output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Processing', input)
  const buffer = JSON.parse(await readFile(input, { encoding: 'utf8' })) as T
  const result = translator.jsonToWar(buffer)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
  } else {
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, result.buffer)
    asyncLog.info('Finished processing', output)
  }
}

async function exportImportsFile (data: Data.Import[], output: string): Promise<void> {
  const translator = ImportsTranslator.getInstance()
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Exporting generated war3map.imp file.')
  const result = translator.jsonToWar(data)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
  } else {
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, result.buffer)
    asyncLog.info('Finished exporting', output)
  }
}

function getAllWithProperty (roots: TriggerContainer[], propertyName: string): TriggerContent[] {
  const triggerStack: TriggerContent[] = [...roots.reverse()]
  const result: TriggerContent[] = []
  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue

    if ((currentTrigger as unknown as Record<string, unknown>)[propertyName] != null) {
      result.push(currentTrigger)
    }
    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
      case ContentType.LIBRARY:
      case ContentType.CATEGORY:
        triggerStack.push(...(currentTrigger as TriggerContainer).children.reverse())
    }
  }

  return result
}

async function exportTriggers (input: string, output: string): Promise<void> {
  const tasks: Array<Promise<unknown>> = []
  const triggerTranslator = TriggersTranslator.getInstance()
  const triggerLog = log.getSubLogger({ name: `${triggerTranslator.constructor.name}-${translatorCount++}` })
  triggerLog.info('Reading triggers.json file')
  const buffer = JSON.parse(await readFile(input, { encoding: 'utf8' })) as TriggerContainer[]
  const triggerAndScript: TriggerTranslatorOutput = {
    roots: buffer,
    scriptReferences: getAllWithProperty(buffer, 'script') as ScriptContent[]
  }
  const triggerResult = triggerTranslator.jsonToWar(triggerAndScript)
  tasks.push(writeFile(path.join(output, 'war3map.wtg'), triggerResult.buffer)
    .then(() => triggerLog.info('Finished exporting triggers.')))

  const scriptTranslator = CustomScriptsTranslator.getInstance()
  const scriptLog = log.getSubLogger({ name: `${scriptTranslator.constructor.name}-${translatorCount++}` })

  const scriptArg: { headerComments: string[], scripts: string[] } = { headerComments: [], scripts: [] }
  for (const trigger of triggerAndScript.scriptReferences) {
    if ((trigger as MapHeader).children != null) { // Found header
      scriptArg.headerComments.push(trigger.description)
    }
    scriptArg.scripts.push(trigger.script)
  }

  const scriptResult = scriptTranslator.jsonToWar(scriptArg)
  tasks.push(writeFile(path.join(output, 'war3map.wct'), scriptResult.buffer)
    .then(() => scriptLog.info('Finished exporting custom scripts.')))

  await Promise.all(tasks)
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

      if (file.type === 'directory') {
        if (EnhancementManager.smartImport && file.path.endsWith(EnhancementManager.importFolder)) {
          importDirectoryTree = file
          continue // skip imports
        }
        const children = file.children

        if (children != null) {
          for (const child of children) {
            fileStack.push(child)
          }
        }
      } else {
        let translator: Translator<unknown> | null = null

        if (file.name.endsWith('triggers.json')) {
          promises.push(exportTriggers(file.path, outputPath))
          continue
        }

        for (const [extension, thisTranslator] of Object.entries(translatorRecord)) {
          if (file.name.includes(extension)) {
            translator = thisTranslator
            break
          }
        }
        let outputFile = path.join(outputPath, path.relative(inputPath, file.path))
        if (translator != null) {
          outputFile = outputFile.substring(0, outputFile.lastIndexOf('.')) // remove .json extension

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
