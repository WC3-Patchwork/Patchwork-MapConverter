import { type Enableable } from '../properties/Enableable'
import { type Parameter } from '../parameter/Parameter'

interface Statement extends Enableable {
  name: string
  parameters: Parameter[]
}

export { type Statement }
