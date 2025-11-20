import { type Describable } from '../properties/Describable'
import { type Enableable } from '../properties/Enableable'
import { type TriggerContent } from './TriggerContent'

interface TriggerItemBase extends TriggerContent, Enableable, Describable {}

export type { TriggerItemBase }