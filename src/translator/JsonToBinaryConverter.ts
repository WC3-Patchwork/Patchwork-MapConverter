import { type integer } from '../data/editor/common/DataTypes'
import { type BinaryTranslationResult } from './BinaryTranslationResult'

export interface JsonToBinaryConverter<T> {
  canTranslate: (...metadata: Array<integer | string>) => boolean
  translate: (data: T) => BinaryTranslationResult
}
