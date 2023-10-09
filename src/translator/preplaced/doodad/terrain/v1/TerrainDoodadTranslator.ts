import { Service } from 'typedi'
import { type integer } from '../../../../../data/editor/common/DataTypes'
import { FourCC } from '../../../../../data/editor/common/FourCC'
import { type TerrainDoodad } from '../../../../../data/editor/preplaced/doodad/TerrainDoodad'
import { type VersionedBinaryToJsonConverter } from '../../../../VersionedBinaryToJsonConverter'
import { W3Buffer } from '../../../../W3Buffer'

@Service()
export class TerrainDoodadTranslator implements VersionedBinaryToJsonConverter<TerrainDoodad[]> {
  readonly expectedFormatVersion = 1

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    return this.canTranslateFor(w3Buffer.readInt())
  }

  public translate (buffer: Buffer): JSONTranslationResult<TerrainDoodad[]> {
    const resultObject: JSONTranslationResult<TerrainDoodad[]> = {
      result: [],
      errors: [],
      warnings: []
    }
    const outBufferToJSON = new W3Buffer(buffer)
    const formatVersion = outBufferToJSON.readInt()
    if (!this.canTranslateFor(formatVersion)) {
      resultObject.warnings.push(
        new Error(`Attempting to translate with translator not intended for following data:
            Format version: ${formatVersion}\t\t${this.expectedFormatVersion}`))
    }
    const terrainDoodadCount = outBufferToJSON.readInt()
    for (let i = 0; i < terrainDoodadCount; i++) {
      resultObject.result.push({
        type: FourCC.fromCode(outBufferToJSON.readChars(4)),
        variation: outBufferToJSON.readInt(),
        x: outBufferToJSON.readInt(),
        y: outBufferToJSON.readInt()
      })
    }

    return resultObject
  }

  private canTranslateFor (formatVersion: integer): boolean {
    return this.expectedFormatVersion === formatVersion
  }
}
