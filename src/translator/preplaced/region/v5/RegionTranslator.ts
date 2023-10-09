import { Service } from 'typedi'
import { type VersionedBinaryToJsonConverter } from '../../../VersionedBinaryToJsonConverter'
import { type Region } from '../../../../data/editor/preplaced/region/Region'
import { type integer } from '../../../../data/editor/common/DataTypes'
import { W3Buffer } from '../../../W3Buffer'

@Service()
export class RegionsTranslator implements VersionedBinaryToJsonConverter<Region[]> {
  private readonly expectedFormatVersion: integer = 5

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    const formatVersion = w3Buffer.readInt()
    return this.canTranslateFor(formatVersion)
  }

  public translate (buffer: Buffer): JSONTranslationResult<Region[]> {
    const resultObject: JSONTranslationResult<Region[]> = {
      result: [],
      errors: [],
      warnings: []
    }
    const outBufferToJSON = new W3Buffer(buffer)

    const fileVersion = outBufferToJSON.readInt() // File version
    if (!this.canTranslateFor(fileVersion)) {
      resultObject.warnings.push((
        new Error(`Attempting to translate with translator not intended for following data: 
                fileVersion: ${fileVersion}\t\tExpected: ${this.expectedFormatVersion}`)))
    }

    const numRegions = outBufferToJSON.readInt() // # of regions
    for (let i = 0; i < numRegions; i++) {
      const region: Region = {
        position: {
          left: outBufferToJSON.readFloat(),
          bottom: outBufferToJSON.readFloat(),
          right: outBufferToJSON.readFloat(),
          top: outBufferToJSON.readFloat()
        },
        name: outBufferToJSON.readString(),
        id: outBufferToJSON.readInt(),
        weatherEffect: outBufferToJSON.readChars(4),
        ambientSound: outBufferToJSON.readString(),
        color: { // json wants it in RGB, but .w3r file stores it as BB GG RR
          blue: outBufferToJSON.readByte(),
          green: outBufferToJSON.readByte(),
          red: outBufferToJSON.readByte()
        }
      }

      outBufferToJSON.readByte() // end of region structure

      resultObject.result.push(region)
    }

    return resultObject
  }

  private canTranslateFor (formatVersion: integer): boolean {
    return formatVersion === this.expectedFormatVersion
  }
}
