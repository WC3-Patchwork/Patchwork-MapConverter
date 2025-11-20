import { type bitstring, type csv, type integer } from '../CommonInterfaces'

interface Terrain {
  tileset: string
  customTileset: boolean
  tilePalette: string[]
  cliffTilePalette: string[]
  map: MapSize
  // "layers"
  groundTexture: integer[][] | csv[]
  groundVariation: integer[][] | csv[]
  cliffTexture: integer[][] | csv[]
  cliffVariation: integer[][] | csv[]
  cliffLevel: integer[][] | csv[]
  groundHeight: number[][] | csv[]
  waterHeight: number[][] | csv[]
  ramp: boolean[][] | bitstring[]
  blight: boolean[][] | bitstring[]
  water: boolean[][] | bitstring[]
  boundary: Boundary[][] | csv[]
}

interface MapSize {
  sizeX: number
  sizeY: number
  offsetX: number
  offsetY: number
}

enum Boundary {
  None = 0,
  Type1 = 1, // Map edge boundary
  Type2 = 2 // manually placed boundary tile
}

export type { Terrain, MapSize }
export { Boundary }