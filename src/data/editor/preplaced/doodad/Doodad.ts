import { type angle } from '../../common/Angle'
import { type integer, type byte } from '../../common/DataTypes'
import { type FourCC } from '../../common/FourCC'
import { type Value3D } from '../../common/Value3D'
import { type RandomItemSet } from '../RandomItemSet'
import { type DoodadFlag } from './DoodadFlag'

export interface Doodad {
  type: FourCC
  variation: integer
  position: Value3D
  angle: angle
  scale: Value3D
  skinId: FourCC
  flags: DoodadFlag
  randomItemSets: RandomItemSet[] | integer
  life: byte // percentage
  id: integer
}
