import { type TriggerContent } from './content/TriggerContent'

interface TriggerContainer extends TriggerContent {
  isExpanded: boolean
  children: (TriggerContainer | TriggerContent)[]
}

function GetTriggerContainerChildren (node: TriggerContent): TriggerContent[] {
  return (node as TriggerContainer).children
}

export { type TriggerContainer, GetTriggerContainerChildren }
