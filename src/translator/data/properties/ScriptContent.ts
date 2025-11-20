import { type TriggerContent } from '../content/TriggerContent'
import { type Describable } from './Describable'

interface ScriptContent extends TriggerContent, Describable {
  script: string
}

export { type ScriptContent }