import { Service } from 'typedi'
import { type VersionedBinaryToJsonConverter } from '../../VersionedBinaryToJsonConverter'
import { AssetType, type Asset } from '../../../data/editor/asset/Asset'
import { W3Buffer } from '../../W3Buffer'
import { type integer } from '../../../data/editor/common/DataTypes'

@Service()
export class AssetTranslator implements VersionedBinaryToJsonConverter<Asset[]> {
  private static readonly expectedFileVersion = 1

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    const fileVersion = w3Buffer.readInt()
    return this.canTranslateFor(fileVersion)
  }

  public translate (buffer: Buffer): JSONTranslationResult<Asset[]> {
    const resultObject: JSONTranslationResult<Asset[]> = {
      errors: [],
      warnings: [],
      result: []
    }
    const outBufferToJSON = new W3Buffer(buffer)

    const fileVersion = outBufferToJSON.readInt()
    if (!this.canTranslateFor(fileVersion)) {
      resultObject.warnings.push(
        new Error(`Attempting to translate with translator not intended for following data: 
              fileVersion: ${fileVersion}\t\tExpected: ${AssetTranslator.expectedFileVersion}`))
    }

    const numImports = outBufferToJSON.readInt() // # of imports
    for (let i = 0; i < numImports; i++) {
      const type = AssetType.fromOrdinal(outBufferToJSON.readByte())

      const importedFile = {
        type, // 5 or 8= standard path, 10 or 13: custom path
        path: outBufferToJSON.readString() // e.g. "war3mapImported\mysound.wav"
      }

      resultObject.result.push(importedFile)
    }

    return resultObject
  }

  private canTranslateFor (fileVersion: integer): boolean {
    return fileVersion === AssetTranslator.expectedFileVersion
  }
}
