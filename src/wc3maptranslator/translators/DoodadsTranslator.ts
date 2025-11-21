import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { rad2Deg, deg2Rad, mergeBoolRecords } from '../Util'
import { type integer, type vector3 } from '../CommonInterfaces'
import { type SpecialDoodad, type Doodad } from '../data/Doodad'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { DoodadDefaults } from '../default/Doodad'

const log = LoggerFactory.createLogger('DoodadsTranslator')

export interface DoodadsTranslatorOutput {
  doodads: Doodad[]
  specialDoodads: SpecialDoodad[] | undefined
}

export function jsonToWar({ doodads, specialDoodads }: DoodadsTranslatorOutput, formatVersion: integer, formatSubversion: integer | undefined, specialDoodadFormatVersion: integer | undefined, editorVersion: integer): Buffer {
  if (formatVersion < 9) {
    throw new Error(`Unknown doodad format version=${formatVersion}, expected below 9`)
  }

  formatSubversion = formatSubversion ?? 0
  if (formatSubversion < 12) {
    throw new Error(`Unknown doodad format subversion=${formatSubversion}, expected below 12`)
  }
  const output = new HexBuffer()
  output.addChars('W3do')
  output.addInt(formatVersion)
  if (formatVersion > 4) {
    output.addInt(formatSubversion)
  }

  output.addInt(doodads?.length ?? 0)
  doodads?.forEach((doodad) => {
    output.addChars(doodad.type)
    output.addInt(doodad.variation ?? DoodadDefaults.variation)
    output.addFloat(doodad.position[0])
    output.addFloat(doodad.position[1])
    output.addFloat(doodad.position[2])
    output.addFloat(deg2Rad(doodad.angle))
    output.addFloat(doodad.scale?.[0] ?? DoodadDefaults.scale[0])
    output.addFloat(doodad.scale?.[1] ?? DoodadDefaults.scale[1])
    output.addFloat(doodad.scale?.[2] ?? DoodadDefaults.scale[2])

    if (editorVersion >= 6089) {
      output.addChars(doodad.skinId ?? doodad.type)
    }

    if (formatVersion > 5) {
      const flags = mergeBoolRecords(doodad.flags, DoodadDefaults.flags)
      let flagValue = 0
      if (flags.fixedZ) flagValue |= 0x04
      if (flags.notUsedInScript) flagValue |= 0x02
      if (flags.inUnplayableArea) flagValue |= 0x01
      output.addByte(flagValue)
    }

    output.addByte(doodad.life ?? DoodadDefaults.life)

    if (formatVersion > 6) {
      const droppedItemSets = doodad.droppedItemSets ?? DoodadDefaults.droppedItemSets
      output.addInt(doodad.randomItemSetPtr ?? DoodadDefaults.randomItemSetPtr)
      output.addInt(droppedItemSets.length)
      droppedItemSets.forEach((itemSet) => {
        output.addInt(itemSet.items?.length ?? 0)
        itemSet.items?.forEach((item) => {
          output.addChars(item.itemId)
          output.addInt(item.chance)
        })
      })
    }

    if (formatVersion > 3) {
      output.addInt(doodad.id ?? -1) // TODO: auto-assign ID - figure out how it works
    }
  })

  if (formatVersion > 2) {
    specialDoodadFormatVersion = specialDoodadFormatVersion ?? 0
    output.addInt(specialDoodadFormatVersion)
    output.addInt(specialDoodads?.length ?? 0)
    specialDoodads?.forEach((specialDoodad) => {
      output.addChars(specialDoodad.type)
      output.addInt(specialDoodad.position[0])
      output.addInt(specialDoodad.position[1])
      output.addInt(specialDoodad.position[2])
    })
  }
  return output.getBuffer()
}

export function warToJson(buffer: Buffer, editorVersion: integer): [DoodadsTranslatorOutput, integer, integer | undefined, integer | undefined] {
  const input = new W3Buffer(buffer)
  const fileMagicNumber = input.readChars(4)
  if (fileMagicNumber !== 'W3do') {
    log.warn(`Doodads file does not begin with 'W3do' magic number. It starts with ${fileMagicNumber}, will attempt reading...`)
  }
  const formatVersion = input.readInt()
  if (formatVersion === 0) {
    log.warn(`Unknown doodad file format version=${formatVersion}, expected above 0, will attempt reading...`)
  } else {
    log.info(`Doodad format version is ${formatVersion}.`)
  }

  let formatSubversion: integer
  if (formatVersion > 4) {
    formatSubversion = input.readInt()
    log.info(`Doodad format subversion is ${formatSubversion}.`)
  } else {
    formatSubversion = 0
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

    let fixedZ: boolean
    let notUsedInScript: boolean
    let inUnplayableArea: boolean
    if (formatVersion > 5) {
      const flagsValue = input.readByte()
      fixedZ = !!(flagsValue & 0x04)
      notUsedInScript = !!(flagsValue & 0x02)
      inUnplayableArea = !!(flagsValue & 0x01)
    } else {
      fixedZ = false
      notUsedInScript = true
      inUnplayableArea = false
    }

    const life = input.readByte() // as a %

    let randomItemSetPtr: integer
    let droppedItemSets: ItemSet[]
    if (formatVersion > 6) {
      randomItemSetPtr = input.readInt()
      const numberOfItemSets = input.readInt() // this should be 0 if randomItemSetPtr is >= 0
      if (randomItemSetPtr >= 0 && numberOfItemSets !== 0) {
        throw new Error(`For doodad ${i}: ${type} at world coords: ${position.join(', ')}, number of dropped item sets is ${numberOfItemSets} instead of 0 since randomItemSetPtr is ${randomItemSetPtr} and not -1.`)
      }

      droppedItemSets = [] as ItemSet[]
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
      randomItemSetPtr = DoodadDefaults.randomItemSetPtr
      droppedItemSets = [...DoodadDefaults.droppedItemSets]
    }
    let id: integer | undefined
    if (formatVersion > 3) {
      id = input.readInt()
    } else {
      id = undefined
    }
    doodads[i] = {
      type,
      variation,
      position,
      angle,
      scale,
      skinId,
      flags: { fixedZ, notUsedInScript, inUnplayableArea },
      life,
      randomItemSetPtr,
      droppedItemSets,
      id
    }
  }

  let specialDoodadFormatVersion: integer | undefined
  const specialDoodads: SpecialDoodad[] = []
  if (formatVersion > 2) {
    specialDoodadFormatVersion = input.readInt()
    if (specialDoodadFormatVersion !== 0) {
      log.warn(`Unknown special doodads format version=${specialDoodadFormatVersion}, expected 0, will attempt reading...`)
    } else {
      log.info(`Special doodads format version is ${specialDoodadFormatVersion}.`)
    }

    const specialDoodadCount = input.readInt()
    for (let i = 0; i < specialDoodadCount; i++) {
      specialDoodads[i] = {
        type    : input.readChars(4),
        position: [input.readFloat(), input.readFloat(), input.readFloat()]
      }
    }
  }

  return [{ doodads, specialDoodads }, formatVersion, formatSubversion, specialDoodadFormatVersion]
}