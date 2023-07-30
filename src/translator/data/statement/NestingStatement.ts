import { type Statement } from './Statement'

enum NestingStatementKey {
  CONDITION = 0,
  THEN_ACTION = 1,
  ELSE_ACTION = 2,
  LOOP_ACTION = 3
}

interface NestingStatement extends Statement {
  statements: Record<NestingStatementKey, Statement[]>
}

export { NestingStatementKey, type NestingStatement }
