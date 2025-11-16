import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { rad2Deg, deg2Rad } from '../AngleConverter'
import { type integer, type FourCC } from '../CommonInterfaces'
import { type SpecialDoodad, type Doodad, type DoodadFlags } from '../data/Doodad'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { spec } from 'node:test/reporters'

export function jsonToWar ([doodads, specialDoodads]: [Doodad[], SpecialDoodad[]], [doodadFormatVersion, doodadFormatSubversion, specialDoodadFormatVersion]: [integer, integer, integer]): Buffer {
  const outBufferToWar = new HexBuffer()
  writeDoodads(outBufferToWar, doodads, doodadFormatVersion, doodadFormatSubversion)
  writeSpecialDoodads(outBufferToWar, specialDoodads, specialDoodadFormatVersion)
  return outBufferToWar.getBuffer()
}

function writeDoodads (output: HexBuffer, doodads: Doodad[], doodadFormatVersion: integer, doodadFormatSubversion: integer): void {
  if (doodadFormatVersion !== 7 && doodadFormatVersion !== 8) {
    throw new Error(`Unknown doodad format version=${doodadFormatVersion}, expected 7 or 8`)
  }

  if (doodadFormatSubversion !== 11 && doodadFormatSubversion !== 8) {
    throw new Error(`Unknown doodad format subversion=${doodadFormatSubversion}, expected 8 or 11`)
  }

  output.addChars('W3do') // file magic number
  output.addInt(doodadFormatVersion)
  output.addInt(doodadFormatSubversion)
  output.addInt(doodads?.length ?? 0)
  doodads?.forEach((doodad) => {
    output.addChars(doodad.type)
    output.addInt(doodad.variation ?? 0)
    output.addFloat(doodad.position[0])
    output.addFloat(doodad.position[1])
    output.addFloat(doodad.position[2])
    output.addFloat(deg2Rad(doodad.angle ?? 0))
    output.addFloat(doodad.scale?.at(0) ?? 1)
    output.addFloat(doodad.scale?.at(1) ?? 1)
    output.addFloat(doodad.scale?.at(2) ?? 1)
    output.addChars(doodad.skinId ?? doodad.type)
    output.addByte(serializeDoodadFlags(doodad))
    output.addByte(doodad.life ?? 100)
    output.addInt(doodad.randomItemSetPtr ?? -1)
    output.addInt(doodad.droppedItemSets?.length ?? 0)
    doodad.droppedItemSets?.forEach(itemSet => {
      output.addInt(itemSet.items?.length ?? 0)
      itemSet.items?.forEach(item => {
        output.addChars(item.itemId)
        output.addInt(item.chance)
      })
    })
    output.addInt(doodad.id)
  })
}

function serializeDoodadFlags (doodad: Doodad): number {
  const flags = doodad.flags ?? { inUnplayableArea: false, notUsedInScript: true, fixedZ: false }
  let treeFlag = 0
  if (flags.fixedZ) treeFlag |= 0x04
  if (flags.notUsedInScript) treeFlag |= 0x02
  if (flags.inUnplayableArea) treeFlag |= 0x01
  return treeFlag
}

function writeSpecialDoodads (output: HexBuffer, specialDoodads: SpecialDoodad[]): void {
  output.addInt(0) // special doodad format number, fixed at 0x00
  output.addInt(specialDoodads?.length || 0) // number of special doodads
  specialDoodads?.forEach(specialDoodad => {
    output.addChars(specialDoodad.type)
    output.addInt(specialDoodad.position[0])
    output.addInt(specialDoodad.position[1])
    output.addInt(specialDoodad.position[2])
  })
}

export function warToJson (buffer: Buffer, editorVersion: integer): [Doodad[], SpecialDoodad[]] {
  const input = new W3Buffer(buffer)
  const doodads: Doodad[] = []
  const fileId = input.readChars(4) // W3do for doodad file
  const formatVersion = input.readInt() // File version = 8

  if (formatVersion === 0) {
    throw new Error(`Unknown doodad file format version=${formatVersion}, expected above 0`)
  }

  let subVersion = 0
  if (formatVersion > 4) {
    subVersion = input.readInt()
  }

  const doodadCount = input.readInt()
  for (let i = 0; i < doodadCount; i++) {
    const type = input.readChars(4)
    const variation = input.readInt()
    const position = [input.readFloat(), input.readFloat(), input.readFloat()] as unknown as vector3
    const angle = rad2Deg(input.readFloat())
    const scale = [input.readFloat(), input.readFloat(), input.readFloat()]
    let skinId: string | undefined = type
    if (editorVersion >= 6089) {
      skinId = getDoodadSkinId(input, formatVersion)
    }

    let flags
    if (formatVersion > 5) {
      flags = getDoodadFlags(input)
    } else {
      flags = {}
    }
    const life = input.readByte() // as a %

    let randomItemSetPtr = 0
    let droppedItemSets
    if (formatVersion > 6) {
      randomItemSetPtr = input.readInt()
      droppedItemSets = getDroppedItemSets(input)
    }
    let id
    if (formatVersion > 3) {
      id = input.readInt()
    }
    doodads[i] = { type, variation, position, angle, scale, skinId, flags, life, randomItemSetPtr, droppedItemSets, id }
  }

  const specialDoodads: SpecialDoodad[] = []
  const specialDoodadFormatVersion = input.readInt()
  if (specialDoodadFormatVersion !== 0) {
    throw new Error(`Unknown special doodads format version=${specialDoodadFormatVersion}, expected 0`)
  }
  const specialDoodadCount = input.readInt()
  for (let i = 0; i < specialDoodadCount; i++) {
    specialDoodads[i] = {
      type: input.readChars(4),
      position: [input.readFloat(), input.readFloat(), input.readFloat()]
    }
  }

  return [doodads, specialDoodads]
}

function getDoodadSkinId (input: W3Buffer, fileVersion: number): FourCC | undefined {
  if (fileVersion) {
    return input.readChars(4)
  }
}

function getDoodadFlags (input: W3Buffer): DoodadFlags {
  const flags = input.readByte()
  return {
    fixedZ: !!(flags & 0x04),
    notUsedInScript: !!(flags & 0x02),
    inUnplayableArea: !!(flags & 0x01)
  }
}

function getDroppedItemSets (input: W3Buffer): ItemSet[] {
  const numberOfItemSets = input.readInt() // this should be 0 if randomItemSetPtr is >= 0
  const itemSets: ItemSet[] = []
  for (let j = 0; j < numberOfItemSets; j++) {
    // Read the item set
    const numberOfItems = input.readInt()
    const items: DroppableItem[] = []
    itemSets[j] = { items }
    for (let k = 0; k < numberOfItems; k++) {
      items[k] = {
        itemId: input.readChars(4), // Item ID
        chance: input.readInt() // % chance to drop
      }
    }
  }
  return itemSets
}
