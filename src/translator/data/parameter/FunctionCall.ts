import { type Parameter } from './Parameter'

interface FunctionCall extends Parameter {
  name: string
  parameters: Parameter[]
}

export type { FunctionCall }
