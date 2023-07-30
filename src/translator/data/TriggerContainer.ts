import { type TriggerContent } from './content/TriggerContent'

interface TriggerContainer extends TriggerContent {
  isExpanded: boolean
  children: Array<TriggerContainer | TriggerContent>
}

export { type TriggerContainer }
