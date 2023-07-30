import { type Describable } from '../properties/Describable'
import { type Enableable } from '../properties/Enableable'
import { type ScriptContent } from '../properties/ScriptContent'
import { type TriggerContent } from './TriggerContent'

interface CustomScript extends TriggerContent, Enableable, ScriptContent, Describable {}

export type { CustomScript }
