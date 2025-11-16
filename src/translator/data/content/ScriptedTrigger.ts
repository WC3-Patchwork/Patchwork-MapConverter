import { type ScriptContent } from '../properties/ScriptContent'
import { type BaseTrigger } from './BaseTrigger'

interface ScriptedTrigger extends BaseTrigger, ScriptContent {}

export type { ScriptedTrigger }
