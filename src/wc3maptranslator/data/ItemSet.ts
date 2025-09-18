interface ItemSet {
  items: DroppableItem[] | undefined
}

interface DroppableItem {
  itemId: string
  chance: number
}

export type { ItemSet, DroppableItem }
