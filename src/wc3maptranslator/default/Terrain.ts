import { Boundary } from '../data'

const TerrainDefaults = {
  tileset: '\0',
  customTileset: true,
  tilePalette: [],
  cliffTilePalette: [],
  map: {
    offsetX: 0, offsetY: 0
  },
  groundTexture: 63, // for 2.0.0 it's \x0f, aka 15, therefore for new patch it will be 63
  groundVariation: 0,
  groundHeight: 0,
  waterHeight: -89.6, // -89.6 is the water zero level. The water zero level is a variable value found in Water.slk * 128. So if it is -0,7 --> water_zero_level = -0,7 * 128 = -89.6.
  cliffTexture: 15,
  cliffVariation: 0,
  cliffLevel: 0,
  ramp: false,
  blight: false,
  water: false,
  boundary: Boundary.None
}

export { TerrainDefaults }
