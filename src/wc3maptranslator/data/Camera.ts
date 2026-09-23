import { type angle } from '../CommonInterfaces'

interface Camera {
  name: string
  targetX: number
  targetY: number
  offsetZ: number
  rotation: angle
  angleOfAttack: angle
  distance: number
  roll: number
  fieldOfView: angle
  farClipping: number
  nearClipping: number
  localPitch: number | undefined
  localYaw: number | undefined
  localRoll: number | undefined
  dofDistance: number | undefined
  dofScale: number | undefined
  posAbsoluteZ: number | undefined
  freeCamera: boolean | undefined
}

export type { Camera }