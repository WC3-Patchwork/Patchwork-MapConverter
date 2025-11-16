import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type Terrain } from '../data/Terrain'

function splitLargeArrayIntoWidthArrays (array: unknown[], width: number): unknown[][] {
  const rows: unknown[][] = []
  for (let i = 0; i < array.length / width; i++) {
    rows.push(array.slice(i * width, (i + 1) * width))
  }
  return rows
}

export function jsonToWar (terrainJson: Terrain): Buffer {
  const output = new HexBuffer()

  /*
         * Header
         */
  output.addChars('W3E!') // file id
  output.addInt(12) // file version
  output.addChar(terrainJson.tileset) // base tileset
  output.addInt(+terrainJson.customTileset) // 1 = using custom tileset, 0 = not

  /*
         * Tiles
         */
  output.addInt(terrainJson.tilePalette?.length || 0)
  terrainJson.tilePalette?.forEach((tile) => {
    output.addChars(tile)
  })

  /*
         * Cliffs
         */
  output.addInt(terrainJson.cliffTilePalette?.length || 0)
  terrainJson.cliffTilePalette?.forEach((cliffTile) => {
    output.addChars(cliffTile)
  })

  /*
         * Map size data
         */
  output.addInt(terrainJson.map.width + 1)
  output.addInt(terrainJson.map.height + 1)

  /*
         * Map offset
         */
  output.addFloat(terrainJson.map.offset.x)
  output.addFloat(terrainJson.map.offset.y)

  /*
         * Tile points
         */
  // Partition the terrainJson masks into "chunks" (i.e. rows) of (width+1) length,
  // reverse that list of rows (due to vertical flipping), and then write the rows out
  const rows = {
    groundHeight: splitLargeArrayIntoWidthArrays(terrainJson.groundHeight, terrainJson.map.width + 1) as number[][],
    waterHeight: splitLargeArrayIntoWidthArrays(terrainJson.waterHeight, terrainJson.map.width + 1) as number[][],
    boundaryFlag: splitLargeArrayIntoWidthArrays(terrainJson.boundaryFlag, terrainJson.map.width + 1) as boolean[][],
    flags: splitLargeArrayIntoWidthArrays(terrainJson.flags, terrainJson.map.width + 1) as number[][],
    groundTexture: splitLargeArrayIntoWidthArrays(terrainJson.groundTexture, terrainJson.map.width + 1) as number[][],
    groundVariation: splitLargeArrayIntoWidthArrays(terrainJson.groundVariation, terrainJson.map.width + 1) as number[][],
    cliffVariation: splitLargeArrayIntoWidthArrays(terrainJson.cliffVariation, terrainJson.map.width + 1) as number[][],
    cliffTexture: splitLargeArrayIntoWidthArrays(terrainJson.cliffTexture, terrainJson.map.width + 1) as number[][],
    layerHeight: splitLargeArrayIntoWidthArrays(terrainJson.layerHeight, terrainJson.map.width + 1) as number[][],
    tileset: '',
    customTileset: false,
    tilePalette: [],
    cliffTilePalette: []
  }

  rows.groundHeight.reverse()
  rows.waterHeight.reverse()
  rows.boundaryFlag.reverse()
  rows.flags.reverse()
  rows.groundTexture.reverse()
  rows.groundVariation.reverse()
  rows.cliffVariation.reverse()
  rows.cliffTexture.reverse()
  rows.layerHeight.reverse()

  for (let i = 0; i < rows.groundHeight.length; i++) {
    for (let j = 0; j < rows.groundHeight[i].length; j++) {
      // these bit operations are based off documentation from https://github.com/stijnherfst/HiveWE/wiki/war3map.w3e-Terrain
      const groundHeight = rows.groundHeight[i][j]
      const waterHeight = rows.waterHeight[i][j]
      const boundaryFlag = rows.boundaryFlag[i][j]
      const flags = rows.flags[i][j]
      const groundTexture = rows.groundTexture[i][j]
      const groundVariation = rows.groundVariation[i][j]
      const cliffVariation = rows.cliffVariation[i][j]
      const cliffTexture = rows.cliffTexture[i][j]
      const layerHeight = rows.layerHeight[i][j]

      const hasBoundaryFlag = boundaryFlag ? 0x4000 : 0

      output.addShort(groundHeight)
      output.addShort(waterHeight | hasBoundaryFlag)
      output.addShort((flags << 2) | groundTexture)
      output.addByte(groundVariation | cliffVariation)
      output.addByte(cliffTexture | layerHeight)
    }
  }

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): Terrain {
  const input = new W3Buffer(buffer)

  const w3eHeader = input.readChars(4) // W3E!
  const formatVersion = input.readInt()

  if (formatVersion < 0x03) {
    // does not read, throw error?
  }
  if (formatVersion >= 0x0C) {
    // throw error?
  }

  let tileset: string
  let customTileset: boolean
  if (formatVersion >= 0x06) {
    tileset = input.readChars(1)
    customTileset = (input.readInt() === 1)
  } else {
    tileset = '\0'
    customTileset = true
  }

  const tileCount = input.readInt()
  const tileIds: string[] = []
  for (let i = 0; i < tileCount; i++) {
    tileIds.push(input.readChars(4))
  }

  const cliffTileIds: string[] = []
  if (formatVersion >= 0x06) {
    const cliffTileCount = input.readInt()
    const cliffTileIds: string[] = []
    for (let i = 0; i < cliffTileCount; i++) {
      cliffTileIds.push(input.readChars(4))
    }
  }

  const width = input.readInt() - 1
  const height = input.readInt() - 1

  let offsetX: number
  let offsetY: number
  if (formatVersion >= 0x0A) {
    offsetX = input.readFloat()
    offsetY = input.readFloat()
  } else {
    offsetX = 0
    offsetY = 0
  }

  const arrGroundHeight: number[] = []
  const arrWaterHeight: number[] = []
  const arrBoundaryFlag: boolean[] = []
  const arrFlags: number[] = []
  const arrGroundTexture: number[] = []
  const arrGroundVariation: number[] = []
  const arrCliffVariation: number[] = []
  const arrCliffTexture: number[] = []
  const arrLayerHeight: number[] = []

  while (!input.isExhausted()) {
    const groundHeight = input.readShort()
    const waterHeightAndBoundary = input.readShort()
    const waterHeight = waterHeightAndBoundary & 32767
    const boundaryFlag = (waterHeightAndBoundary & 0x4000) === 0x4000

    let flags: number
    let groundTexture: number
    if (formatVersion >= 12) {
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

    const groundVariation = groundAndCliffVariation & 0xF8
    const cliffVariation = groundAndCliffVariation & 0x07
    const cliffTexture = cliffTextureAndLayerHeight & 0XF0
    const layerHeight = cliffTextureAndLayerHeight & 0x0F

    arrGroundHeight.push(groundHeight)
    arrWaterHeight.push(waterHeight)
    arrBoundaryFlag.push(boundaryFlag)
    arrFlags.push(flags) // TODO: properly parse flags
    arrGroundTexture.push(groundTexture)
    arrGroundVariation.push(groundVariation)
    arrCliffVariation.push(cliffVariation)
    arrCliffTexture.push(cliffTexture)
    arrLayerHeight.push(layerHeight)
  }

  function convertArrayOfArraysIntoFlatArray (arr: unknown[][]): unknown {
    return arr.reduce((a: unknown[], b: unknown[]) => {
      return [...a, ...b]
    })
  }

  // The map was read in "backwards" because wc3 maps have origin (0,0)
  // at the bottom left instead of top left as we desire. Flip the rows
  // vertically to fix this.
  result.groundHeight = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrGroundHeight, result.map.width + 1).reverse()) as number[][]
  result.waterHeight = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrWaterHeight, result.map.width + 1).reverse()) as number[][]
  result.boundaryFlag = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrBoundaryFlag, result.map.width + 1).reverse()) as boolean[][]
  result.flags = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrFlags, result.map.width + 1).reverse()) as number[]
  result.groundTexture = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrGroundTexture, result.map.width + 1).reverse()) as number[][]
  result.groundVariation = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrGroundVariation, result.map.width + 1).reverse()) as number[][]
  result.cliffVariation = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrCliffVariation, result.map.width + 1).reverse()) as number[][]
  result.cliffTexture = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrCliffTexture, result.map.width + 1).reverse()) as number[][]
  result.layerHeight = convertArrayOfArraysIntoFlatArray(splitLargeArrayIntoWidthArrays(arrLayerHeight, result.map.width + 1).reverse()) as number[][]

  return result
}
