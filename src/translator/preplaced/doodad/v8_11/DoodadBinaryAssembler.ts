import { Service } from 'typedi'
import { type Doodad } from '../../../../data/editor/preplaced/doodad/Doodad'
import { type TerrainDoodad } from '../../../../data/editor/preplaced/doodad/TerrainDoodad'
import { deg2Rad } from '../../../../wc3maptranslator/AngleConverter'
import { type HexBuffer } from '../../../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../../../BinaryTranslationResult'
import { type JsonToBinaryConverter } from '../../../JsonToBinaryConverter'
import { ItemSetsBinaryAssembler } from '../../../itemsets/ItemSetsBinaryAssembler'
import { TerrainDoodadBinaryAssembler } from '../terrain/v1/TerrainDoodadBinaryAssembler'

export interface DoodadData {
  normal: Doodad[]
  terrain: TerrainDoodad[]
}

@Service()
export class DoodadBinaryAssembler implements JsonToBinaryConverter<DoodadData> {
  constructor (
    private readonly itemSetsBinaryAssembler: ItemSetsBinaryAssembler,
    private readonly terrainDoodadBinaryAssembler: TerrainDoodadBinaryAssembler
  ) {}

  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length >= 2 && metadata[0] === 'W3do' && metadata[1] === 8 && metadata[2] === 11
  }

  public translate (outBufferToWar: HexBuffer, data: DoodadData, ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors = new Array<Error>()
    const warnings = new Array<Error>()

    outBufferToWar.addChars('W3do') // file id
    outBufferToWar.addInt(8) // file version
    outBufferToWar.addInt(11) // subversion 0x0B

    outBufferToWar.addInt(data.normal.length)
    for (const doodad of data.normal) {
      this.translateNormalDoodad(outBufferToWar, errors, warnings, doodad)
    }

    if (metadata.length < 3) {
      warnings.push(new Error('Terrain doodads format version not specified, will try format \'1\''))
      this.terrainDoodadBinaryAssembler.translate(outBufferToWar, data.terrain, 1)
    } else if (this.terrainDoodadBinaryAssembler.canTranslate(metadata[3])) {
      this.terrainDoodadBinaryAssembler.translate(outBufferToWar, data.terrain, metadata[3])
    }

    return {
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

    // Doodad flags
    /* | Visible | Solid | Flag value |
            |   no    |  no   |     0      |
            |  yes    |  no   |     1      |
            |  yes    |  yes  |     2      | */
    let treeFlag = 2 // default: normal doodad
    if (!data.flags.visible && !data.flags.solid) treeFlag = 0
    else if (data.flags.visible && !data.flags.solid) treeFlag = 1
    else if (data.flags.visible && data.flags.solid) treeFlag = 2
    else if (!data.flags.visible && data.flags.solid) {
      warningsOutput.push(new Error(`Doodad [id=${data.id}]'s flags cannot be set to invisible and solid, defaulting to visible and solid.`))
    }
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
}
