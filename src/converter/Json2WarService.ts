import path from 'path'
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
  UnitsTranslator
} from 'wc3maptranslator'

const log = LoggerFactory.createLogger('Json2War')

const Json2WarService = {
  convert: function (inputPath: string, outputPath: string) {
    log.info(`Converting Warcraft III json data in '${inputPath}' and outputting to '${outputPath}'`)
    const input = path.parse(inputPath)
    const output = path.parse(outputPath)
  }
}

export default Json2WarService
