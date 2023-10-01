import { Service } from 'typedi'
import { type Doodad } from '../../data/editor/preplaced/doodad/Doodad'
import { type TerrainDoodad } from '../../data/editor/preplaced/doodad/TerrainDoodad'
import { type JsonToBinaryConverter } from '../JsonToBinaryConverter'
import { type BinaryTranslationResult } from '../BinaryTranslationResult'
import { HexBuffer } from '../../wc3maptranslator/HexBuffer'
import { deg2Rad } from '../../wc3maptranslator/AngleConverter'
import { type ItemSetsBinaryAssembler } from '../itemsets/ItemSetsBinaryAssembler'

export interface DoodadData {
  normal: Doodad[]
  terrain: TerrainDoodad[]
}

@Service()
export class DoodadBinaryAssembler implements JsonToBinaryConverter<DoodadData> {
  constructor (
    readonly itemSetsBinaryAssembler: ItemSetsBinaryAssembler
  ) {}

  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length >= 3 && metadata[0] === 'W3do' && metadata[1] === 8 && metadata[2] === 11 && metadata[3] === 1
  }

  public translate (data: DoodadData): BinaryTranslationResult {
    const outBufferToWar = new HexBuffer()
    const errors = new Array<Error>()
    const warnings = new Array<Error>()

    outBufferToWar.addChars('W3do') // file id
    outBufferToWar.addInt(8) // file version
    outBufferToWar.addInt(11) // subversion 0x0B

    outBufferToWar.addInt(data.normal.length)
    for (const doodad of data.normal) {
      this.translateNormalDoodad(outBufferToWar, errors, warnings, doodad)
    }

    outBufferToWar.addInt(1)
    outBufferToWar.addInt(data.terrain.length)
    for (const doodad of data.terrain) {
      this.translateTerrainDoodad(outBufferToWar, errors, warnings, doodad)
    }
    return {
      result: outBufferToWar.getBuffer(),
      errors,
      warnings
    }
  }

  private translateNormalDoodad (outBufferToWar: HexBuffer, errorsOutput: Error[], warningsOutput: Error[], data: Doodad): void {
    outBufferToWar.addChars(data.type.codeRep)
    outBufferToWar.addInt(data.variation)
    outBufferToWar.addFloat(data.position.x)
    outBufferToWar.addFloat(data.position.y)
    outBufferToWar.addFloat(data.position.z)
    outBufferToWar.addFloat(deg2Rad(data.angle))
    outBufferToWar.addFloat(data.scale.x)
    outBufferToWar.addFloat(data.scale.y)
    outBufferToWar.addFloat(data.scale.z)
    outBufferToWar.addChars(data.skinId.codeRep)

    // Tree flags
    /* | Visible | Solid | Flag value |
            |   no    |  no   |     0      |
            |  yes    |  no   |     1      |
            |  yes    |  yes  |     2      | */
    let treeFlag = 2 // default: normal tree
    if (!data.flags.visible && !data.flags.solid) treeFlag = 0
    else if (data.flags.visible && !data.flags.solid) treeFlag = 1
    else if (data.flags.visible && data.flags.solid) treeFlag = 2
    // Note: invisible and solid is not an option
    outBufferToWar.addByte(treeFlag)

    outBufferToWar.addByte(data.life)

    if (typeof (data.randomItemSets) === 'number') {
      outBufferToWar.addInt(data.randomItemSets)
      outBufferToWar.addInt(-1)
    } else {
      outBufferToWar.addInt(-1)
      outBufferToWar.addInt(data.randomItemSets.length)
      this.itemSetsBinaryAssembler.translate(outBufferToWar, errorsOutput, warningsOutput, data.randomItemSets)
    }

    outBufferToWar.addInt(data.id)
  }

  private translateTerrainDoodad (outBufferToWar: HexBuffer, errorsOutput: Error[], warningsOutput: Error[], data: TerrainDoodad): void {
    outBufferToWar.addChars(data.type.codeRep)
    outBufferToWar.addInt(data.variation)
    outBufferToWar.addInt(data.x)
    outBufferToWar.addInt(data.y)
  }
}
