import { type Statement } from './Statement'
import { type TypedStatements } from './TypedStatements'

interface NestingStatement extends Statement {
  statements: TypedStatements[]
}

export type { NestingStatement }
