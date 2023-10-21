import { W3Buffer } from '../../W3Buffer'
import { type VersionedBinaryToJsonConverter } from '../../VersionedBinaryToJsonConverter'
import { type integer } from '../../../data/editor/common/DataTypes'
import { type Terrain } from '../../../data/editor/terrain/Terrain'
import { Service } from 'typedi'
import { ArrayManipulationUtils } from '../../../util/ArrayManipulationUtils'

@Service()
export class TerrainTranslator implements VersionedBinaryToJsonConverter<Terrain> {
  private static readonly expectedFileVersion = 11

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    const w3eHeader = w3Buffer.readChars(4) // W3E!
    const version = w3Buffer.readInt() // 0B 00 00 00
    return this.canTranslateFor(w3eHeader, version)
  }

  public translate (buffer: Buffer): JSONTranslationResult<Terrain> {
    const resultObject: JSONTranslationResult<Terrain> = {
      result: {
        tileset: '',
        customTileset: false,
        tilePalette: [],
        cliffTilePalette: [],
        map: {
          width: 1,
          height: 1,
          offset: {
            x: 0,
            y: 0
          }
        },
        groundHeight: [],
        waterHeight: [],
        boundaryFlag: [],
        flags: [],
        groundTexture: [],
        groundVariation: [],
        cliffVariation: [],
        cliffTexture: [],
        layerHeight: []
      },
      warnings: [],
      errors: []
    }

    const outBufferToJSON = new W3Buffer(buffer)

    /**
     * Header
     */
    const w3eHeader = outBufferToJSON.readChars(4) // W3E!
    const version = outBufferToJSON.readInt() // 0B 00 00 00
    if (!this.canTranslateFor(w3eHeader, version)) {
      resultObject.warnings.push((
        new Error(`Attempting to translate with translator not intended for following data: 
                fileHeader: ${w3eHeader}\t\tExpected: 'W3E!'
                fileVersion: ${version}\t\tExpected: ${TerrainTranslator.expectedFileVersion}`)))
    }

    resultObject.result.tileset = outBufferToJSON.readChars(1)
    resultObject.result.customTileset = (outBufferToJSON.readInt() === 1)

    /**
     * Tiles
     */
    const numTilePalettes = outBufferToJSON.readInt()
    const tilePalettes: string[] = []
    for (let i = 0; i < numTilePalettes; i++) {
      tilePalettes.push(outBufferToJSON.readChars(4))
    }

    resultObject.result.tilePalette = tilePalettes

    /**
     * Cliffs
     */
    const numCliffTilePalettes = outBufferToJSON.readInt()
    const cliffPalettes: string[] = []
    for (let i = 0; i < numCliffTilePalettes; i++) {
      const cliffPalette = outBufferToJSON.readChars(4)
      cliffPalettes.push(cliffPalette)
    }

    resultObject.result.cliffTilePalette = cliffPalettes

    /**
     * map dimensions
     */
    resultObject.result.map = {
      width: outBufferToJSON.readInt() - 1,
      height: outBufferToJSON.readInt() - 1,
      offset: {
        x: outBufferToJSON.readFloat(),
        y: outBufferToJSON.readFloat()
      }
    }

    /**
     * map tiles
     */
    const arrGroundHeight: number[] = []
    const arrWaterHeight: number[] = []
    const arrBoundaryFlag: boolean[] = []
    const arrFlags: number[] = []
    const arrGroundTexture: number[] = []
    const arrGroundVariation: number[] = []
    const arrCliffVariation: number[] = []
    const arrCliffTexture: number[] = []
    const arrLayerHeight: number[] = []

    while (!outBufferToJSON.isExhausted()) {
      const groundHeight = outBufferToJSON.readShort()
      const waterHeightAndBoundary = outBufferToJSON.readShort()
      const flagsAndGroundTexture = outBufferToJSON.readByte()
      const groundAndCliffVariation = outBufferToJSON.readByte()
      const cliffTextureAndLayerHeight = outBufferToJSON.readByte()

      // parse out different bits (based on documentation from https://github.com/stijnherfst/HiveWE/wiki/war3map.w3e-Terrain)
      const waterHeight = waterHeightAndBoundary & 32767
      const boundaryFlag = (waterHeightAndBoundary & 0x4000) === 0x4000
      const flags = flagsAndGroundTexture & 240
      const groundTexture = flagsAndGroundTexture & 15
      const groundVariation = groundAndCliffVariation & 248
      const cliffVariation = groundAndCliffVariation & 7
      const cliffTexture = cliffTextureAndLayerHeight & 240
      const layerHeight = cliffTextureAndLayerHeight & 15

      arrGroundHeight.push(groundHeight)
      arrWaterHeight.push(waterHeight)
      arrBoundaryFlag.push(boundaryFlag)
      arrFlags.push(flags)
      arrGroundTexture.push(groundTexture)
      arrGroundVariation.push(groundVariation)
      arrCliffVariation.push(cliffVariation)
      arrCliffTexture.push(cliffTexture)
      arrLayerHeight.push(layerHeight)
    }

    // The map was read in "backwards" because wc3 maps have origin (0,0)
    // at the bottom left instead of top left as we desire. Flip the rows
    // vertically to fix this.
    resultObject.result.groundHeight = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrGroundHeight, resultObject.result.map.width + 1).reverse())
    resultObject.result.waterHeight = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrWaterHeight, resultObject.result.map.width + 1).reverse())
    resultObject.result.boundaryFlag = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrBoundaryFlag, resultObject.result.map.width + 1).reverse())
    resultObject.result.flags = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrFlags, resultObject.result.map.width + 1).reverse())
    resultObject.result.groundTexture = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrGroundTexture, resultObject.result.map.width + 1).reverse())
    resultObject.result.groundVariation = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrGroundVariation, resultObject.result.map.width + 1).reverse())
    resultObject.result.cliffVariation = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrCliffVariation, resultObject.result.map.width + 1).reverse())
    resultObject.result.cliffTexture = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrCliffTexture, resultObject.result.map.width + 1).reverse())
    resultObject.result.layerHeight = ArrayManipulationUtils.convertArrayOfArraysIntoFlatArray(ArrayManipulationUtils.splitLargeArrayIntoWidthArrays(arrLayerHeight, resultObject.result.map.width + 1).reverse())

    return resultObject
  }

  private canTranslateFor (fileHeader: string, version: integer): boolean {
    return fileHeader === 'W3E!' &&
    TerrainTranslator.expectedFileVersion === version
  }
}
