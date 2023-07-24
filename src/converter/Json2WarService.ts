import path from 'path'
import { LoggerFactory } from '../logging/LoggerFactory'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import { type Translator } from 'wc3maptranslator'
import { translatorRecord } from './TranslatorRecord'
import { copyFileWithDirCreation } from './FileCopier'
import { mkdir, readFile, writeFile } from 'fs/promises'

const log = LoggerFactory.createLogger('Json2War')

let translatorCount = 0
async function processFile<T> (input: string, translator: Translator<T>, output: string): Promise<boolean> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Processing', input)
  const buffer = JSON.parse(await readFile(input, { encoding: 'utf8' })) as T
  const result = translator.jsonToWar(buffer)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
    return false
  } else {
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, result.buffer)
    asyncLog.info('Finished processing', output)
    return true
  }
}

const Json2WarService = {
  convert: async function (inputPath: string, outputPath: string) {
    log.info(`Converting Warcraft III json data in '${inputPath}' and outputting to '${outputPath}'`)

    const promises: Array<Promise<boolean> | Promise<void>> = []
    const fileStack: Array<DirectoryTree<Record<string, unknown>>> = [directoryTree(inputPath, { attributes: ['type', 'extension'] })]

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
        for (const entry of Object.entries(translatorRecord)) {
          const searchString = entry[0]
          if (file.name.includes(searchString)) {
            translator = entry[1]
            break
          }
        }
        if (translator != null) {
          let outputFile = path.join(outputPath, path.relative(inputPath, file.path))
          outputFile = outputFile.substring(0, outputFile.lastIndexOf('.')) // remove .json extension
          promises.push(processFile(file.path, translator, outputFile))
        } else {
          const outputFile = path.join(outputPath, path.relative(inputPath, file.path))
          promises.push(copyFileWithDirCreation(file.path, outputFile))
        }
      }
    }

    return await Promise.all(promises)
  }
}

export default Json2WarService
