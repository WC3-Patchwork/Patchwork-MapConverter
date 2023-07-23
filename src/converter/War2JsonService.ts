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
import { readdirSync } from 'fs'
import { readFile, writeFile, copyFile } from 'fs/promises'

const log = LoggerFactory.createLogger('War2Json')

async function processFile<T> (file: string, translator: Translator<T>, output: string): Promise<boolean> {
  log.info(`Starting processing ${file}`)
  const buffer = await readFile(file)
  const result = translator.warToJson(buffer)
  if (result.errors != null) {
    for (const error of result.errors) {
      log.error(error)
    }
    return false
  } else {
    await writeFile(output, JSON.stringify(result.json), { encoding: 'utf8' })
    return true
  }
}

const War2JsonService = {
  convert: async function (inputPath: string, outputPath: string) {
    log.info(`Converting Warcraft III binaries in '${inputPath}' and outputting to '${outputPath}'`)

    const promises: Array<Promise<boolean> | Promise<void>> = []
    for (const file of readdirSync(inputPath, { withFileTypes: true, recursive: true })) {
      if (file.isDirectory()) {
        continue
      }

      let translator: Translator<any> | null = null
      switch (file.name) {
        // World files
        case 'war3map.w3e': // Terrain
          translator = TerrainTranslator.getInstance()
          break
        case 'war3mapUnits.doo': // Preplaced units
          translator = UnitsTranslator.getInstance()
          break
        case 'war3map.doo': // Doodads
          translator = DoodadsTranslator.getInstance()
          break
        case 'war3map.w3r': // Regions
          translator = RegionsTranslator.getInstance()
          break
        case 'war3map.w3c': // Cameras
          translator = CamerasTranslator.getInstance()
          break
        case 'war3map.w3s': // Sound definitions
          translator = SoundsTranslator.getInstance()
          break

          // Object data files
        case 'war3map.w3u': // Units - Objects
          translator = ObjectsTranslator.getInstance(Data.ObjectType.Units)
          break
        case 'war3map.w3t': // Items - Objects
          translator = ObjectsTranslator.getInstance(Data.ObjectType.Items)
          break
        case 'war3map.w3a': // Abilities - Objects
          translator = ObjectsTranslator.getInstance(Data.ObjectType.Abilities)
          break
        case 'war3map.w3b': // Destructables - Objects
          translator = ObjectsTranslator.getInstance(Data.ObjectType.Destructables)
          break
        case 'war3map.w3d': // Doodads - Objects
          translator = ObjectsTranslator.getInstance(Data.ObjectType.Doodads)
          break
        case 'war3map.w3q': // Upgrades - Objects
          translator = ObjectsTranslator.getInstance(Data.ObjectType.Upgrades)
          break
        case 'war3map.w3h': // Buffs - Objects
          translator = ObjectsTranslator.getInstance(Data.ObjectType.Buffs)
          break

          // Trigger files
          // case 'war3map.lua': // Lua
          //   break
          // case 'war3map.j': // Jass
          //   break
        case 'war3map.wts': // Strings
          translator = StringsTranslator.getInstance()
          break

          // Map files
        case 'war3map.w3i': // Info
          translator = InfoTranslator.getInstance()
          break
        case 'war3map.imp': // Imported files
          translator = ImportsTranslator.getInstance()
          break
          // case 'war3map.wpm': // Pathing
          //   break
          // case 'war3map.shd': // Shadow map
          //   break
      }
      const filepath = `${inputPath}\\${file.name}`
      if (translator != null) {
        const outputFile = `${outputPath}\\${file.name}.json`
        promises.push(processFile(filepath, translator, outputFile))
      } else {
        const outputFile = `${outputPath}\\${file.name}`
        promises.push(copyFile(filepath, outputFile))
      }
    }

    return await Promise.all(promises)
  }
}

export default War2JsonService
