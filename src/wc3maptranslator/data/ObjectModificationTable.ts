import { type FourCC, type integer } from '../CommonInterfaces'

enum ModificationType {
  INTEGER = 'INTEGER', // 0
  REAL = 'REAL', // 1
  UNREAL = 'UNREAL', // 2 - real but with value within [0.00, 1.00]
  STRING = 'STRING' // 3
}

enum ObjectType {
  Units = 'units',
  Items = 'items',
  Destructables = 'destructables',
  Doodads = 'doodads',
  Abilities = 'abilities',
  Buffs = 'buffs',
  Upgrades = 'upgrades'
}

interface Modification {
  type: ModificationType
  values: Record<integer, integer | string> // value per level/variant

  // Marked optional because these fields are not needed on any table.
  // They can be specified for: Doodads, Abilities, Upgrades, but if
  // not specified, they default to the value 0.
  // levelVariation?: integer // level is used as an array index
  dataPointer?: integer
}

interface ObjectData {
  originalId: FourCC
  modifications: Record<FourCC, Modification>
}

interface ObjectModificationTable {
  original: Record<FourCC, ObjectData>
  custom?: Record<FourCC, ObjectData>
}

export { ModificationType as ModificationType, type ObjectData, ObjectType, type Modification, type ObjectModificationTable }