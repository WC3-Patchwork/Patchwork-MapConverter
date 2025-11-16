import { FormatConverters } from '../converter/formats/FormatConverters'
import { LoggerFactory } from '../logging/LoggerFactory'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
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
  chunkifierTerrain: async function (terrain: Terrain, doodads: Doodad[], specialDoodads: SpecialDoodad[], units: Unit[], regions: Region[], cameras: Camera[]): Promise<void> {
    const tasks: Array<Promise<void>> = []
    const offsetX = terrain.map.offsetX
    const offsetY = terrain.map.offsetY
    const sizeX = terrain.map.sizeX
    const sizeY = terrain.map.sizeY

    tasks.push(writeData({
      tileset: terrain.tileset,
      customTileset: terrain.customTileset,
      tilePalette: terrain.tilePalette,
      cliffTilePalette: terrain.cliffTilePalette,
      map: terrain.map
    } satisfies TerrainData, '/terrain/data.json'))
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
