import { type Statement } from './Statement'
import { type StatementType } from './StatementType'

interface TypedStatements {
  type: StatementType
  statements: Statement[]
}

export { type TypedStatements }
