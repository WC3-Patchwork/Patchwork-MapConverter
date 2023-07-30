import { type Parameter } from './Parameter'
import { type VariableParameter } from './VariableParameter'

interface ArrayVariableParameter extends VariableParameter {
  arrayIndex: Parameter
}

export type { ArrayVariableParameter }
