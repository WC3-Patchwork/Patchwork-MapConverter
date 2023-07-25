import path from 'path'
import { LoggerFactory } from '../logging/LoggerFactory'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import { ImportsTranslator, type Translator, type Data } from 'wc3maptranslator'
import { translatorRecord } from './TranslatorRecord'
import { copyFileWithDirCreation } from './FileCopier'
import { mkdir, readFile, writeFile } from 'fs/promises'

import EnhancementManager from '../enhancements/EnhancementManager'
import ImportComposer from '../enhancements/ImportComposer'

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
        for (const [extension, thisTranslator] of Object.entries(translatorRecord)) {
          if (file.name.includes(extension)) {
            translator = thisTranslator
            break
          }
        }
        if (translator != null) {
          let outputFile = path.join(outputPath, path.relative(inputPath, file.path))
          outputFile = outputFile.substring(0, outputFile.lastIndexOf('.')) // remove .json extension

          if (!EnhancementManager.smartImport || !(translator instanceof ImportsTranslator)) {
            promises.push(processFile(file.path, translator, outputFile))
          }
        } else {
          const outputFile = path.join(outputPath, path.relative(inputPath, file.path))
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
