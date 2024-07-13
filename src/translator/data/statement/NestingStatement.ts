import { type Statement } from './Statement'

interface NestingStatement extends Statement {
  statements: Record<number, Statement[]>
}

export type { NestingStatement }
