import { type Statement } from '../statement/Statement'
import { type ParameterType } from './ParameterType'

interface Parameter {
  type: ParameterType
  value: string
  statement: Statement | undefined
  arrayIndex: Parameter | undefined
}

export { type Parameter }