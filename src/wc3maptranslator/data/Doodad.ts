import { type angle } from '../CommonInterfaces'

interface Doodad {
  type: string
  variation: number
  position: number[]
  angle: angle
  scale: number[]
  skinId: string
  flags: DoodadFlag
  life: number
  id: number
}

interface DoodadFlag {
  visible: boolean
  solid: boolean
}

export type { Doodad, DoodadFlag }
