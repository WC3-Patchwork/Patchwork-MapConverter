import { type vector3, type angle } from '../CommonInterfaces'
import { type ItemSet } from './ItemSet'

interface Doodad {
  type: string
  variation: number | undefined
  position: vector3
  angle: angle
  scale: vector3 | undefined
  skinId: string
  flags: DoodadFlag
  life: number
  randomItemSetPtr: number | undefined
  droppedItemSets: ItemSet[] | undefined
  id: number
}

interface DoodadFlag {
  inUnplayableArea: boolean
  notUsedInScript: boolean
  fixedZ: boolean
}

interface SpecialDoodad {
  type: string
  position: vector3
}

export type { Doodad, DoodadFlag, SpecialDoodad }
