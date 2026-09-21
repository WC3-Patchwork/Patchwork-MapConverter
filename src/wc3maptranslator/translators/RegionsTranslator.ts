import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type integer, type color } from '../CommonInterfaces'
import { type Region } from '../data/Region'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { RegionDefaults } from '../default/Region'

const log = LoggerFactory.createLogger('RegionTranslator')

function bytesToHexString(...byteArray: integer[]): string {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

function hexStringToBytes(hex: string): integer[] {
  const bytes: integer[] = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substring(c, c + 2), 16))
  }
  return bytes
}

// json wants it in ARGB, but .w3r file stores it as BB GG RR AA
function colorBytesToHex(blue: integer, green: integer, red: integer, alpha: integer): color {
  return `#${bytesToHexString(alpha, red, green, blue)}`
}

// The order in .w3r is BB GG RR AA, whereas the JSON spec order is #AARRGGBB
function colorHexToBytes(hex: color): [integer, integer, integer, integer] {
  if (hex.startsWith('#') && hex.length === 9) {
    return hexStringToBytes(hex.substring(1)).reverse() as [integer, integer, integer, integer]
  } else {
    throw new Error(`Unable to parse ${hex} as color, expected '#AARRGGBB' format!`)
  }
}

export function jsonToWar(regionsJson: Region[], formatVersion: integer): Buffer {
  if (formatVersion < 0 || formatVersion > 7) {
    throw new Error(`Unknown regions format version=${formatVersion}, expected value from range [0, 7]`)
  }
  const output = new HexBuffer()
  output.addInt(formatVersion)
  output.addInt(regionsJson?.length ?? 0) // number of regions
  regionsJson?.forEach((region) => {
    if (formatVersion >= 2) {
      output.addFloat(region.position.left)
      output.addFloat(region.position.bottom)
      output.addFloat(region.position.right)
      output.addFloat(region.position.top)
    } else {
      output.addInt(region.position.left)
      output.addInt(region.position.bottom)
      output.addInt(region.position.right)
      output.addInt(region.position.top)
    }

    output.addString(region.name)
    output.addInt(region.id)

    if (formatVersion >= 3) {
      output.addChars(region.weatherEffect ?? RegionDefaults.weatherEffect)
    }

    if (formatVersion >= 4) {
      output.addString(region.ambientSound ?? RegionDefaults.ambientSound)
    }

    if (formatVersion >= 5) {
      colorHexToBytes(region.color ?? RegionDefaults.color).forEach((it) => {
        output.addByte(it)
      })
    }

    if (formatVersion >= 7) {
      output.addInt(+(region.blockCamera ?? RegionDefaults.blockCamera))
      output.addInt(+(region.alphaTileMinimapColor ?? RegionDefaults.alphaTileMinimapColor))
    }
  })

  return output.getBuffer()
}

export function warToJson(buffer: Buffer): [Region[], integer] {
  const result: Region[] = []
  const input = new W3Buffer(buffer)
  const formatVersion = input.readInt()
  if (formatVersion < 0 || formatVersion > 7) {
    log.warn(`Unknown regions format version ${formatVersion} will attempt at reading...`)
  } else {
    log.info(`Regions format version is ${formatVersion}.`)
  }

  const regionCount = input.readInt()
  for (let i = 0; i < regionCount; i++) {
    let left: number, bottom: number, right: number, top: number
    if (formatVersion >= 2) {
      left = input.readFloat()
      bottom = input.readFloat()
      right = input.readFloat()
      top = input.readFloat()
    } else {
      left = input.readInt()
      bottom = input.readInt()
      right = input.readInt()
      top = input.readInt()
    }
    const name = input.readString()

    let id: integer
    if (formatVersion > 0) {
      id = input.readInt()
    } else {
      id = i
    }

    let weatherEffect: string
    if (formatVersion >= 3) {
      weatherEffect = input.readChars(4)
    } else {
      weatherEffect = RegionDefaults.weatherEffect
    }

    let ambientSound: string
    if (formatVersion >= 4) {
      ambientSound = input.readString()
    } else {
      ambientSound = RegionDefaults.ambientSound
    }

    let color: color
    if (formatVersion >= 5) {
      color = colorBytesToHex(input.readByte(), input.readByte(), input.readByte(), input.readByte())
    } else {
      color = RegionDefaults.color
    }

    let blockCamera: boolean
    let alphaTileMinimapColor: boolean
    if (formatVersion >= 7) {
      blockCamera = !!input.readInt()
      alphaTileMinimapColor = !!input.readInt()
    } else {
      blockCamera = RegionDefaults.blockCamera
      alphaTileMinimapColor = RegionDefaults.alphaTileMinimapColor
    }

    result[i] = {
      position: { left, bottom, right, top },
      name,
      id,
      weatherEffect,
      ambientSound,
      color,
      blockCamera,
      alphaTileMinimapColor
    }
  }

  return [result, formatVersion]
}