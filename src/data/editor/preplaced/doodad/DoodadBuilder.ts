import { type angle } from '../../common/Angle'
import { type integer, type byte } from '../../common/DataTypes'
import { type FourCC } from '../../common/FourCC'
import { type Value3D } from '../../common/Value3D'
import { type RandomItemSet } from '../RandomItemSet'
import { type Doodad } from './Doodad'
import { type DoodadFlag } from './DoodadFlag'

export class DoodadBuilder implements Doodad {
  type: FourCC
  variation: integer = 0
  position: Value3D = { x: 0, y: 0, z: 0 }
  angle: angle = -1
  scale: Value3D = { x: 0, y: 0, z: 0 }
  skinId: FourCC
  flags: DoodadFlag = { visible: true, solid: true }
  randomItemSets: integer | RandomItemSet[] = -1
  life: byte = -1
  id: integer = -1
  constructor (type: FourCC) {
    this.type = type
    this.skinId = type
  }
}
