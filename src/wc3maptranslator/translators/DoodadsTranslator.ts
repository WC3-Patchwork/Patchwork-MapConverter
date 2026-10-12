import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type SpecialDoodad, type Doodad } from '../data/Doodad'
import { rad2Deg, deg2Rad, mergeBoolRecords, colorHexToBytes, colorBytesToHex } from '../Util'
import { type integer, type vector3 } from '../CommonInterfaces'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { DoodadDefaults, SpecialDoodadDefaults } from '../default/Doodad'
import { WidgetLightDefaults } from '../default/WidgetLight'
import { WidgetLight } from '../data/WidgetLight'

const log = LoggerFactory.createLogger('DoodadsTranslator')

export interface DoodadsTranslatorOutput {
  doodads: Doodad[]
  specialDoodads: SpecialDoodad[] | undefined
}

export function jsonToWar({ doodads, specialDoodads }: DoodadsTranslatorOutput, formatVersion: integer, formatSubversion: integer | undefined, specialDoodadFormatVersion: integer | undefined, editorVersion: integer): Buffer {
  if (formatVersion > 13) {
    throw new Error(`Unknown doodad format version=${formatVersion}, expected below 14`)
  }

  formatSubversion = formatSubversion ?? 0
  if (formatSubversion > 11) {
    throw new Error(`Unknown doodad format subversion=${formatSubversion}, expected below 12`)
  }
  const output = new HexBuffer()
  output.addChars('W3do')
  output.addInt(formatVersion)
  if (formatVersion >= 5) {
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

    if (formatVersion >= 13) {
      output.addInt(doodad.groupId ?? DoodadDefaults.groupId)
    }

    if (formatVersion >= 6) {
      const flags = mergeBoolRecords(doodad.flags, DoodadDefaults.flags)
      let flagValue = 0
      if (flags.inUnplayableArea) flagValue |= 0x01
      if (flags.notUsedInScript) flagValue |= 0x02
      if (flags.fixedZ) flagValue |= 0x04
      if (flags.useModelAxes) flagValue |= 0x08
      output.addByte(flagValue)
    }

    output.addByte(doodad.life ?? DoodadDefaults.life)

    if (formatVersion >= 7) {
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

    if (formatVersion >= 13) {
      output.addInt(doodad.color ?? DoodadDefaults.color)
    }

    if (formatVersion >= 4) {
      output.addInt(doodad.id ?? -1) // TODO: auto-assign ID - figure out how it works
    }

    if (formatVersion >= 13) {
      output.addFloat(doodad.roll ?? DoodadDefaults.roll)
      output.addFloat(doodad.pitch ?? DoodadDefaults.pitch)
      const doodadLights = doodad.lights ?? DoodadDefaults.lights
      output.addInt(doodadLights.length)
      doodadLights.forEach((light, index) => {
        output.addInt(index)
        output.addInt(+(light.isShadowCasting ?? WidgetLightDefaults.isShadowCasting))
        colorHexToBytes(light.color ?? WidgetLightDefaults.color).forEach((it) => {
          output.addByte(it)
        })
        output.addFloat(light.intensity ?? WidgetLightDefaults.intensity)
        output.addFloat(light.shadowCastingStart ?? WidgetLightDefaults.shadowCastingStart)
        output.addFloat(light.shadowCastingEnd ?? WidgetLightDefaults.shadowCastingEnd)
        output.addFloat(light.quadraticFalloff ?? WidgetLightDefaults.quadraticFalloff)
        output.addFloat(light.linearFalloff ?? WidgetLightDefaults.linearFalloff)
        output.addFloat(light.damping ?? WidgetLightDefaults.damping)
      });
    }
  })

  if (formatVersion >= 3) {
    specialDoodadFormatVersion = specialDoodadFormatVersion ?? 0
    output.addInt(specialDoodadFormatVersion)
    output.addInt(specialDoodads?.length ?? 0)
    specialDoodads?.forEach((specialDoodad) => {
      output.addChars(specialDoodad.type)
      output.addInt(specialDoodad.variation ?? SpecialDoodadDefaults.variation)
      output.addInt(specialDoodad.position[0])
      output.addInt(specialDoodad.position[1])
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
  if (formatVersion >= 5) {
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

    let groupId: integer
    if (formatVersion >= 13) {
      groupId = input.readInt()
    } else {
      groupId = DoodadDefaults.groupId
    }

    let inUnplayableArea: boolean
    let notUsedInScript: boolean
    let fixedZ: boolean
    let useModelAxes: boolean
    if (formatVersion >= 6) {
      const flagsValue = input.readByte()
      inUnplayableArea = !!(flagsValue & 0x01)
      notUsedInScript = !!(flagsValue & 0x02)
      fixedZ = !!(flagsValue & 0x04)
      useModelAxes = !!(flagsValue & 0x08)
    } else {
      inUnplayableArea = DoodadDefaults.flags.inUnplayableArea
      notUsedInScript = DoodadDefaults.flags.notUsedInScript
      fixedZ = DoodadDefaults.flags.fixedZ
      useModelAxes = DoodadDefaults.flags.useModelAxes
    }

    const life = input.readByte() // as a %

    let randomItemSetPtr: integer
    let droppedItemSets: ItemSet[]
    if (formatVersion >= 7) {
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

    let color: integer| undefined
    if (formatVersion >= 13) {
      color = input.readInt()
    } else {
      color = undefined
    }

    let id: integer | undefined
    if (formatVersion >= 4) {
      id = input.readInt()
    } else {
      id = undefined
    }

    let roll: number| undefined
    let pitch: number| undefined
    let lights: WidgetLight[]| undefined
    if (formatVersion >= 13) {
      roll = input.readFloat()
      pitch = input.readFloat()
      const lightCount = input.readInt()
      if (lightCount > 0) {
        lights = []
      }
      for (let j = 0; j < lightCount; j++) {
        let index = input.readInt()
        let isShadowCasting = !!input.readInt()
        let color = colorBytesToHex(input.readByte(), input.readByte(), input.readByte(), input.readByte())
        let intensity = input.readFloat()
        let shadowCastingStart = input.readFloat()
        let shadowCastingEnd = input.readFloat()
        let quadraticFalloff = input.readFloat()
        let linearFalloff = input.readFloat()
        let damping = input.readFloat()
        lights?.push({
          index, isShadowCasting, color, intensity, shadowCastingStart, shadowCastingEnd, quadraticFalloff, linearFalloff, damping
        })
      }
      if (lightCount > 0) {
        lights?.sort((a, b) => a.index - b.index)
      }
    } else {
      roll = undefined
      pitch = undefined
      lights = undefined
    }

    doodads[i] = {
      type,
      variation,
      position,
      angle,
      scale,
      skinId,
      groupId,
      flags: { inUnplayableArea, notUsedInScript, fixedZ, useModelAxes },
      life,
      randomItemSetPtr,
      droppedItemSets,
      color,
      roll,
      pitch,
      lights,
      id
    }
  }

  let specialDoodadFormatVersion: integer | undefined
  const specialDoodads: SpecialDoodad[] = []
  if (formatVersion >= 3) {
    specialDoodadFormatVersion = input.readInt()
    if (specialDoodadFormatVersion !== 0) {
      log.warn(`Unknown special doodads format version=${specialDoodadFormatVersion}, expected 0, will attempt reading...`)
    } else {
      log.info(`Special doodads format version is ${specialDoodadFormatVersion}.`)
    }

    const specialDoodadCount = input.readInt()
    for (let i = 0; i < specialDoodadCount; i++) {
      specialDoodads[i] = {
        type: input.readChars(4),
        variation: input.readInt(),
        position: [input.readInt(), input.readInt()]
      }
    }
  }

  return [{ doodads, specialDoodads }, formatVersion, formatSubversion, specialDoodadFormatVersion]
}