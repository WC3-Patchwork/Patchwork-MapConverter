import { LoggerFactory } from '../../logging/LoggerFactory'
import { type integer } from '../CommonInterfaces'
import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { Boundary, type Terrain } from '../data/Terrain'
import { TerrainDefaults } from '../default/Terrain'

const log = LoggerFactory.createLogger('TerrainTranslator')

function heightIntToFloat(heightVal: integer, cliffLevel: integer): number {
  return (heightVal - 8192 + (cliffLevel - 2) * 512) / 4
}

function heightFloatToInt(heightVal: number, cliffLevel: integer): integer {
  return (heightVal * 4) + 8192 - (cliffLevel - 2) * 512
}

export function jsonToWar(terrainJson: Terrain, formatVersion: number): Buffer {
  if (formatVersion < 3 || formatVersion > 12) {
    throw new Error(`Unknown terrain format version=${formatVersion}, expected value from range [3, 12]`)
  }
  const output = new HexBuffer()
  output.addChars('W3E!')
  output.addInt(formatVersion)

  if (formatVersion > 0x06) {
    output.addChar(terrainJson.tileset ?? TerrainDefaults.tileset)
    output.addInt(+(terrainJson.customTileset ?? TerrainDefaults.customTileset))
  }

  const tilePalette = terrainJson.tilePalette ?? TerrainDefaults.tilePalette
  output.addInt(tilePalette.length)
  tilePalette.forEach((tile) => {
    output.addChars(tile)
  })

  const cliffTilePalette = terrainJson.cliffTilePalette ?? TerrainDefaults.cliffTilePalette
  output.addInt(cliffTilePalette.length)
  cliffTilePalette.forEach((cliffTile) => {
    output.addChars(cliffTile)
  })

  output.addInt(terrainJson.map.sizeX + 1)
  output.addInt(terrainJson.map.sizeY + 1)

  const offsetX = terrainJson.map.offsetX ?? TerrainDefaults.map.offsetX
  const offsetY = terrainJson.map.offsetY ?? TerrainDefaults.map.offsetY
  if (formatVersion >= 0x0A) {
    output.addFloat(offsetX)
    output.addFloat(offsetY)
  }

  const sizeX = terrainJson.map.sizeX
  for (let i = terrainJson.map.sizeY; i >= 0; i--) {
    for (let j = 0; j <= sizeX; j++) {
      const groundTexture = terrainJson.groundTexture[i][j] as number
      const groundVariation = terrainJson.groundVariation[i][j] as number
      const groundHeight = terrainJson.groundHeight[i][j] as number
      const cliffTexture = terrainJson.cliffTexture[i][j] as number
      const cliffVariation = terrainJson.cliffVariation[i][j] as number
      const cliffLevel = terrainJson.cliffLevel[i][j] as number
      const waterHeight = terrainJson.waterHeight[i][j] as number
      const hasEdgeBoundary = terrainJson.boundary[i][j] === Boundary.Type1
      let flags = 0
      if (terrainJson.ramp[i][j]) flags |= 0x0010
      if (terrainJson.blight[i][j]) flags |= 0x0020
      if (terrainJson.water[i][j]) flags |= 0x0040
      if (terrainJson.boundary[i][j] === Boundary.Type2) flags |= 0x0080

      if (formatVersion < 0x0B) {
        if (formatVersion < 0x0A) {
          output.addInt(groundTexture)
          output.addInt(groundVariation)
        } else {
          output.addByte(groundTexture)
          output.addByte(groundVariation)
        }
        if (formatVersion < 0x08) {
          output.addFloat(128 * j + offsetX)
          output.addFloat(128 * i + offsetY)
          output.addFloat(groundHeight)
        } else {
          output.addInt(heightFloatToInt(groundHeight, cliffLevel))
          output.addShort(heightFloatToInt(waterHeight, cliffLevel))
        }
        output.addByte(cliffLevel)
        output.addByte(cliffTexture)
        output.addByte(cliffVariation)
        if (formatVersion > 0x03) {
          if (formatVersion < 0x0A) {
            output.addInt(flags)
          } else {
            output.addShort(flags)
          }
        }
        if (formatVersion > 0x04 && formatVersion < 0x08) {
          output.addFloat(waterHeight)
        }
      } else {
        output.addShort(heightFloatToInt(groundHeight, cliffLevel))
        output.addShort(heightFloatToInt(waterHeight, cliffLevel) & 0x3FFF | (hasEdgeBoundary ? 0x4000 : 0))
        if (formatVersion >= 0x0C) {
          output.addShort((groundTexture & 0x003F) | ((flags << 2) & 0xFFC0))
        } else {
          output.addByte((flags & 0xF0) | (groundTexture & 0x0F))
        }

        output.addByte(((cliffVariation << 5) & 0xE0) | (groundVariation & 0x1F))
        output.addByte(((cliffTexture << 4) & 0xF0) | (cliffLevel & 0x0F))
      }
    }
  }

  return output.getBuffer()
}

export function warToJson(buffer: Buffer): [Terrain, integer] {
  const input = new W3Buffer(buffer)
  const fileId = input.readChars(4)
  if (fileId !== 'W3E!') {
    log.warn(`Mismatched file format magic number, found '${fileId}', expected 'W3E!', will attempt parsing...`)
  }

  const formatVersion = input.readInt()
  if (formatVersion < 3 || formatVersion > 12) {
    log.warn(`Unknown terrain format version '${formatVersion}', expected value [3, 12], will attempt parsing...`)
  } else {
    log.info(`Terrain format version is ${formatVersion}.`)
  }

  let tileset: string
  let customTileset: boolean
  if (formatVersion >= 0x06) {
    tileset = input.readChars(1)
    customTileset = !!(input.readInt() & 0x01)
  } else {
    tileset = TerrainDefaults.tileset
    customTileset = TerrainDefaults.customTileset
  }

  const tileCount = input.readInt()
  const tileIds: string[] = []
  for (let i = 0; i < tileCount; i++) {
    tileIds.push(input.readChars(4))
  }

  const cliffTileIds: string[] = []
  if (formatVersion > 0x06) {
    const cliffTileCount = input.readInt()
    const cliffTileIds: string[] = []
    for (let i = 0; i < cliffTileCount; i++) {
      cliffTileIds.push(input.readChars(4))
    }
  }

  const sizeX = input.readInt() - 1
  const sizeY = input.readInt() - 1

  let offsetX: number
  let offsetY: number
  if (formatVersion >= 0x0A) {
    offsetX = input.readFloat()
    offsetY = input.readFloat()
  } else {
    offsetX = 0
    offsetY = 0
  }

  const arrGroundTexture: number[][] = []
  const arrGroundVariation: number[][] = []
  const arrCliffTexture: number[][] = []
  const arrCliffVariation: number[][] = []
  const arrCliffLevel: number[][] = []
  const arrGroundHeight: number[][] = []
  const arrWaterHeight: number[][] = []
  const arrRampFlag: boolean[][] = []
  const arrBlightFlag: boolean[][] = []
  const arrWaterFlag: boolean[][] = []
  const arrBoundaryFlag: Boundary[][] = []
  for (let i = sizeY; i >= 0; i--) {
    arrGroundTexture[i] = []
    arrGroundVariation[i] = []
    arrCliffTexture[i] = []
    arrCliffVariation[i] = []
    arrCliffLevel[i] = []
    arrGroundHeight[i] = []
    arrWaterHeight[i] = []
    arrRampFlag[i] = []
    arrBlightFlag[i] = []
    arrWaterFlag[i] = []
    arrBoundaryFlag[i] = []

    for (let j = 0; j <= sizeX; j++) {
      let groundHeight: number
      let waterHeight: number | null = null
      let flags: number | null = null
      let boundaryFlag: Boundary
      let groundTexture: integer
      let groundVariation: integer
      let cliffVariation: integer
      let cliffTexture: integer
      let cliffLevel: integer

      if (formatVersion < 0x0B) {
        if (formatVersion < 0x0A) {
          groundTexture = input.readInt()
          groundVariation = input.readInt()
        } else {
          groundTexture = input.readByte()
          groundVariation = input.readByte()
        }
        let convertHeight: boolean
        if (formatVersion < 0x08) {
          input.readFloat() // x -- ignored
          input.readFloat() // y -- ignored
          groundHeight = input.readFloat() // z
          convertHeight = false
        } else {
          groundHeight = input.readInt() & 0x3FFF // xy[z]
          waterHeight = input.readShort()
          convertHeight = true
        }
        cliffLevel = input.readByte()
        cliffTexture = input.readByte()
        cliffVariation = input.readByte()
        if (formatVersion > 0x03) {
          if (formatVersion < 0x0A) {
            flags = input.readInt()
          } else {
            flags = input.readShort()
          }
        }
        if (formatVersion > 0x04 && formatVersion < 0x08) {
          waterHeight = input.readFloat() // waterZ
        }
        if (convertHeight) {
          groundHeight = heightIntToFloat(groundHeight, cliffLevel)
          if (waterHeight != null) {
            waterHeight = heightIntToFloat(waterHeight, cliffLevel)
          }
        }

        waterHeight ??= TerrainDefaults.waterHeight
        boundaryFlag = Boundary.None
      } else {
        groundHeight = input.readShort()
        const waterHeightAndBoundary = input.readShort()
        waterHeight = waterHeightAndBoundary & 0x3FFF
        boundaryFlag = (waterHeightAndBoundary & 0x4000) ? Boundary.Type1 : Boundary.None

        if (formatVersion >= 0x0C) {
          const flagsAndGroundTexture = input.readShort()
          flags = (flagsAndGroundTexture & 0xFFC0) >> 2
          groundTexture = flagsAndGroundTexture & 0x3F
        } else {
          const flagsAndGroundTexture = input.readByte()
          flags = flagsAndGroundTexture & 0xF0
          groundTexture = flagsAndGroundTexture & 0x0F
        }

        const groundAndCliffVariation = input.readByte()
        const cliffTextureAndLayerHeight = input.readByte()
        groundVariation = groundAndCliffVariation & 0x1F
        cliffVariation = groundAndCliffVariation >> 5
        cliffTexture = cliffTextureAndLayerHeight >> 4
        cliffLevel = cliffTextureAndLayerHeight & 0x0F

        groundHeight = heightIntToFloat(groundHeight, cliffLevel)
        waterHeight = heightIntToFloat(waterHeight, cliffLevel)
      }

      if (flags != null) {
        arrRampFlag[i][j] = !!(flags | 0x0010)
        arrBlightFlag[i][j] = !!(flags | 0x0020)
        arrWaterFlag[i][j] = !!(flags | 0x0040)
        arrBoundaryFlag[i][j] = boundaryFlag === Boundary.None && !!(flags | 0x0080) ? Boundary.Type2 : boundaryFlag
      } else {
        arrRampFlag[i][j] = TerrainDefaults.ramp
        arrBlightFlag[i][j] = TerrainDefaults.blight
        arrWaterFlag[i][j] = TerrainDefaults.water
        arrBoundaryFlag[i][j] = TerrainDefaults.boundary
      }

      arrGroundTexture[i][j] = groundTexture
      arrGroundVariation[i][j] = groundVariation
      arrCliffTexture[i][j] = cliffTexture
      arrCliffVariation[i][j] = cliffVariation
      arrCliffLevel[i][j] = cliffLevel
      arrGroundHeight[i][j] = groundHeight
      arrWaterHeight[i][j] = waterHeight
    }
  }

  return [{
    tileset,
    customTileset,
    tilePalette     : tileIds,
    cliffTilePalette: cliffTileIds,
    map             : { sizeX, sizeY, offsetX, offsetY },
    groundTexture   : arrGroundTexture,
    groundVariation : arrGroundVariation,
    cliffTexture    : arrCliffTexture,
    cliffVariation  : arrCliffVariation,
    cliffLevel      : arrCliffLevel,
    groundHeight    : arrGroundHeight,
    waterHeight     : arrWaterHeight,
    boundary        : arrBoundaryFlag,
    ramp            : arrRampFlag,
    blight          : arrBlightFlag,
    water           : arrWaterFlag
  }, formatVersion]
}