import { type real, type integer } from '../common/DataTypes'

interface Terrain {
  tileset: string
  customTileset: boolean
  tilePalette: string[]
  cliffTilePalette: string[]
  map: {
    width: integer
    height: integer
    offset: {
      x: real
      y: real
    }
  }
  // "Masks"
  groundHeight: number[]
  waterHeight: number[]
  boundaryFlag: boolean[]
  flags: number[]
  groundTexture: number[]
  groundVariation: number[]
  cliffVariation: number[]
  cliffTexture: number[]
  layerHeight: number[]
}

export type { Terrain }
