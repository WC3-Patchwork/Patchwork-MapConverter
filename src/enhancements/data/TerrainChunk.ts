import { type integer } from '../../wc3maptranslator/CommonInterfaces'
import { type Region, type Camera, type Unit, type Doodad, type MapSize, SpecialDoodad } from '../../wc3maptranslator/data'
import { type SingleDigitString, type PaddedDoubleDigitString, type BinaryDigitString, type CSVString } from '../ArrayStringifier'

interface TerrainData {
  tileset: string
  customTileset: boolean
  tilePalette: string[]
  cliffTilePalette: string[]
  map: MapSize
}

// Offset goes to filename
interface TerrainChunk {
  sizeX: integer
  sizeY: integer
  groundTexture: PaddedDoubleDigitString[]
  groundVariation: PaddedDoubleDigitString[]
  cliffTexture: PaddedDoubleDigitString[]
  cliffVariation: PaddedDoubleDigitString[]
  cliffLevel: PaddedDoubleDigitString[]
  groundHeight: CSVString[]
  waterHeight: CSVString[]
  ramp: BinaryDigitString[]
  blight: BinaryDigitString[]
  water: BinaryDigitString[]
  boundary: SingleDigitString[]
  cameras: Camera[]
  regions: Region[]
  doodads: Doodad[]
  specialDoodads: SpecialDoodad[]
  units: Unit[]
}

export type { TerrainData, TerrainChunk }
