import { type integer, type JsonResult, type WarResult } from '../CommonInterfaces'

export interface Translator<T> {
  jsonToWar: (json: T, version: [integer, integer]) => WarResult
  warToJson: (buffer: Buffer) => JsonResult<T>
}
