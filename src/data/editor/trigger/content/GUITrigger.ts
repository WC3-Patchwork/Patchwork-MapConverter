import { type Describable } from '../properties/Describable'
import { type Enableable } from '../properties/Enableable'
import { type Statement } from '../statement/Statement'
import { type ContentType, type TriggerContent } from './TriggerContent'

interface GUITrigger extends TriggerContent, Enableable, Describable {
  name: string
  contentType: ContentType
  initiallyOff: boolean
  runOnMapInit: boolean
  events: Statement[]
  conditions: Statement[]
  actions: Statement[]
}

export type { GUITrigger }
