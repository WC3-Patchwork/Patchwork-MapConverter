import { Service } from 'typedi'
import { type integer } from '../../data/editor/common/DataTypes'
import { type VersionedBinaryToJsonConverter } from '../VersionedBinaryToJsonConverter'
import { W3Buffer } from '../W3Buffer'

@Service()
export class CustomScriptsTranslator implements VersionedBinaryToJsonConverter<{ headerComments: string[], scripts: string[] }> {
  private static readonly expectedHeader = 0x04000080

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    const header = w3Buffer.readInt()
    return this.canTranslateFor(header)
  }

  public translate (buffer: Buffer): JSONTranslationResult<{ headerComments: string[], scripts: string[] }> {
    const resultObject: JSONTranslationResult<{ headerComments: string[], scripts: string[] }> = {
      result: {
        headerComments: [],
        scripts: []
      },
      errors: [],
      warnings: []
    }
    const outBufferToJSON = new W3Buffer(buffer)
    const header = outBufferToJSON.readInt()
    if (!this.canTranslateFor(header)) {
      resultObject.warnings.push((
        new Error(`Attempting to translate with translator not intended for following data: 
                header: ${header}\t\tExpected: '${CustomScriptsTranslator.expectedHeader}'`)))
    }

    const headerCommentsCount = outBufferToJSON.readInt()
    for (let i = 0; i < headerCommentsCount; i++) {
      resultObject.result.headerComments.push(outBufferToJSON.readString())
    }

    try {
      do {
        const lengthWithNulChar = outBufferToJSON.readInt()
        if (lengthWithNulChar === 0) {
          resultObject.result.scripts.push('')
          continue // skip
        }
        resultObject.result.scripts.push(outBufferToJSON.readString())
      } while (true)
    } catch (e) {
      // catch EOF
    }

    return resultObject
  }

  private canTranslateFor (header: integer): boolean {
    return CustomScriptsTranslator.expectedHeader === header
  }
}
