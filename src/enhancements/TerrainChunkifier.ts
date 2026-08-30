import { FormatConverters } from '../converter/formats/FormatConverters'
import { LoggerFactory } from '../logging/LoggerFactory'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import { integer, vector2 } from '../wc3maptranslator/CommonInterfaces'
import { type Camera, type Unit, type Doodad, type SpecialDoodad, type Terrain, type Region, MapSize } from '../wc3maptranslator/data'
import { TerrainChunk, TerrainChunkObjects, type TerrainData } from './data/TerrainChunk'
import EnhancementManager from './EnhancementManager'
import { ArrayStringifier } from './ArrayStringifier'
import path from 'path'
import directoryTree, { DirectoryTree } from 'directory-tree'
import TreeIterator from '../util/TreeIterator'
import { FileBlacklist } from './FileBlacklist'
import PromiseSupplier from '../util/PromiseSupplier'
import { readFile } from 'fs/promises'

const log = LoggerFactory.createLogger('TerrainChunkifier')
const TILE_SIZE = 128

let asyncCounter = 0

type TerrainChunkWMetaData = TerrainChunk & { row: integer, col: integer }
async function parseData(input: DirectoryTree, row: integer, col: integer): Promise<TerrainChunkWMetaData> {
  const data = FormatConverters[EnhancementManager.mapDataExtension].parse(await readFile(input.path, 'utf8')) as TerrainChunkWMetaData
  data.row = row
  data.col = col
  return data
}

async function readTerrainMainData(input: DirectoryTree): Promise<TerrainData & TerrainChunkObjects> {
  return FormatConverters[EnhancementManager.mapDataExtension].parse(await readFile(input.path, 'utf8')) as TerrainData & TerrainChunkObjects
}

async function writeData(data: unknown, output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${asyncCounter++}` })
  asyncLog.info('Writing to', output)
  await WriteAndCreatePath(output, FormatConverters[EnhancementManager.mapDataExtension].stringify(data))
  log.info('Finished writing', output)
}

function calculateChunkSizes(offset: integer, chunkSize: integer, mapSize: integer): [startChunkSize: integer, midChunkSize: integer, midChunkCount: integer, endChunkSize: integer] {
  const reverse = offset < 0
  if (reverse) {
    offset *= -1
  }

  let startChunkSize = mapSize > offset ? offset : mapSize
  let endChunkSize = (mapSize - startChunkSize) % chunkSize
  const midChunkCount = (mapSize - startChunkSize - endChunkSize) / chunkSize

  if (reverse) {
    const temp = startChunkSize
    startChunkSize = endChunkSize
    endChunkSize = temp
  }

  return [startChunkSize, chunkSize, midChunkCount, endChunkSize]
}

function calculateChunkCoordinateThresholds(absOffset: number, startChunkSize: integer, midChunkSize: integer, midChunkCount: integer, endChunkSize: integer): number[] {
  const result: number[] = []
  let index = 0
  result[index++] = absOffset + startChunkSize * TILE_SIZE
  for (let i = 0; i < midChunkCount; i++, index++) {
    result[index] = result[i] + midChunkSize * TILE_SIZE
  }
  result[index] = result[index - 1] + endChunkSize * TILE_SIZE
  return result
}

function calculateChunkCoordinates(absOffset: number, chunkSizes: integer[]): number[] {
  const result: number[] = []
  let index = 0
  for (const chunkSize of chunkSizes) {
    result[index++] = absOffset + chunkSize * TILE_SIZE
  }
  return result
}

function getObjectChunkIndex(chunkThresholds: number[], objectCoordinate: number, yCoordinate = false): integer {
  const chunks = chunkThresholds
  for (let i = 0; i < chunks.length; i++) {
    if (yCoordinate) {
      if (objectCoordinate > chunks[i]) {
        return i
      }
    } else {
      if (objectCoordinate < chunks[i]) {
        return i
      }
    }
  }
  return -1
}

function calculateCoordinate(coordinate: number, chunkStart: number, yCoordinate = false) {
  if (yCoordinate) {
    return chunkStart - coordinate
  } else {
    return coordinate - chunkStart
  }
}

const TerrainChunkifier = {
  composeTerrain: async function (input: DirectoryTree): Promise<[Terrain, Doodad[], SpecialDoodad[], Unit[], Region[], Camera[]]> {
    const tasks: Promise<TerrainChunkWMetaData>[] = []
    const filenameRegex = new RegExp(`terrain-(?<row>\\d+)-(?<col>\\d+)\\${EnhancementManager.mapDataExtension}`)

    let foundTerrain = false
    const [terrainPromise, terrainResolve, terrainReject] = PromiseSupplier<TerrainData & TerrainChunkObjects>()
    let maxRow = 0

    for (const [, file] of TreeIterator<DirectoryTree>(input, (parent: directoryTree.DirectoryTree<Record<string, string>>) => parent.children)) {
      if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue
      if (file.type === 'directory') continue
      if (file.name === `terrain${EnhancementManager.mapDataExtension}`) {
        foundTerrain = true
        readTerrainMainData(file).then(terrainResolve).catch(terrainReject)
      } else if (filenameRegex.test(file.name)) {
        const regexGroups = filenameRegex.exec(file.name)?.groups ?? { row: '', col: '' }
        const row = Number.parseInt(regexGroups.row)
        const col = Number.parseInt(regexGroups.col)
        maxRow = maxRow > row ? maxRow : row
        tasks.push(parseData(file, row, col))
      }
    }

    if (!foundTerrain) {
      terrainReject('terrain data file not found.')
    }

    const terrainData = await terrainPromise
    const chunks = ((unsortedChunks: TerrainChunkWMetaData[]) => {
      const result: TerrainChunkWMetaData[][] = []
      for (const chunk of unsortedChunks) {
        result[chunk.row] ??= []
        result[chunk.row][chunk.col] = chunk
      }
      return result
    })(await Promise.all(tasks))

    const doodads = terrainData?.doodads ?? []
    const specialDoodads = terrainData?.specialDoodads ?? []
    const units = terrainData?.units ?? []
    const regions = terrainData?.regions ?? []
    const cameras = terrainData?.cameras ?? []

    const terrain = {
      tileset         : terrainData.tileset,
      customTileset   : terrainData.customTileset,
      tilePalette     : terrainData.tilePalette,
      cliffTilePalette: terrainData.cliffTilePalette,
      map             : terrainData.map,
      groundTexture   : [] as integer[][],
      groundVariation : [] as integer[][],
      cliffTexture    : [] as integer[][],
      cliffVariation  : [] as integer[][],
      cliffLevel      : [] as integer[][],
      groundHeight    : [] as integer[][],
      waterHeight     : [] as integer[][],
      ramp            : [] as boolean[][],
      blight          : [] as boolean[][],
      water           : [] as boolean[][],
      boundary        : [] as integer[][]
    } satisfies Terrain

    const columnChunkSizes = chunks[0].map(it => it.sizeX)
    const rowChunkSizes = chunks.map(it => it[0].sizeY)
    const chunkColCoordinatesX = calculateChunkCoordinates(terrain.map.offsetX, columnChunkSizes)
    const chunkRowCoordinatesY = calculateChunkCoordinates(terrain.map.offsetY, rowChunkSizes)

    let i = 0, j = 0
    for (const chunkRow of chunks) {
      for (const chunk of chunkRow) {
        if (chunk.sizeX !== columnChunkSizes[chunk.col]) {
          log.warn(`Mismatched chunk sizeX for chunk ${chunk.row}-${chunk.col}, expected ${columnChunkSizes[chunk.col]}, found ${chunk.sizeX}!`)
        }
        if (chunk.sizeY !== rowChunkSizes[chunk.row]) {
          log.warn(`Mismatched chunk sizeX for chunk ${chunk.row}-${chunk.col}, expected ${rowChunkSizes[chunk.row]}, found ${chunk.sizeY}!`)
        }
        for (let x = 0; x < chunk.sizeX; x++) {
          const groundTextureRow = ArrayStringifier.ConvertFromPaddedDoubleDigitString(chunk.groundTexture[x])
          const groundVariationRow = ArrayStringifier.ConvertFromPaddedDoubleDigitString(chunk.groundVariation[x])
          const cliffTextureRow = ArrayStringifier.ConvertFromPaddedDoubleDigitString(chunk.cliffTexture[x])
          const cliffVariationRow = ArrayStringifier.ConvertFromPaddedDoubleDigitString(chunk.cliffVariation[x])
          const cliffLevelRow = ArrayStringifier.ConvertFromPaddedDoubleDigitString(chunk.cliffLevel[x])
          const groundHeightRow = ArrayStringifier.ConvertFromCSVString(chunk.groundHeight[x], (data: string) => Number.parseFloat(data))
          const waterHeightRow = ArrayStringifier.ConvertFromCSVString(chunk.waterHeight[x], (data: string) => Number.parseFloat(data))
          const rampRow = ArrayStringifier.ConvertFromBinaryDigitString(chunk.ramp[x])
          const blightRow = ArrayStringifier.ConvertFromBinaryDigitString(chunk.blight[x])
          const waterRow = ArrayStringifier.ConvertFromBinaryDigitString(chunk.water[x])
          const boundaryRow = ArrayStringifier.ConvertFromSingleDigitString(chunk.boundary[x])
          for (let y = 0; y < chunk.sizeY; y++) {
            terrain.groundTexture[i] ??= []
            terrain.groundTexture[i][j] = groundTextureRow[y]
            terrain.groundVariation[i] ??= []
            terrain.groundVariation[i][j] = groundVariationRow[y]
            terrain.cliffTexture[i] ??= []
            terrain.cliffTexture[i][j] = cliffTextureRow[y]
            terrain.cliffVariation[i] ??= []
            terrain.cliffVariation[i][j] = cliffVariationRow[y]
            terrain.cliffLevel[i] ??= []
            terrain.cliffLevel[i][j] = cliffLevelRow[y]
            terrain.groundHeight[i] ??= []
            terrain.groundHeight[i][j] = groundHeightRow[y]
            terrain.waterHeight[i] ??= []
            terrain.waterHeight[i][j] = waterHeightRow[y]
            terrain.ramp[i] ??= []
            terrain.ramp[i][j] = rampRow[y]
            terrain.blight[i] ??= []
            terrain.blight[i][j] = blightRow[y]
            terrain.water[i] ??= []
            terrain.water[i][j] = waterRow[y]
            terrain.boundary[i] ??= []
            terrain.boundary[i][j] = boundaryRow[y]
            j++
          }
          i++
        }

        chunk.doodads.forEach((it) => {
          doodads.push(it)
          it.position[0] = calculateCoordinate(it.position[0], chunkColCoordinatesX[chunk.col])
          it.position[1] = calculateCoordinate(it.position[1], chunkRowCoordinatesY[chunk.row])
        })
        chunk.specialDoodads.forEach((it) => {
          specialDoodads.push(it)
          it.position[0] = calculateCoordinate(it.position[0], chunkColCoordinatesX[chunk.col])
          it.position[1] = calculateCoordinate(it.position[1], chunkRowCoordinatesY[chunk.row])
        })
        chunk.units.forEach((it) => {
          units.push(it)
          it.position[0] = calculateCoordinate(it.position[0], chunkColCoordinatesX[chunk.col])
          it.position[1] = calculateCoordinate(it.position[1], chunkRowCoordinatesY[chunk.row])
        })
        chunk.cameras.forEach((it) => {
          cameras.push(it)
          it.targetX = calculateCoordinate(it.targetX, chunkColCoordinatesX[chunk.col])
          it.targetY = calculateCoordinate(it.targetY, chunkRowCoordinatesY[chunk.row])
        })
        chunk.regions.forEach((it) => {
          regions.push(it)
          it.position.top = calculateCoordinate(it.position.top, chunkRowCoordinatesY[chunk.row])
          it.position.bottom = calculateCoordinate(it.position.bottom, chunkRowCoordinatesY[chunk.row])
          it.position.left = calculateCoordinate(it.position.left, chunkColCoordinatesX[chunk.col])
          it.position.right = calculateCoordinate(it.position.right, chunkColCoordinatesX[chunk.col])
        })
      }
    }

    return [terrain, doodads, specialDoodads, units, regions, cameras]
  },

  chunkifyTerrain: async function (output: string, terrain: Terrain, doodads: Doodad[], specialDoodads: SpecialDoodad[], units: Unit[], regions: Region[], cameras: Camera[], chunkSize: MapSize): Promise<void> {
    function readTerrainChunk(startX: integer, endX: integer, startY: integer, endY: integer): TerrainChunk {
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
      for (let i = startY; i <= endY; i++, row++) {
        let index = 0
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
        for (let j = startX; j <= endX; j++, index++) {
          groundTextureRow[index] = terrain.groundTexture[i][j] as integer
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
        sizeX         : endX - startX,
        sizeY         : endY - startY,
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
        cameras       : [],
        regions       : [],
        doodads       : [],
        specialDoodads: [],
        units         : []
      } satisfies TerrainChunk
    }

    const tasks: Promise<void>[] = []
    const offsetX = terrain.map.offsetX // also minX
    const offsetY = terrain.map.offsetY // also minY
    const sizeX = terrain.map.sizeX
    const sizeY = terrain.map.sizeY
    const terrainData = {
      tileset         : terrain.tileset,
      customTileset   : terrain.customTileset,
      tilePalette     : terrain.tilePalette,
      cliffTilePalette: terrain.cliffTilePalette,
      map             : terrain.map,
      cameras         : [] as Camera[],
      regions         : [] as Region[],
      doodads         : [] as Doodad[],
      specialDoodads  : [] as SpecialDoodad[],
      units           : [] as Unit[]
    } satisfies TerrainData & TerrainChunkObjects

    const [startChunkSizeX, midChunkSizeX, midChunkCountX, endChunkSizeX] = calculateChunkSizes(chunkSize.offsetX, chunkSize.sizeX * 4, sizeX)
    const [startChunkSizeY, midChunkSizeY, midChunkCountY, endChunkSizeY] = calculateChunkSizes(chunkSize.offsetY, chunkSize.sizeY * 4, sizeY)
    const chunkAbsCoordinateThresholdsX = calculateChunkCoordinateThresholds(offsetX, startChunkSizeX, midChunkSizeX, midChunkCountX, endChunkSizeX)
    const chunkAbsCoordinateThresholdsY = calculateChunkCoordinateThresholds(offsetY, endChunkSizeY, midChunkSizeY, midChunkCountY, startChunkSizeY).reverse() // invert Y for reasons

    function readTerrainChunkRow(colStart: integer, colEnd: integer): TerrainChunk[] {
      const row: TerrainChunk[] = []
      let chunkRow = startChunkSizeX
      if (startChunkSizeX > 0) {
        row.push(readTerrainChunk(0, chunkRow, colStart, colEnd))
      }
      for (let i = 0; i < midChunkCountX; i++, chunkRow += midChunkSizeX) {
        row.push(readTerrainChunk(chunkRow, chunkRow + midChunkSizeX, colStart, colEnd))
      }
      chunkRow -= midChunkSizeX
      if (endChunkSizeX > 0) {
        row.push(readTerrainChunk(chunkRow, chunkRow + endChunkSizeX, colStart, colEnd))
      }
      return row
    }

    const chunks: TerrainChunk[][] = []

    // TOP
    let chunkColStart = 0
    let chunkColEnd = startChunkSizeY
    if (chunkColEnd - chunkColStart > 0) {
      chunks.push(readTerrainChunkRow(chunkColStart, chunkColEnd))
    }

    // Middle
    chunkColStart += startChunkSizeY
    chunkColEnd += midChunkSizeY
    for (let j = 0; j < midChunkCountY; j++, chunkColStart += midChunkSizeY, chunkColEnd += midChunkSizeY) {
      chunks.push(readTerrainChunkRow(chunkColStart, chunkColEnd))
    }

    // Bottom
    chunkColStart -= midChunkSizeY
    chunkColEnd = chunkColStart + endChunkSizeY
    if (chunkColEnd - chunkColStart > 0) {
      chunks.push(readTerrainChunkRow(chunkColStart, chunkColEnd))
    }

    function sortObjectsIntoChunks<T>(objects: T[], objectPositionGetter: (object: T) => vector2, objectPositionSetter: (object: T, x: number, y: number) => void, chunkSaver: (chunk: TerrainChunkObjects, object: T) => void) {
      for (const object of objects) {
        const [x, y] = objectPositionGetter(object)
        const xIndex = getObjectChunkIndex(chunkAbsCoordinateThresholdsX, x)
        const yIndex = getObjectChunkIndex(chunkAbsCoordinateThresholdsY, y, true)
        if (xIndex === -1 || yIndex === -1) {
          chunkSaver(terrainData, object)
        } else {
          objectPositionSetter(object, calculateCoordinate(x, chunkAbsCoordinateThresholdsX[xIndex]), calculateCoordinate(y, chunkAbsCoordinateThresholdsY[yIndex], true))
          chunkSaver(chunks[yIndex][xIndex], object)
        }
      }
    }

    sortObjectsIntoChunks(doodads, doodad => doodad.position as unknown as vector2,
      (doodad, x, y) => {
        doodad.position[0] = x
        doodad.position[1] = y
      }, (chunk, doodad) => chunk.doodads.push(doodad))
    sortObjectsIntoChunks(specialDoodads, doodad => doodad.position as unknown as vector2,
      (doodad, x, y) => {
        doodad.position[0] = x
        doodad.position[1] = y
      }, (chunk, doodad) => chunk.specialDoodads.push(doodad))
    sortObjectsIntoChunks(units, unit => unit.position as unknown as vector2,
      (unit, x, y) => {
        unit.position[0] = x
        unit.position[1] = y
      }, (chunk, unit) => chunk.units.push(unit))
    sortObjectsIntoChunks(cameras, camera => [camera.targetX, camera.targetY],
      (camera, x, y) => {
        camera.targetX = x
        camera.targetY = y
      }, (chunk, camera) => chunk.cameras.push(camera))
    for (const region of regions) {
      const regionPosition = region.position
      const xIndex = getObjectChunkIndex(chunkAbsCoordinateThresholdsX, regionPosition.left)
      const yIndex = getObjectChunkIndex(chunkAbsCoordinateThresholdsY, regionPosition.top, true)
      if (xIndex === -1 || yIndex === -1) {
        terrainData.regions.push(region)
      } else {
        regionPosition.left = calculateCoordinate(regionPosition.left, chunkAbsCoordinateThresholdsX[xIndex])
        regionPosition.right = calculateCoordinate(regionPosition.right, chunkAbsCoordinateThresholdsX[xIndex])
        regionPosition.top = calculateCoordinate(regionPosition.top, chunkAbsCoordinateThresholdsY[yIndex], true)
        regionPosition.bottom = calculateCoordinate(regionPosition.bottom, chunkAbsCoordinateThresholdsY[yIndex], true)
        chunks[yIndex][xIndex].regions.push(region)
      }
    }

    for (let i = 0; i < chunks.length; i++) {
      for (let j = 0; j < chunks[i].length; j++) {
        tasks.push(writeData(chunks[i][j], path.join(output, EnhancementManager.chunkifiedTerrainFolder, `terrain-${i}-${j}${EnhancementManager.chunkFileExtension}`)))
      }
    }

    tasks.push(writeData(terrainData, path.join(output, EnhancementManager.chunkifiedTerrainFolder, `terrain${EnhancementManager.chunkFileExtension}`)))
    await Promise.all(tasks)
  }
}

export { TerrainChunkifier }