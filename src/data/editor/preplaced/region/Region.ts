import { type ColorRGB } from '../../common/Color'
import { type real, type integer } from '../../common/DataTypes'

export interface Region {
  position: Rect
  name: string
  id: integer
  weatherEffect: string
  ambientSound: string
  color: ColorRGB
}

export interface Rect {
  left: real
  bottom: real
  right: real
  top: real
}
