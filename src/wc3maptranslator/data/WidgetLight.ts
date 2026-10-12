import { color } from "../CommonInterfaces"

export interface WidgetLight {
  index: number
  isShadowCasting: boolean
  color: color
  intensity: number
  shadowCastingStart: number
  shadowCastingEnd: number
  quadraticFalloff: number
  linearFalloff: number
  damping: number
}