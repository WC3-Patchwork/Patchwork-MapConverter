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

  public translate (buffer: Buffer): JSONExportResult<Doodad[]> {
    const resultObject: JSONExportResult<Doodad[]> = {
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

  //   public jsonToWar (doodadsRootJson: PreplacedDoodads): WarResult {
  //     const doodadsJson = doodadsRootJson.normal
  //     const outBufferToWar = new HexBuffer()
  //     /*
  //          * Header
  //          */
  //     outBufferToWar.addChars('W3do') // file id
  //     outBufferToWar.addInt(8) // file version
  //     outBufferToWar.addInt(11) // subversion 0x0B
  //     outBufferToWar.addInt(doodadsJson.length) // num of trees

  //     /*
  //          * Body
  //          */
  //     doodadsJson.forEach((tree) => {
  //       outBufferToWar.addChars(tree.type)
  //       outBufferToWar.addInt(tree.variation != null ? tree.variation : 0) // optional - default value 0
  //       outBufferToWar.addFloat(tree.position[0])
  //       outBufferToWar.addFloat(tree.position[1])
  //       outBufferToWar.addFloat(tree.position[2])

  //       // Angle
  //       // Doodads format is unique because it uses radians for angles, as opposed
  //       // to angles in any other file which use degrees. Hence conversion is needed.
  //       //    war3map: Expects angle in RADIANS
  //       //    JSON: Spec defines angle in DEGREES
  //       const radAngle = deg2Rad(tree.angle != null ? tree.angle : 0)
  //       outBufferToWar.addFloat(radAngle) // optional - default value 0

  //       // Scale
  //       if (tree.scale == null) tree.scale = [1, 1, 1]
  //       outBufferToWar.addFloat(tree.scale[0] != null ? tree.scale[0] : 1)
  //       outBufferToWar.addFloat(tree.scale[1] != null ? tree.scale[1] : 1)
  //       outBufferToWar.addFloat(tree.scale[2] != null ? tree.scale[2] : 1)

  //       outBufferToWar.addChars(tree.skinId)

  //       // Tree flags
  //       /* | Visible | Solid | Flag value |
  //                |   no    |  no   |     0      |
  //                |  yes    |  no   |     1      |
  //                |  yes    |  yes  |     2      | */
  //       let treeFlag = 2 // default: normal tree
  //       if (tree.flags == null) tree.flags = { visible: true, solid: true } // defaults if no flags are specified
  //       if (!tree.flags.visible && !tree.flags.solid) treeFlag = 0
  //       else if (tree.flags.visible && !tree.flags.solid) treeFlag = 1
  //       else if (tree.flags.visible && tree.flags.solid) treeFlag = 2
  //       // Note: invisible and solid is not an option
  //       outBufferToWar.addByte(treeFlag)

  //       outBufferToWar.addByte(tree.life != null ? tree.life : 100)

  //       if (typeof (tree.randomItemSets) === 'number') {
  //         outBufferToWar.addInt(tree.randomItemSets)
  //         outBufferToWar.addInt(-1)
  //       } else {
  //         outBufferToWar.addInt(-1)
  //         outBufferToWar.addInt(tree.randomItemSets.length)

  //         for (let j = 0; j < tree.randomItemSets.length; j++) {
  //           outBufferToWar.addInt(tree.randomItemSets[j].items.length)
  //           for (let k = 0; k < tree.randomItemSets[j].items.length; k++) {
  //             outBufferToWar.addChars(tree.randomItemSets[j].items[k].itemId)
  //             outBufferToWar.addInt(tree.randomItemSets[j].items[k].dropChance)
  //           }
  //         }
  //       }

  //       outBufferToWar.addInt(tree.id)
  //     })

  //     /*
  //          * Footer
  //          */
  //     outBufferToWar.addInt(0) // special doodad format number, fixed at 0x00
  //     outBufferToWar.addInt(doodadsRootJson.terrain.length)
  //     for (let i = 0; i < doodadsRootJson.terrain.length; i++) {
  //       outBufferToWar.addChars(doodadsRootJson.terrain[i].type) // doodad ID
  //       outBufferToWar.addInt(doodadsRootJson.terrain[i].variation)
  //       outBufferToWar.addInt(doodadsRootJson.terrain[i].x)
  //       outBufferToWar.addInt(doodadsRootJson.terrain[i].y)
  //     }

  //     return {
  //       errors: [],
  //       buffer: outBufferToWar.getBuffer()
  //     }
  //   }
}
