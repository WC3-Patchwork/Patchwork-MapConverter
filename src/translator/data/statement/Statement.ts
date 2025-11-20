import { type Enableable } from '../properties/Enableable'
import { type Parameter } from '../parameter/Parameter'
import { type StatementType } from './StatementType'
import { type integer } from '../../../wc3maptranslator/CommonInterfaces'

interface Statement extends Enableable {
  name: string
  type: StatementType
  parameters: Parameter[]
  statements: Record<integer, Statement[]>
}

export { type Statement }