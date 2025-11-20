import { type integer } from '../CommonInterfaces'

interface ItemSet {
  items: DroppableItem[] | undefined
}

interface DroppableItem {
  itemId: string
  chance: integer
}

export type { ItemSet, DroppableItem }