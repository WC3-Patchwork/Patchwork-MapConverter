import { type TriggerItemBase } from './TriggerItemBase'

interface BaseTrigger extends TriggerItemBase {
  runOnMapInit: boolean
}

export type { BaseTrigger }