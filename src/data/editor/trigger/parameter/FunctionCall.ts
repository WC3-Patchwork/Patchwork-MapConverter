import { type Statement } from '../statement/Statement'
import { type StatementType } from '../statement/StatementType'
import { type Parameter } from './Parameter'

interface FunctionCall extends Parameter {
  name: string
  statementType: StatementType
  statement: Statement
}

export type { FunctionCall }
