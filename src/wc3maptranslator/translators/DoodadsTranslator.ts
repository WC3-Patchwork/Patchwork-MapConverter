import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { rad2Deg, deg2Rad } from '../AngleConverter'
import { type integer, type vector3 } from '../CommonInterfaces'
import { type SpecialDoodad, type Doodad } from '../data/Doodad'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'

export function jsonToWar ([doodads, specialDoodads]: [Doodad[], SpecialDoodad[]], [doodadFormatVersion, doodadFormatSubversion, specialDoodadFormatVersion, editorVersion]: [integer, integer, integer, integer]): Buffer {
  const output = new HexBuffer()
  if (doodadFormatVersion < 9) {
    throw new Error(`Unknown doodad format version=${doodadFormatVersion}, expected below 9`)
  }

  if (doodadFormatSubversion < 12) {
    throw new Error(`Unknown doodad format subversion=${doodadFormatSubversion}, expected below 12`)
  }

  output.addChars('W3do')
  output.addInt(doodadFormatVersion)
  if (doodadFormatVersion > 4) {
    output.addInt(doodadFormatSubversion)
  }

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

    if (editorVersion >= 6089) {
      output.addChars(doodad.skinId ?? doodad.type)
    }

    if (doodadFormatVersion > 5) {
      const flags = doodad.flags ?? { inUnplayableArea: false, notUsedInScript: true, fixedZ: false }
      let flagValue = 0
      if (flags.fixedZ) flagValue |= 0x04
      if (flags.notUsedInScript) flagValue |= 0x02
      if (flags.inUnplayableArea) flagValue |= 0x01
      output.addByte(flagValue)
    }

    output.addByte(doodad.life ?? 100)

    if (doodadFormatVersion > 6) {
      output.addInt(doodad.randomItemSetPtr ?? -1)
      output.addInt(doodad.droppedItemSets?.length ?? 0)
      doodad.droppedItemSets?.forEach(itemSet => {
        output.addInt(itemSet.items?.length ?? 0)
        itemSet.items?.forEach(item => {
          output.addChars(item.itemId)
          output.addInt(item.chance)
        })
      })
    }

    if (doodadFormatVersion > 3) {
      output.addInt(doodad.id ?? 0)
    }
  })

  if (doodadFormatVersion > 2) {
    output.addInt(specialDoodadFormatVersion)
    output.addInt(specialDoodads?.length || 0)
    specialDoodads?.forEach(specialDoodad => {
      output.addChars(specialDoodad.type)
      output.addInt(specialDoodad.position[0])
      output.addInt(specialDoodad.position[1])
      output.addInt(specialDoodad.position[2])
    })
  }
  return output.getBuffer()
}

export function warToJson (buffer: Buffer, editorVersion: integer): [Doodad[], SpecialDoodad[] | undefined] {
  const input = new W3Buffer(buffer)

  const fileMagicNumber = input.readChars(4)
  if (fileMagicNumber !== 'W3do') {
    throw new Error(`Doodads file does not being with 'W3do' magic number. It starts with ${fileMagicNumber}`)
  }
  const formatVersion = input.readInt()
  if (formatVersion === 0) {
    throw new Error(`Unknown doodad file format version=${formatVersion}, expected above 0`)
  }

  let subVersion
  if (formatVersion > 4) {
    subVersion = input.readInt()
  } else {
    subVersion = 0
  }

  const doodads: Doodad[] = []
  const doodadCount = input.readInt()
  for (let i = 0; i < doodadCount; i++) {
    const type = input.readChars(4)
    const variation = input.readInt()
    const position = [input.readFloat(), input.readFloat(), input.readFloat()] as vector3
    const angle = rad2Deg(input.readFloat())
    const scale = [input.readFloat(), input.readFloat(), input.readFloat()] as vector3

    let skinId: string
    if (editorVersion >= 6089) {
      skinId = input.readChars(4)
    } else {
      skinId = type
    }

    let flagsValue
    if (formatVersion > 5) {
      flagsValue = input.readByte()
    } else {
      flagsValue = 2
    }
    const flags = {
      fixedZ: !!(flagsValue & 0x04),
      notUsedInScript: !!(flagsValue & 0x02),
      inUnplayableArea: !!(flagsValue & 0x01)
    }

    const life = input.readByte() // as a %

    let randomItemSetPtr = 0
    let droppedItemSets: ItemSet[] | undefined
    if (formatVersion > 6) {
      randomItemSetPtr = input.readInt()
      const numberOfItemSets = input.readInt() // this should be 0 if randomItemSetPtr is >= 0
      if (randomItemSetPtr >= 0 && numberOfItemSets !== 0) {
        throw new Error(`For doodad ${i}: ${type} at world coords: ${position.join(', ')}, number of dropped item sets is ${numberOfItemSets} instead of 0 since randomItemSetPtr is ${randomItemSetPtr} and not -1.`)
      }

      const droppedItemSets = [] as ItemSet[]
      for (let j = 0; j < numberOfItemSets; j++) {
        // Read the item set
        const numberOfItems = input.readInt()
        const items: DroppableItem[] = []
        droppedItemSets[j] = { items }
        for (let k = 0; k < numberOfItems; k++) {
          items[k] = {
            itemId: input.readChars(4), // Item ID
            chance: input.readInt() // % chance to drop
          }
        }
      }
    } else {
      droppedItemSets = undefined
    }
    let id: integer | undefined
    if (formatVersion > 3) {
      id = input.readInt()
    } else {
      id = undefined
    }
    doodads[i] = { type, variation, position, angle, scale, skinId, flags, life, randomItemSetPtr, droppedItemSets, id }
  }

  const specialDoodads: SpecialDoodad[] = []
  if (formatVersion > 2) {
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
  }

  return [doodads, specialDoodads]
}
