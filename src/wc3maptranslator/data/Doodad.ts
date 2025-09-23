import { type vector3, type angle, type integer } from '../CommonInterfaces'
import { type ItemSet } from './ItemSet'

interface Doodad {
  type: string
  variation: integer | undefined
  position: vector3
  angle: angle
  scale: vector3
  skinId: string | undefined
  flags: DoodadFlags
  life: integer
  randomItemSetPtr: integer | undefined
  droppedItemSets: ItemSet[] | undefined
  id: integer | undefined
}

interface DoodadFlags {
  inUnplayableArea: boolean
  notUsedInScript: boolean
  fixedZ: boolean
}

interface SpecialDoodad {
  type: string
  position: vector3
}

export type { Doodad, DoodadFlags, SpecialDoodad }
