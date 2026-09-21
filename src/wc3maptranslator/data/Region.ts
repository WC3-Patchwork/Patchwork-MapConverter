import { type color } from '../CommonInterfaces'

interface Region {
  position: Rect
  name: string
  id: number
  weatherEffect: string
  ambientSound: string
  color: color
  blockCamera: boolean
  alphaTileMinimapColor: boolean
}

interface Rect {
  left: number
  bottom: number
  right: number
  top: number
}

export type { Region, Rect }