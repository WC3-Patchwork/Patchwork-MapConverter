import { type vector3, type angle } from '../CommonInterfaces'
import { type ItemSet } from './ItemSet'
import { type UnitSet } from './UnitSet'

interface Unit {
  type: string
  variation: number
  position: vector3
  rotation: angle
  scale: vector3 | undefined
  skin: string | undefined
  flags: number
  player: number
  byte1: number
  byte2: number
  hitpoints: number
  mana: number | undefined
  randomItemSetPtr: number
  droppedItemSets: ItemSet[] | undefined
  gold: number | undefined
  targetAcquisition: number | undefined // (-1 = normal, -2 = camp),
  hero: Hero | undefined
  inventory: Inventory[] | undefined
  abilities: Abilities[] | undefined
  random: RandomSpawn | undefined
  color: number | undefined
  waygate: number | undefined
  id: number
}

interface Hero {
  level: number
  str: number
  agi: number
  int: number
}

interface Inventory {
  slot: number // the int is 0-based, but json format wants 1-6
  type: string // Item ID
}

interface Abilities {
  ability: string // Ability ID
  active: boolean // autocast active? 0=no, 1=active
  level: number
}

interface RandomSpawn {
  type: number
  level: number | undefined
  itemClass: number | undefined
  groupIndex: number | undefined
  columnIndex: number | undefined
  unitSet: UnitSet | undefined
}

export type { Unit, Hero, Inventory, Abilities, RandomSpawn }
