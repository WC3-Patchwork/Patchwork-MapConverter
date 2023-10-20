import { Service } from 'typedi'
import { type JsonToBinaryConverter } from '../JsonToBinaryConverter'
import { type HexBuffer } from '../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../BinaryTranslationResult'

@Service()
export class StringLocaleFileAssembler implements JsonToBinaryConverter<Record<string, string>> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return true
  }

  public translate (outBufferToWar: HexBuffer, data: Record<string, string>, ...metadata: Array<string | number>): BinaryTranslationResult {
    /*
    * Strings
    */
    Object.keys(data).forEach((key) => {
      outBufferToWar.addChars('STRING ' + key)
      outBufferToWar.addNewLine()
      outBufferToWar.addChars('{')
      outBufferToWar.addNewLine()
      outBufferToWar.addChars(data[key])
      outBufferToWar.addNewLine()
      outBufferToWar.addChars('}')
      outBufferToWar.addNewLine()
      outBufferToWar.addNewLine()
    })

    return {
      errors: [],
      warnings: []
    }
  }
}
