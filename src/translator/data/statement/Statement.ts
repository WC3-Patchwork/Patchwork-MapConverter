import { type Enableable } from '../properties/Enableable'
import { type Parameter } from '../parameter/Parameter'
import { type StatementType } from './StatementType'

interface Statement extends Enableable {
  name: string
  parameters: Parameter[]
  type: StatementType
}

export { type Statement }
