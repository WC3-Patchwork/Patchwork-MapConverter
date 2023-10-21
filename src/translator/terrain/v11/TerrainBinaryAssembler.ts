import { Service } from 'typedi'
import { type JsonToBinaryConverter } from '../../JsonToBinaryConverter'
import { type Terrain } from '../../../data/editor/terrain/Terrain'
import { type HexBuffer } from '../../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../../BinaryTranslationResult'
import { ArrayManipulationUtils } from '../../../util/ArrayManipulationUtils'

@Service()
export class TerrainBinaryAssembler implements JsonToBinaryConverter<Terrain> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length >= 2 && metadata[0] === 'W3E!' && metadata[1] === 11
  }

  public translate (outBufferToWar: HexBuffer, data: Terrain, ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors: Error[] = []
    const warnings: Error[] = []

    /*
    * Header
    */
    outBufferToWar.addChars('W3E!') // file id
    outBufferToWar.addInt(11) // file version
    outBufferToWar.addChar(data.tileset) // base tileset
    outBufferToWar.addInt(+data.customTileset) // 1 = using custom tileset, 0 = not

    /*
         * Tiles
         */
    outBufferToWar.addInt(data.tilePalette.length)
    data.tilePalette.forEach((tile) => {
      outBufferToWar.addChars(tile)
    })

    /*
         * Cliffs
         */
    outBufferToWar.addInt(data.cliffTilePalette.length)
    data.cliffTilePalette.forEach((cliffTile) => {
      outBufferToWar.addChars(cliffTile)
    })

    /*
         * Map size data
         */
    outBufferToWar.addInt(data.map.width + 1)
    outBufferToWar.addInt(data.map.height + 1)

    /*
         * Map offset
         */
    outBufferToWar.addFloat(data.map.offset.x)
    outBufferToWar.addFloat(data.map.offset.y)

    /*
         * Tile points
         */
    // Partition the terrainJson masks into "chunks" (i.e. rows) of (width+1) length,
    // reverse that list of rows (due to vertical flipping), and then write the rows out
    const rows = {
      groundHeight: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.groundHeight, data.map.width + 1),
      waterHeight: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.waterHeight, data.map.width + 1),
      boundaryFlag: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.boundaryFlag, data.map.width + 1),
      flags: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.flags, data.map.width + 1),
      groundTexture: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.groundTexture, data.map.width + 1),
      groundVariation: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.groundVariation, data.map.width + 1),
      cliffVariation: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.cliffVariation, data.map.width + 1),
      cliffTexture: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.cliffTexture, data.map.width + 1),
      layerHeight: ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(data.layerHeight, data.map.width + 1),
      tileset: '',
      customTileset: false,
      tilePalette: [],
      cliffTilePalette: [],
      map: undefined
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

        outBufferToWar.addShort(groundHeight)
        outBufferToWar.addShort(waterHeight | hasBoundaryFlag)
        outBufferToWar.addByte(flags | groundTexture)
        outBufferToWar.addByte(groundVariation | cliffVariation)
        outBufferToWar.addByte(cliffTexture | layerHeight)
      }
    }

    return {
      errors,
      warnings
    }
  }
}
