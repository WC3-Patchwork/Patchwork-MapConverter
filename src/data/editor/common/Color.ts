import { type byte } from './DataTypes'

export interface ColorRGB {
  red: byte
  green: byte
  blue: byte
}

export interface ColorARGB extends ColorRGB {
  alpha: byte
}
