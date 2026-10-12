import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type integer } from '../CommonInterfaces'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { MapLight } from '../data/MapLight'

const log = LoggerFactory.createLogger('MapLightTranslator')

export function jsonToWar(mapLightJson: MapLight, formatVersion: integer): Buffer {
  if (formatVersion < 3 || formatVersion > 3) {
    throw new Error(`Unknown map light format version=${formatVersion}, expected value 3`)
  }
  const output = new HexBuffer()
  output.addChars('W3L!')
  output.addInt(formatVersion)
  output.addString(mapLightJson.unitLightFilename)
  output.addString(mapLightJson.terrainLightFilename)
  output.addInt(+mapLightJson.useCustomUnitLight)
  output.addInt(+mapLightJson.useCustomTerrainLight)
  output.addInt(+mapLightJson.useCustomBothLights)
  return output.getBuffer()
}

export function warToJson(buffer: Buffer): [MapLight, integer] {
  const input = new W3Buffer(buffer)

  const fileId = input.readChars(4) // W3L!
  if (fileId !== 'W3L!') {
    log.warn(`Mismatched file format header, found '${fileId}', expected 'W3L!', will attempt parsing...`)
  }

  const formatVersion = input.readInt()
  if (formatVersion < 3 || formatVersion > 3) {
    log.warn(`Unknown map light format version ${formatVersion} will attempt at reading...`)
  } else {
    log.info(`Map light format version is ${formatVersion}.`)
  }

  const unitLightFilename = input.readString()
  const terrainLightFilename = input.readString()
  const useCustomUnitLight = !!input.readInt()
  const useCustomTerrainLight = !!input.readInt()
  const useCustomBothLights = !!input.readInt()

  return [{
    unitLightFilename: unitLightFilename,
    terrainLightFilename: terrainLightFilename,
    useCustomUnitLight: useCustomUnitLight,
    useCustomTerrainLight: useCustomTerrainLight,
    useCustomBothLights: useCustomBothLights
  }, formatVersion]
}