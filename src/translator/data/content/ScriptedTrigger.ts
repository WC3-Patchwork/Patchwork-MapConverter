import { type Describable } from '../properties/Describable'
import { type Enableable } from '../properties/Enableable'
import { ScriptContent } from '../properties/ScriptContent'
import { type ContentType, type TriggerContent } from './TriggerContent'

interface ScriptedTrigger extends TriggerContent, Enableable, Describable, ScriptContent {
  name: string
  contentType: ContentType
  initiallyOff: boolean
  runOnMapInit: boolean
}

export type { ScriptedTrigger }
