import { type vector3, type angle, type integer, vector2, color } from '../CommonInterfaces'
import { type ItemSet } from './ItemSet'
import { WidgetLight } from './WidgetLight'

interface Doodad {
  type: string
  variation: integer | undefined
  position: vector3
  angle: angle
  scale: vector3
  skinId: string | undefined
  groupId: integer | undefined
  flags: DoodadFlags
  life: integer
  randomItemSetPtr: integer | undefined
  droppedItemSets: ItemSet[] | undefined
  color: integer | undefined
  id: integer | undefined
  roll: number | undefined
  pitch: number | undefined
  lights: WidgetLight[] | undefined
}

interface DoodadFlags {
  inUnplayableArea: boolean
  notUsedInScript: boolean
  fixedZ: boolean
  useModelAxes: boolean
}

interface SpecialDoodad {
  type: string
  variation: integer | undefined
  position: vector2
}

export type { Doodad, DoodadFlags, SpecialDoodad }