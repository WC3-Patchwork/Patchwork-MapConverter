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
async function processFile<T> (file: string, translator: Translator<T>, output: string): Promise<boolean> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` })
  asyncLog.info(`Starting processing ${file}`)
  const buffer = await readFile(file)
  const result = translator.warToJson(buffer)
  if (result.errors != null && result.errors.length > 0) {
    for (const error of result.errors) {
      asyncLog.error(error)
    }
    return false
  } else {
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, JSON.stringify(result.json), { encoding: 'utf8' })
    asyncLog.info(`Finished processing ${file}`)
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

const unitsRegex = /units/i
const War2JsonService = {
  convert: async function (inputPath: string, outputPath: string) {
    log.info(`Converting Warcraft III binaries in '${inputPath}' and outputting to '${outputPath}'`)

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

        switch (file.extension) {
          // World files
          case '.w3e': // Terrain
            translator = TerrainTranslator.getInstance() as Translator<unknown>
            break
          case '.doo':
            if (unitsRegex.test(file.name)) { // Preplaced units
              translator = UnitsTranslator.getInstance() as Translator<unknown>
            } else { // Doodads
              translator = DoodadsTranslator.getInstance() as Translator<unknown>
            }
            break
          case '.w3r': // Regions
            translator = RegionsTranslator.getInstance() as Translator<unknown>
            break
          case '.w3c': // Cameras
            translator = CamerasTranslator.getInstance() as Translator<unknown>
            break
          case '.w3s': // Sound definitions
            translator = SoundsTranslator.getInstance() as Translator<unknown>
            break

            // Object data files
          case '.w3u': // Units - Objects
            translator = ObjectsTranslator.getInstance(Data.ObjectType.Units) as Translator<unknown>
            break
          case '.w3t': // Items - Objects
            translator = ObjectsTranslator.getInstance(Data.ObjectType.Items) as Translator<unknown>
            break
          case '.w3a': // Abilities - Objects
            translator = ObjectsTranslator.getInstance(Data.ObjectType.Abilities) as Translator<unknown>
            break
          case '.w3b': // Destructables - Objects
            translator = ObjectsTranslator.getInstance(Data.ObjectType.Destructables) as Translator<unknown>
            break
          case '.w3d': // Doodads - Objects
            translator = ObjectsTranslator.getInstance(Data.ObjectType.Doodads) as Translator<unknown>
            break
          case '.w3q': // Upgrades - Objects
            translator = ObjectsTranslator.getInstance(Data.ObjectType.Upgrades) as Translator<unknown>
            break
          case '.w3h': // Buffs - Objects
            translator = ObjectsTranslator.getInstance(Data.ObjectType.Buffs) as Translator<unknown>
            break

            // Trigger files
            // case 'lua': // Lua
            //   break
            // case 'j': // Jass
            //   break
          case '.wts': // Strings
            translator = StringsTranslator.getInstance() as Translator<unknown>
            break

            // Map files
          case '.w3i': // Info
            translator = InfoTranslator.getInstance() as Translator<unknown>
            break
          case '.imp': // Imported files
            translator = ImportsTranslator.getInstance() as Translator<unknown>
            break
            // case 'wpm': // Pathing
            //   break
            // case 'war3map.shd': // Shadow map
            //   break
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
