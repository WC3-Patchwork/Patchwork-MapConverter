import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { rad2Deg, deg2Rad } from '../AngleConverter'
import { type WarResult, type JsonResult, type FourCC } from '../CommonInterfaces'
import { type Translator } from './Translator'
import { type SpecialDoodad, type Doodad, type DoodadFlags } from '../data/Doodad'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'

export class DoodadsTranslator implements Translator<[Doodad[], SpecialDoodad[]]> {
  private static instance: DoodadsTranslator

  private constructor () { }

  public static getInstance (): DoodadsTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (doodads: [Doodad[], SpecialDoodad[]]): WarResult {
    return this.getInstance().jsonToWar(doodads)
  }

  public static warToJson (buffer: Buffer): JsonResult<[Doodad[], SpecialDoodad[]]> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar ([doodads, specialDoodads]: [Doodad[], SpecialDoodad[]]): WarResult {
    const outBufferToWar = new HexBuffer()
    this.writeDoodads(outBufferToWar, doodads)
    this.writeSpecialDoodads(outBufferToWar, specialDoodads)
    return {
      errors: [],
      buffer: outBufferToWar.getBuffer()
    }
  }

  private writeDoodads (outBufferToWar: HexBuffer, doodads: Doodad[]): void {
    outBufferToWar.addChars('W3do') // file id
    outBufferToWar.addInt(8) // file version
    outBufferToWar.addInt(11) // subversion 0x0B

    outBufferToWar.addInt(doodads?.length ?? 0) // num of trees
    doodads?.forEach((doodad) => {
      outBufferToWar.addChars(doodad.type)
      outBufferToWar.addInt(doodad.variation ?? 0)
      outBufferToWar.addFloat(doodad.position[0])
      outBufferToWar.addFloat(doodad.position[1])
      outBufferToWar.addFloat(doodad.position[2])
      outBufferToWar.addFloat(deg2Rad(doodad.angle ?? 0))
      outBufferToWar.addFloat(doodad.scale?.at(0) ?? 1)
      outBufferToWar.addFloat(doodad.scale?.at(1) ?? 1)
      outBufferToWar.addFloat(doodad.scale?.at(2) ?? 1)
      outBufferToWar.addChars(doodad.skinId ?? doodad.type)
      outBufferToWar.addByte(this.serializeDoodadFlags(doodad))
      outBufferToWar.addByte(doodad.life ?? 100)
      outBufferToWar.addInt(doodad.randomItemSetPtr ?? -1)
      outBufferToWar.addInt(doodad.droppedItemSets?.length ?? 0)
      doodad.droppedItemSets?.forEach(itemSet => {
        outBufferToWar.addInt(itemSet.items?.length ?? 0)
        itemSet.items?.forEach(item => {
          outBufferToWar.addChars(item.itemId)
          outBufferToWar.addInt(item.chance)
        })
      })
      outBufferToWar.addInt(doodad.id)
    })
  }

  private serializeDoodadFlags (doodad: Doodad): number {
    const flags = doodad.flags ?? { inUnplayableArea: false, notUsedInScript: true, fixedZ: false }
    let treeFlag = 0
    if (flags.fixedZ) treeFlag |= 0x04
    if (flags.notUsedInScript) treeFlag |= 0x02
    if (flags.inUnplayableArea) treeFlag |= 0x01
    return treeFlag
  }

  private writeSpecialDoodads (outBufferToWar: HexBuffer, specialDoodads: SpecialDoodad[]): void {
    outBufferToWar.addInt(0) // special doodad format number, fixed at 0x00
    outBufferToWar.addInt(specialDoodads?.length || 0) // number of special doodads
    specialDoodads?.forEach(specialDoodad => {
      outBufferToWar.addChars(specialDoodad.type)
      outBufferToWar.addInt(specialDoodad.position[0])
      outBufferToWar.addInt(specialDoodad.position[1])
      outBufferToWar.addInt(specialDoodad.position[2])
    })
  }

  public warToJson (buffer: Buffer): JsonResult<[Doodad[], SpecialDoodad[]]> {
    const outBufferToJSON = new W3Buffer(buffer)
    return {
      errors: [],
      json: [this.readDoodads(outBufferToJSON), this.readSpecialDoodads(outBufferToJSON)]
    }
  }

  private readDoodads (input: W3Buffer): Doodad[] {
    const doodads: Doodad[] = []
    const fileId = input.readChars(4) // W3do for doodad file
    const fileVersion = input.readInt() // File version = 8
    const subVersion = input.readInt() // 0B 00 00 00
    const numDoodads = input.readInt() // # of doodads
    for (let i = 0; i < numDoodads; i++) {
      doodads[i] = {
        type: input.readChars(4),
        variation: input.readInt(),
        position: [input.readFloat(), input.readFloat(), input.readFloat()],
        angle: rad2Deg(input.readFloat()),
        scale: [input.readFloat(), input.readFloat(), input.readFloat()],
        skinId: this.getDoodadSkinId(input, fileVersion),
        flags: this.getDoodadFlags(input),
        life: input.readByte(), // as a %
        randomItemSetPtr: input.readInt(), // points to an item set defined in the map (rather than custom one defined below)
        droppedItemSets: this.getDroppedItemSets(input),
        id: input.readInt()
      }
    }
    return doodads
  }

  private getDoodadSkinId (outBufferToJSON: W3Buffer, fileVersion: number): FourCC | undefined {
    if (fileVersion) {
      return outBufferToJSON.readChars(4)
    }
  }

  private getDoodadFlags (outBufferToJSON: W3Buffer): DoodadFlags {
    const flags = outBufferToJSON.readByte()
    return {
      fixedZ: !!(flags & 0x04),
      notUsedInScript: !!(flags & 0x02),
      inUnplayableArea: !!(flags & 0x01)
    }
  }

  private getDroppedItemSets (outBufferToJSON: W3Buffer): ItemSet[] {
    const numberOfItemSets = outBufferToJSON.readInt() // this should be 0 if randomItemSetPtr is >= 0
    const itemSets: ItemSet[] = []
    for (let j = 0; j < numberOfItemSets; j++) {
      // Read the item set
      const numberOfItems = outBufferToJSON.readInt()
      const items: DroppableItem[] = []
      itemSets[j] = { items }
      for (let k = 0; k < numberOfItems; k++) {
        items[k] = {
          itemId: outBufferToJSON.readChars(4), // Item ID
          chance: outBufferToJSON.readInt() // % chance to drop
        }
      }
    }
    return itemSets
  }

  private readSpecialDoodads (outBufferToJSON: W3Buffer): SpecialDoodad[] {
    const resultSpecial: SpecialDoodad[] = []
    const specialDoodadFormatVersion = outBufferToJSON.readInt() // usually '0'
    const numSpecialDoodads = outBufferToJSON.readInt()
    for (let i = 0; i < numSpecialDoodads; i++) {
      resultSpecial[i] = {
        type: outBufferToJSON.readChars(4),
        position: [outBufferToJSON.readFloat(),
          outBufferToJSON.readFloat(),
          outBufferToJSON.readFloat()]
      }
    }
    return resultSpecial
  }
}
