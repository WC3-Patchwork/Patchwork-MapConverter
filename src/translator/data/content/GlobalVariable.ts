import { type ContentType, type TriggerContent } from './TriggerContent'

interface GlobalVariable extends TriggerContent {
  name: string
  contentType: ContentType
  type: string
  userDefined: boolean
  isArray: boolean
  arrayLength: number
  isInitialized: boolean
  initialValue: string
}

export type { GlobalVariable }
