import { LoggerFactory } from '../logging/LoggerFactory'
import { readFile, writeFile, mkdir } from 'fs/promises'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import path from 'path'
import { translatorRecord } from './TranslatorRecord'
import { type Translator } from 'wc3maptranslator'
import { copyFileWithDirCreation } from './FileCopier'

const log = LoggerFactory.createLogger('War2Json')

let translatorCount = 0
async function processFile<T> (input: string, translator: Translator<T>, output: string): Promise<boolean> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info('Processing', input)
  const buffer = await readFile(input)
  const result = translator.warToJson(buffer)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
    return false
  } else {
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, JSON.stringify(result.json), { encoding: 'utf8' })
    asyncLog.info('Finished processing', output)
    return true
  }
}

const War2JsonService = {
  convert: async function (inputPath: string, outputPath: string) {
    log.info('Converting Warcraft III binaries in', inputPath, 'and outputting to', outputPath)

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
          const outputFile = path.join(outputPath, path.relative(inputPath, file.path)) + '.json'
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

export default War2JsonService
