import { type ContentType, type TriggerContent } from './TriggerContent'

interface GlobalVariable extends TriggerContent {
  name: string
  contentType: ContentType
  type: string
  isArray: boolean
  arrayLength: number
  isInitialized: boolean
  initialValue: string
}

export type { GlobalVariable }
