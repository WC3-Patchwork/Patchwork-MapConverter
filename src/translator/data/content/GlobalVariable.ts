import { type TriggerContent } from './TriggerContent'

interface GlobalVariable extends TriggerContent {
  type: string
  userDefined: boolean
  isArray: boolean
  arrayLength: number
  isInitialized: boolean
  initialValue: string
}

export type { GlobalVariable }