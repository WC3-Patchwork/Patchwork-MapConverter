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
  id: FourCC
  type: ModificationType
  value: integer | string

  // Marked optional because these fields are not needed on any table.
  // They can be specified for: Doodads, Abilities, Upgrades, but if
  // not specified, they default to the value 0.
  levelVariation?: integer
  dataPointer?: integer
}

interface ObjectData {
  originalId: FourCC
  modifications: Modification[]
}

interface ObjectModificationTable {
  original: Record<FourCC, ObjectData>
  custom?: Record<FourCC, ObjectData>
}

export { ModificationType, type ObjectData, ObjectType, type Modification, type ObjectModificationTable }
