import { type integer } from '../data/editor/common/DataTypes'
import { type HexBuffer } from '../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from './BinaryTranslationResult'

export interface JsonToBinaryConverter<T> {
  canTranslate: (...metadata: Array<integer | string>) => boolean
  translate: (outBufferToWar: HexBuffer, data: T, ...metadata: Array<integer | string>) => BinaryTranslationResult
}
