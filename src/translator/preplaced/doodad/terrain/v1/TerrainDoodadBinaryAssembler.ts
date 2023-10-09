import { Service } from 'typedi'
import { type TerrainDoodad } from '../../../../../data/editor/preplaced/doodad/TerrainDoodad'
import { type HexBuffer } from '../../../../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../../../../BinaryTranslationResult'
import { type JsonToBinaryConverter } from '../../../../JsonToBinaryConverter'

@Service()
export class TerrainDoodadBinaryAssembler implements JsonToBinaryConverter<TerrainDoodad[]> {
  readonly formatVersion = 1

  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length >= 1 && metadata[0] === this.formatVersion
  }

  public translate (outBufferToWar: HexBuffer, data: TerrainDoodad[], ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors = new Array<Error>()
    const warnings = new Array<Error>()

    outBufferToWar.addInt(this.formatVersion)
    outBufferToWar.addInt(data.length)
    for (const doodad of data) {
      this.translateTerrainDoodad(outBufferToWar, errors, warnings, doodad)
    }
    return {
      errors,
      warnings
    }
  }

  private translateTerrainDoodad (outBufferToWar: HexBuffer, errorsOutput: Error[], warningsOutput: Error[], data: TerrainDoodad): void {
    outBufferToWar.addChars(data.type.codeRep)
    outBufferToWar.addInt(data.variation)
    outBufferToWar.addInt(data.x)
    outBufferToWar.addInt(data.y)
  }
}
