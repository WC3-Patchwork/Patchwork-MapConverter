import { type integer } from '../CommonInterfaces'

enum ModificationType {
  INTEGER = 'INTEGER', // 0
  REAL = 'REAL', // 1
  UNREAL = 'UNREAL', // 2 - real but with value within [0.00, 1.00]
  STRING = 'STRING' // 3
}

enum FileTypeExtension {
  units = 'w3u',
  items = 'w3t',
  destructables = 'w3b',
  doodads = 'w3d',
  abilities = 'w3a',
  buffs = 'w3h',
  upgrades = 'w3q'
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
  id: string
  type: ModificationType
  value: integer | number | string

  // Marked optional because these fields are not needed on any table.
  // They can be specified for: Doodads, Abilities, Upgrades, but if
  // not specified, they default to the value 0.
  levelVariation?: integer
  dataPointer?: integer
}

interface ObjectModificationTable {
  original: Record<string, Modification[]>
  custom?: Record<string, Modification[]>
}

export { ModificationType, FileTypeExtension, ObjectType, type Modification, type ObjectModificationTable }
