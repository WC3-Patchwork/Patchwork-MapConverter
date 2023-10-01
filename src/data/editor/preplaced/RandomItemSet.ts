import { type integer } from '../common/DataTypes'
import { type FourCC } from '../common/FourCC'

interface RandomItem {
  itemId: FourCC
  dropChance: integer
}

interface RandomItemSet {
  items: RandomItem[]
}

export type { RandomItem, RandomItemSet }
