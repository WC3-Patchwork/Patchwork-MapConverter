import { error } from 'console'
import { FormatConverters } from '../converter/formats/FormatConverters'
import { LoggerFactory } from '../logging/LoggerFactory'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import { integer } from '../wc3maptranslator/CommonInterfaces'
import { type Camera, type Unit, type Doodad, type SpecialDoodad, type Terrain, type Region, MapSize } from '../wc3maptranslator/data'
import { TerrainChunk, type TerrainData } from './data/TerrainChunk'
import EnhancementManager from './EnhancementManager'
import { ArrayStringifier } from './ArrayStringifier'

const log = LoggerFactory.createLogger('TerrainChunkifier')

let asyncCounter = 0
async function writeData (data: unknown, output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${asyncCounter++}` })
  asyncLog.info('Writing to', output)
  await WriteAndCreatePath(output, FormatConverters[EnhancementManager.mapDataExtension].stringify(data))
  log.info('Finished writing', output)
}

function calculateChunkSizes(offset: integer, chunkSize: integer, mapSize: integer): [startChunkSize: integer, midChunkSize: integer, midChunkCount: integer, endChunkSize: integer] {
  let startChunkSize, endChunkSize: integer
  if (offset/2 > mapSize){
    throw new Error(`Offset '${offset}' is too large for map of size ${mapSize}`)
  }
  if (chunkSize > mapSize){
    throw new Error(`Chunk size cannot be larger than map size`)
  }

  if (offset == chunkSize || offset == 0){
    startChunkSize = chunkSize
    endChunkSize = chunkSize
  } else if (offset > chunkSize){
    startChunkSize = offset
    endChunkSize = chunkSize - offset % chunkSize
  } else {
    if (offset < 0){
      startChunkSize = chunkSize + offset % chunkSize
      endChunkSize = -offset
    } else {
      startChunkSize = offset
      endChunkSize = chunkSize - offset
    }
  }
  return [startChunkSize, chunkSize, (mapSize - startChunkSize - endChunkSize)/chunkSize, endChunkSize]
}

const TerrainChunkifier = {
  chunkifyTerrain: async function (terrain: Terrain, doodads: Doodad[], specialDoodads: SpecialDoodad[], units: Unit[], regions: Region[], cameras: Camera[], chunkSize: MapSize): Promise<void> {
    function readTerrainChunk(startX: integer, endX: integer, startY: integer, endY: integer): TerrainChunk{
      let row = 0
      const groundTexture: string[] = []
      const groundVariation: string[] = []
      const cliffTexture: string[] = []
      const cliffVariation: string[] = []
      const cliffLevel: string[] = []
      const groundHeight: string[] = []
      const waterHeight: string[] = []
      const ramp: string[] = []
      const blight: string[] = []
      const water: string[] = []
      const boundary: string[] = []
      for (let i = startY; i <= endY; i++, row++){
        let index = 0;
        const groundTextureRow: integer[] = []
        const groundVariationRow: integer[] = []
        const cliffTextureRow: integer[] = []
        const cliffVariationRow: integer[] = []
        const cliffLevelRow: integer[] = []
        const groundHeightRow: integer[] = []
        const waterHeightRow: integer[] = []
        const rampRow: boolean[] = []
        const blightRow: boolean[] = []
        const waterRow: boolean[] = []
        const boundaryRow: integer[] = []
        for (let j = startX; j <= endX; j++, index++){
          groundTextureRow[index]= terrain.groundTexture[i][j] as integer
          groundVariationRow[index] = terrain.groundVariation[i][j] as integer
          cliffTextureRow[index] = terrain.cliffTexture[i][j] as integer
          cliffVariationRow[index] = terrain.cliffVariation[i][j] as integer
          cliffLevelRow[index] = terrain.cliffLevel[i][j] as integer
          groundHeightRow[index] = terrain.groundHeight[i][j] as integer
          waterHeightRow[index] = terrain.waterHeight[i][j] as integer
          rampRow[index] = terrain.ramp[i][j] as boolean
          blightRow[index] = terrain.blight[i][j] as boolean
          waterRow[index] = terrain.water[i][j] as boolean
          boundaryRow[index] = terrain.boundary[i][j] as integer
        }
        groundTexture[row] = ArrayStringifier.ConvertToPaddedDoubleDigitString(groundTextureRow)
        groundVariation[row] = ArrayStringifier.ConvertToPaddedDoubleDigitString(groundVariationRow)
        cliffTexture[row] = ArrayStringifier.ConvertToPaddedDoubleDigitString(cliffTextureRow)
        cliffVariation[row] = ArrayStringifier.ConvertToPaddedDoubleDigitString(cliffVariationRow)
        cliffLevel[row] = ArrayStringifier.ConvertToPaddedDoubleDigitString(cliffLevelRow)
        groundHeight[row] = ArrayStringifier.ConvertToCSVString(groundHeightRow)
        waterHeight[row] = ArrayStringifier.ConvertToCSVString(waterHeightRow)
        ramp[row] = ArrayStringifier.ConvertToBinaryDigitString(rampRow)
        blight[row] = ArrayStringifier.ConvertToBinaryDigitString(blightRow)
        water[row] = ArrayStringifier.ConvertToBinaryDigitString(waterRow)
        boundary[row] = ArrayStringifier.ConvertToSingleDigitString(boundaryRow)
      }

      return {
        sizeX: endX-startX,
        sizeY: endY-startY,
        groundTexture,
        groundVariation,
        cliffTexture,
        cliffVariation,
        cliffLevel,
        groundHeight,
        waterHeight,
        ramp,
        blight,
        water,
        boundary,
        cameras: [],
        regions: [],
        doodad: [],
        units: []
      } satisfies TerrainChunk
    }

    const tasks: Promise<void>[] = []
    const offsetX = terrain.map.offsetX // also minX
    const offsetY = terrain.map.offsetY // also minY
    const sizeX = terrain.map.sizeX
    const sizeY = terrain.map.sizeY

    tasks.push(writeData({
      tileset: terrain.tileset,
      customTileset: terrain.customTileset,
      tilePalette: terrain.tilePalette,
      cliffTilePalette: terrain.cliffTilePalette,
      map: terrain.map
    } satisfies TerrainData, '/terrain/data.json'))

    const [startChunkSizeX, midChunkSizeX, midChunkCountX, endChunkSizeX] = calculateChunkSizes(chunkSize.sizeX*4, chunkSize.offsetX, sizeX)
    const [startChunkSizeY, midChunkSizeY, midChunkCountY, endChunkSizeY] = calculateChunkSizes(chunkSize.sizeY*4, chunkSize.offsetY, sizeY)

    function readTerrainChunkRow(colStart: integer, colEnd: integer): TerrainChunk[]{
      const row: TerrainChunk[] = []
      let chunkRow = startChunkSizeX
      row.push(readTerrainChunk(0, chunkRow, colStart, colEnd))
      for (let i = 0; i < midChunkCountX; i++, chunkRow +=midChunkSizeX){
        row.push(readTerrainChunk(chunkRow, chunkRow + midChunkSizeX, colStart, colEnd))
      }
      chunkRow -= midChunkSizeX
      row.push(readTerrainChunk(chunkRow, chunkRow+endChunkSizeX, colStart, colEnd))
      return row
    }

    const chunks: TerrainChunk[][] = []

    //TOP
    let chunkColStart = 0
    let chunkColEnd = startChunkSizeY
    chunks.push(readTerrainChunkRow(chunkColStart, chunkColEnd))

    //Middle
    chunkColStart += startChunkSizeY
    chunkColEnd += midChunkSizeY
    for (let j = 0; j < midChunkCountY; j++, chunkColStart += midChunkSizeY, chunkColEnd += midChunkSizeY){
      chunks.push(readTerrainChunkRow(chunkColStart, chunkColEnd))
    }

    //Bottom
    chunkColStart -= midChunkSizeY
    chunkColEnd = chunkColStart - midChunkSizeY + endChunkSizeY
    chunks.push(readTerrainChunkRow(chunkColStart, chunkColEnd))

    //TODO parse objects and group them in appropriate chunks


    // Terrain json starts from top-left, but let's process from bottom-left

    /**
         * These 2 offsets are used in the scripts files, doodads and more.
The original (0,0) coordinate is at the bottom left of the map (looking from the top), but it's easier to work with (0,0) in the middle of the map.
These offsets are:

-1 * (Mx - 1) * 128 / 2 and -1 * (My - 1) * 128 / 2

where:

(Width - 1) and (Height - 1) are the width and the height of the map in tiles 128 is the size of a tile on the map
/ 2 because we don't want the length, but the middle.
-1 * because we are "translating" the centre of the map, not giving it's new coordinates
         */
    await Promise.all(tasks)
  }
}

export { TerrainChunkifier }
