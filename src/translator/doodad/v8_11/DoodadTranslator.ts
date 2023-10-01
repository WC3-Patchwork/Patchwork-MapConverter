import { Service } from 'typedi'
import { type integer } from '../../../data/editor/common/DataTypes'
import { FourCC } from '../../../data/editor/common/FourCC'
import { PropertyFlags } from '../../../data/editor/common/PropertyFlag'
import { type Doodad } from '../../../data/editor/preplaced/doodad/Doodad'
import { DoodadBuilder } from '../../../data/editor/preplaced/doodad/DoodadBuilder'
import { rad2Deg } from '../../../wc3maptranslator/AngleConverter'
import { type VersionedBinaryToJsonConverter } from '../../VersionedBinaryToJsonConverter'
import { W3Buffer } from '../../W3Buffer'
import { type ItemSetsTranslator } from '../../itemsets/ItemSetsTranslator'

@Service()
export class DoodadsTranslator implements VersionedBinaryToJsonConverter<Doodad[]> {
  private readonly expectedFileId = 'W3do'
  private readonly expectedVersion = 8
  private readonly expectedSubversion = 11

  constructor (
    private readonly itemSetsTranslator: ItemSetsTranslator
  ) {}

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    const fileId = w3Buffer.readChars(4)
    const version = w3Buffer.readInt()
    const subVersion = w3Buffer.readInt()

    return this.canTranslateFor(fileId, version, subVersion)
  }

  private canTranslateFor (fileId: string, version: integer, subVersion: integer): boolean {
    return (fileId === this.expectedFileId) &&
    (version === this.expectedVersion) &&
    (subVersion === this.expectedSubversion)
  }

  public translate (buffer: Buffer): JSONTranslationResult<Doodad[]> {
    const resultObject: JSONTranslationResult<Doodad[]> = {
      result: [],
      errors: [],
      warnings: []
    }
    const outBufferToJSON = new W3Buffer(buffer)

    const fileId = outBufferToJSON.readChars(4)
    const fileVersion = outBufferToJSON.readInt()
    const subVersion = outBufferToJSON.readInt()

    if (!this.canTranslateFor(fileId, fileVersion, subVersion)) {
      resultObject.warnings.push((
        new Error(`Attempting to translate with translator not intended for following data: 
            fileId: ${fileId}\t\tExpected: ${this.expectedFileId},
            fileVersion: ${fileVersion}\t\tExpected: ${this.expectedVersion},
            subVersion: ${subVersion}\t\tExpected: ${this.expectedSubversion}`)))
    }

    const numDoodads = outBufferToJSON.readInt() // # of doodads
    for (let i = 0; i < numDoodads; i++) {
      const doodad = new DoodadBuilder(FourCC.fromCode(outBufferToJSON.readChars(4)))
      doodad.variation = outBufferToJSON.readInt()
      doodad.position = {
        x: outBufferToJSON.readFloat(),
        y: outBufferToJSON.readFloat(),
        z: outBufferToJSON.readFloat()
      }
      doodad.angle = rad2Deg(outBufferToJSON.readFloat())

      doodad.scale = {
        x: outBufferToJSON.readFloat(),
        y: outBufferToJSON.readFloat(),
        z: outBufferToJSON.readFloat()
      }
      doodad.skinId = FourCC.fromCode(outBufferToJSON.readChars(4))

      const flags: PropertyFlags = new PropertyFlags(outBufferToJSON.readByte())
      doodad.flags = {
        visible: flags.readFlag(0b00000011),
        solid: flags.readFlag(0b00000010)
      }

      doodad.life = outBufferToJSON.readByte() // as a %

      if (this.itemSetsTranslator.canTranslate(buffer)) {
        const itemSetsResult = this.itemSetsTranslator.translate(buffer)
        doodad.randomItemSets = itemSetsResult.result
        resultObject.errors.push(...itemSetsResult.errors)
        resultObject.warnings.push(...itemSetsResult.warnings)
      } else {
        doodad.randomItemSets = outBufferToJSON.readInt()
        const numberOfItemSets = outBufferToJSON.readInt() // should be 0
        resultObject.warnings.push(new Error(`
          Number of item sets expected to be 0, but got ${numberOfItemSets} at offset ${(buffer.byteOffset - 4).toString(16)}
        `))
      }
      doodad.id = outBufferToJSON.readInt()

      resultObject.result.push(doodad)
    }

    return resultObject
  }
}
