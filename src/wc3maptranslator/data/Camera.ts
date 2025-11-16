import { type angle, type vector3 } from '../CommonInterfaces'

interface Camera {
  target: vector3
  rotation: angle | undefined
  angleOfAttack: angle
  distance: number
  roll: number | undefined
  fieldOfView: angle
  farClipping: number
  float1: number // TODO: identify this mistery 100 value float
  name: string
}

export type { Camera }
