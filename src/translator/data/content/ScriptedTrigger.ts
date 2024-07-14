import { type Describable } from '../properties/Describable'
import { type Enableable } from '../properties/Enableable'
import { type ScriptContent } from '../properties/ScriptContent'
import { type ContentType, type TriggerContent } from './TriggerContent'

interface ScriptedTrigger extends TriggerContent, Enableable, Describable, ScriptContent {
  name: string
  contentType: ContentType
  description: string
  isEnabled: boolean
  runOnMapInit: boolean
}

export type { ScriptedTrigger }
