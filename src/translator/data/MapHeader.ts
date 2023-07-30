import { type Describable } from './properties/Describable'
import { type ScriptContent } from './properties/ScriptContent'
import { type TriggerContainer } from './TriggerContainer'

interface MapHeader extends TriggerContainer, ScriptContent, Describable {
}

export type { MapHeader }
