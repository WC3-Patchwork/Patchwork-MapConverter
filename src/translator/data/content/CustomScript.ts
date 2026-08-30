import { type ScriptContent } from '../properties/ScriptContent'
import { type TriggerItemBase } from './TriggerItemBase'

interface CustomScript extends TriggerItemBase, ScriptContent {}

export type { CustomScript }