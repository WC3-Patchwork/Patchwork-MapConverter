import { FormatConverters } from '../converter/formats/FormatConverters'
import { LoggerFactory } from '../logging/LoggerFactory'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { type Camera, type Unit, type Doodad, type SpecialDoodad, type Terrain, type Region } from '../wc3maptranslator/data'
import { type TerrainData } from './data/TerrainChunk'
import EnhancementManager from './EnhancementManager'

const log = LoggerFactory.createLogger('TerrainChunkifier')

let asyncCounter = 0
async function writeData (data: unknown, output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${asyncCounter++}` })
  asyncLog.info('Writing to', output)
  await WriteAndCreatePath(output, FormatConverters[EnhancementManager.mapDataExtension].stringify(data))
  log.info('Finished writing', output)
}

const TerrainChunkifier = {
  chunkifierTerrain: async function (terrain: Terrain, doodads: Doodad[], specialDoodads: SpecialDoodad[], units: Unit[], regions: Region[], cameras: Camera[], chunkSize: integer): Promise<void> {
    const tasks: Promise<void>[] = []
    const offsetX = terrain.map.offsetX // also minX
    const offsetY = terrain.map.offsetY // also minY
    const sizeX = terrain.map.sizeX
    const sizeY = terrain.map.sizeY
    const chunksX = sizeX / chunkSize
    const chunksY = sizeY / chunkSize

    tasks.push(writeData({
      tileset: terrain.tileset,
      customTileset: terrain.customTileset,
      tilePalette: terrain.tilePalette,
      cliffTilePalette: terrain.cliffTilePalette,
      map: terrain.map
    } satisfies TerrainData, '/terrain/data.json'))

    // problem: leftover
    // Problem: offset chunks?
    // Problem: differntly sized chunks:
    // Problem: use rects as chunks? - overlapping rects...
    // Is this where I should use an octotree?

    for (let i = 0; i < chunksX; i++) {
      for (let j = 0; j < chunksY; j++) {
        for (let y = 0; y < chunkSize; y++) {
          for (let x = 0; x < chunkSize; x++) {

          }
        }
      }
    }

    // Terrain json starts from top-left, but let's process from bottom-left
    for (let i = sizeY; i >= 0; i--) {
      for (let j = 0; j <= sizeX; j++) {
        terrain.blight[i][j]
      }
    }

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
    { await Promise.all(tasks) }
  }
}

export { TerrainChunkifier }
