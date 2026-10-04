import { type bitstring, type csv, type integer } from '../CommonInterfaces'

interface Terrain {
  tileset: Tileset
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


enum Tileset {
  ASHENVALE = 'ASHENVALE',
  BARRENS = 'BARRENS',
  FELWOOD = 'FELWOOD',
  DUNGEON = 'DUNGEON',
  LORDAERON_FALL = 'LORDAERON_FALL',
  UNDERGROUND = 'UNDERGROUND',
  ICECROWN = 'ICECROWN',
  DALARAN_RUINS = 'DALARAN_RUINS',
  BLACK_CITADEL = 'BLACK_CITADEL',
  LORDAERON_SUMMER = 'LORDAERON_SUMMER',
  NORTHREND = 'NORTHREND',
  OUTLAND = 'OUTLAND',
  CITYSCAPE_RUINS = 'CITYSCAPE_RUINS',
  VILLAGE_FALL = 'VILLAGE_FALL',
  LORDAERON_CAPITAL_RUINS = 'LORDAERON_CAPITAL_RUINS',
  VILLAGE = 'VILLAGE',
  LORDAERON_WINTER = 'LORDAERON_WINTER',
  DALARAN = 'DALARAN',
  CITYSCAPE = 'CITYSCAPE',
  SUNKEN_RUINS = 'SUNKEN_RUINS',
  LORDAERON_CAPITAL = 'LORDAERON_CAPITAL',
  UNDERCITY = 'UNDERCITY'
}

function toTilesetValue(tileset: Tileset): string {
  switch (tileset) {
    case Tileset.ASHENVALE:
      return 'A'
    case Tileset.BARRENS:
      return 'B'
    case Tileset.FELWOOD:
      return 'C'
    case Tileset.DUNGEON:
      return 'D'
    case Tileset.LORDAERON_FALL:
      return 'F'
    case Tileset.UNDERGROUND:
      return 'G'
    case Tileset.ICECROWN:
      return 'I'
    case Tileset.DALARAN_RUINS:
      return 'J'
    case Tileset.BLACK_CITADEL:
      return 'K'
    case Tileset.LORDAERON_SUMMER:
      return 'L'
    case Tileset.NORTHREND:
      return 'N'
    case Tileset.OUTLAND:
      return 'O'
    case Tileset.CITYSCAPE_RUINS:
      return 'P'
    case Tileset.VILLAGE_FALL:
      return 'Q'
    case Tileset.LORDAERON_CAPITAL_RUINS:
      return 'R'
    case Tileset.VILLAGE:
      return 'V'
    case Tileset.LORDAERON_WINTER:
      return 'W'
    case Tileset.DALARAN:
      return 'X'
    case Tileset.CITYSCAPE:
      return 'Y'
    case Tileset.SUNKEN_RUINS:
      return 'Z'
    case Tileset.LORDAERON_CAPITAL:
      return 'e'
    case Tileset.UNDERCITY:
      return 'u'
    default:
      return 'L'
  }
}

function toTileset(tilesetValue: string): Tileset {
  switch (tilesetValue) {
    case 'A':
      return Tileset.ASHENVALE
    case 'B':
      return Tileset.BARRENS
    case 'C':
      return Tileset.FELWOOD
    case 'D':
      return Tileset.DUNGEON
    case 'F':
      return Tileset.LORDAERON_FALL
    case 'G':
      return Tileset.UNDERGROUND
    case 'I':
      return Tileset.ICECROWN
    case 'J':
      return Tileset.DALARAN_RUINS
    case 'K':
      return Tileset.BLACK_CITADEL
    case 'L':
      return Tileset.LORDAERON_SUMMER
    case 'N':
      return Tileset.NORTHREND
    case 'O':
      return Tileset.OUTLAND
    case 'P':
      return Tileset.CITYSCAPE_RUINS
    case 'Q':
      return Tileset.VILLAGE_FALL
    case 'R':
      return Tileset.LORDAERON_CAPITAL_RUINS
    case 'V':
      return Tileset.VILLAGE
    case 'W':
      return Tileset.LORDAERON_WINTER
    case 'X':
      return Tileset.DALARAN
    case 'Y':
      return Tileset.CITYSCAPE
    case 'Z':
      return Tileset.SUNKEN_RUINS
    case 'e':
      return Tileset.LORDAERON_CAPITAL
    case 'u':
      return Tileset.UNDERCITY
    default:
      return Tileset.LORDAERON_SUMMER
  }
}

export type { Terrain, MapSize }
export { Boundary, Tileset, toTilesetValue, toTileset }