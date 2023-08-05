import { type angle } from '../CommonInterfaces'

interface Unit {
  type: string
  variation: number
  position: number[]
  rotation: angle
  scale: number[]
  skin: string
  hero: Hero
  inventory: Inventory[]
  abilities: Abilities[]
  player: number
  hitpoints: number
  mana: number
  gold: number
  targetAcquisition: number // (-1 = normal, -2 = camp),
  color: number
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

export type { Unit, Hero, Inventory, Abilities }
