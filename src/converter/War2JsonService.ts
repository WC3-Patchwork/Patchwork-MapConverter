import { LoggerFactory } from '../logging/LoggerFactory'
import {
  CamerasTranslator,
  DoodadsTranslator,
  ImportsTranslator,
  InfoTranslator,
  ObjectsTranslator,
  RegionsTranslator,
  SoundsTranslator,
  StringsTranslator,
  TerrainTranslator,
  type Translator,
  UnitsTranslator,
  Data
} from 'wc3maptranslator'
import { readFile, writeFile, copyFile, mkdir } from 'fs/promises'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import path from 'path'

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

let copyCount = 0
async function copyFileWithDirCreation (input: string, output: string): Promise<undefined> {
  const asyncLog = log.getSubLogger({ name: `Copier-${copyCount++}` })
  asyncLog.info('Copying', input)
  await mkdir(path.dirname(output), { recursive: true })
  await copyFile(input, output)
  asyncLog.info('Copied into', output)
}

const translatorRecord: Record<string, Translator<unknown>> = {
  // World files
  '.w3e': TerrainTranslator.getInstance() as Translator<unknown>,
  'Units.doo': UnitsTranslator.getInstance() as Translator<unknown>,
  '.doo': DoodadsTranslator.getInstance() as Translator<unknown>,
  '.w3r': RegionsTranslator.getInstance() as Translator<unknown>,
  '.w3c': CamerasTranslator.getInstance() as Translator<unknown>,
  '.w3s': SoundsTranslator.getInstance() as Translator<unknown>,

  // Object data files
  '.w3u': ObjectsTranslator.getInstance(Data.ObjectType.Units) as Translator<unknown>,
  '.w3t': ObjectsTranslator.getInstance(Data.ObjectType.Items) as Translator<unknown>,
  '.w3a': ObjectsTranslator.getInstance(Data.ObjectType.Abilities) as Translator<unknown>,
  '.w3b': ObjectsTranslator.getInstance(Data.ObjectType.Destructables) as Translator<unknown>,
  '.w3d': ObjectsTranslator.getInstance(Data.ObjectType.Doodads) as Translator<unknown>,
  '.w3q': ObjectsTranslator.getInstance(Data.ObjectType.Upgrades) as Translator<unknown>,
  '.w3h': ObjectsTranslator.getInstance(Data.ObjectType.Buffs) as Translator<unknown>,

  // Trigger files
  // '.lua': MISSING
  // '.j': MISSING
  '.wts': StringsTranslator.getInstance() as Translator<unknown>,

  // Map files
  '.w3i': InfoTranslator.getInstance() as Translator<unknown>,
  '.imp': ImportsTranslator.getInstance() as Translator<unknown>
  // '.wpm': MISSING
  // '.shd': MISSING
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
