import { integer } from "patchwork-data"
import { BinaryTranslationResult } from "./BinaryTranslationResult.js"

export interface JsonToBinaryConverter<T> {
  canTranslate: (...metadata: Array<integer | string>) => boolean
  translate: (outBufferToWar: HexBuffer, data: T, ...metadata: Array<integer | string>) => BinaryTranslationResult
}
