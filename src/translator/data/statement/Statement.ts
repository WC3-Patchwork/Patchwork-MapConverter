import { type Enableable } from '../properties/Enableable'
import { type Parameter } from '../parameter/Parameter'

enum StatementClassifier {
  EVENT = 0,
  CONDITION = 1,
  ACTION = 2,
  CALL = 3 // questionable
}

interface Statement extends Enableable {
  name: string
  parameters: Parameter[]
}

export { type Statement, StatementClassifier }
