import { type integer } from '../../common/DataTypes'
import { type FourCC } from '../../common/FourCC'

export interface TerrainDoodad {
  type: FourCC
  variation: integer
  x: integer
  y: integer
}
