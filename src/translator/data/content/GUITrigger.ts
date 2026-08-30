import { type Statement } from '../statement/Statement'
import { type BaseTrigger } from './BaseTrigger'

interface GUITrigger extends BaseTrigger {
  initiallyOff: boolean
  events: Statement[]
  conditions: Statement[]
  actions: Statement[]
}

export type { GUITrigger }