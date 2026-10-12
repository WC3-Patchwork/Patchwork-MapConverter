import { type TriggerContent } from './content/TriggerContent'
import { Describable } from './properties/Describable'

interface TriggerContainer extends TriggerContent, Describable {
  isExpanded: boolean
  isComment: boolean
  children: (TriggerContainer | TriggerContent)[]
}

function GetTriggerContainerChildren(node: TriggerContent): TriggerContent[] {
  return (node as TriggerContainer).children
}

export { type TriggerContainer, GetTriggerContainerChildren }