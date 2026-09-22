import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type vector3, type integer } from '../CommonInterfaces'
import { type Inventory, type Hero, type RandomSpawn, type Unit, type Abilities, type UnitFlag } from '../data/Unit'
import { type UnitSet } from '../data/UnitSet'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { UnitDefaults } from '../default/Unit'
import { colorBytesToHex, colorHexToBytes, deg2Rad, mergeBoolRecords, rad2Deg } from '../Util'
import { WidgetLightDefaults } from '../default/WidgetLight'
import { WidgetLight } from '../data/WidgetLight'

const log = LoggerFactory.createLogger('UnitsTranslator')

export function jsonToWar(units: Unit[], formatVersion: integer, formatSubversion: integer, editorVersion: integer): Buffer {
  if (formatVersion > 13) {
    throw new Error(`Unknown preplaced units format version=${formatVersion}, expected 13 or below`)
  }

  if (formatSubversion > 11) {
    throw new Error(`Unknown preplaced units format subversion=${formatSubversion}, expected 11 or below`)
  }
  const output = new HexBuffer()
  output.addChars('W3do')
  output.addInt(formatVersion)
  if (formatVersion >= 5) {
    output.addInt(formatSubversion)
  }
  output.addInt(units?.length ?? 0)
  units?.forEach((unit) => {
    output.addChars(unit.type)
    output.addInt(unit.variation ?? UnitDefaults.variation)
    output.addFloat(unit.position[0])
    output.addFloat(unit.position[1])
    output.addFloat(unit.position[2])
    output.addFloat(deg2Rad(unit.angle ?? 0))
    output.addFloat(unit.scale?.[0] ?? UnitDefaults.scale[0] as number)
    output.addFloat(unit.scale?.[1] ?? UnitDefaults.scale[1] as number)
    output.addFloat(unit.scale?.[2] ?? UnitDefaults.scale[2] as number)

    if (editorVersion >= 6089) {
      output.addChars(unit.skinId ?? unit.type)
    }

    if (formatVersion >= 13) {
      output.addInt(unit.groupId ?? UnitDefaults.groupId)
    }

    const flags = mergeBoolRecords(unit.flags, UnitDefaults.flags)
    if (formatVersion >= 6) {
      let flagValue = 0
      // 0x01 - in unplayable area - never = 0
      flagValue |= 0x02 // not used in script, only useful for doodads for game to determine which doodads it should skip during map loading (script generates them)
      if (flags.fixedZ) flagValue |= 0x04
      if (flags.useModelAxes) flagValue |= 0x08 // will probably get reset to 0 by vanilla editor, but if someone is using a custom editor, this might work
      // by default all units have 0x02
      output.addByte(flagValue)
    }
    output.addShort(unit.player)
    output.addInt(flags.isUprooted ? 1 : 0)
    output.addInt(unit.hitpoints ?? UnitDefaults.hitpoints)
    output.addInt(unit.mana ?? UnitDefaults.mana)

    if (formatSubversion >= 11) {
      output.addInt(unit.randomItemSetPtr ?? UnitDefaults.randomItemSetPtr)
    }
    if (formatSubversion !== 0) {
      const droppedItemSets = unit.droppedItemSets ?? UnitDefaults.droppedItemSets
      output.addInt(droppedItemSets.length)
      droppedItemSets?.forEach((itemSet) => {
        output.addInt(itemSet.items?.length ?? 0)
        itemSet.items?.forEach((item) => {
          output.addChars(item.itemId)
          output.addInt(item.chance)
        })
      })
    }

    if (formatSubversion >= 2) {
      output.addInt(unit.gold ?? UnitDefaults.gold)
    }

    if (formatSubversion >= 3) {
      output.addFloat(unit.targetAcquisition ?? UnitDefaults.targetAcquisition)
    }

    if (formatSubversion >= 5) {
      output.addInt(unit.hero?.level ?? UnitDefaults.hero.level)
      if (formatSubversion >= 10) {
        output.addInt(unit.hero?.str ?? UnitDefaults.hero.str)
        output.addInt(unit.hero?.agi ?? UnitDefaults.hero.agi)
        output.addInt(unit.hero?.int ?? UnitDefaults.hero.int)
      }

      const inventory = unit.inventory ?? UnitDefaults.inventory
      output.addInt(inventory.length)
      inventory.forEach((item) => {
        output.addInt(item.slot - 1) // zero-index item slot
        output.addChars(item.type)
      })

      const abilities = unit.abilities ?? UnitDefaults.abilities
      output.addInt(abilities.length)
      abilities.forEach((ability) => {
        output.addChars(ability.ability) // ability string
        output.addInt(+ability.active) // 0 = not active, 1 = active
        output.addInt(ability.level)
      })
    }

    if (formatSubversion == 7) {
      const randomUnitSet = unit.random?.unitSet ?? UnitDefaults.random.unitSet
      output.addInt(randomUnitSet.length)
      randomUnitSet.forEach((spawnableUnit) => {
        output.addChars(spawnableUnit.unitId)
        output.addInt(spawnableUnit.chance)
      })
    } else if (formatSubversion >= 8) {
      const randomUnitSet = unit.random?.unitSet ?? UnitDefaults.random.unitSet
      output.addInt(unit.random?.type ?? -1)
      switch (unit.random?.type) {
        case 0:
          output.addInt(((unit.random.level!) & 0x00FFFFFFFF)
            | (((unit.random.itemClass!) ?? 0) << 24) & 0xFF00000000)
          break
        case 1:
          output.addInt(unit.random.groupIndex!)
          output.addInt(unit.random.columnIndex!)
          break
        case 2:
          output.addInt(randomUnitSet.length)
          randomUnitSet.forEach((spawnableUnit) => {
            output.addChars(spawnableUnit.unitId)
            output.addInt(spawnableUnit.chance)
          })
          break
      }
    }

    if (formatSubversion >= 9) {
      output.addInt(unit.color ?? unit.player)
      output.addInt(unit.waygate ?? UnitDefaults.waygate)
    }

    if (formatSubversion >= 4) {
      output.addInt(unit.id ?? 0) // TODO: auto-assign, check how this works
    }

    if (formatVersion >= 13) {
      output.addFloat(unit.roll ?? UnitDefaults.roll)
      output.addFloat(unit.pitch ?? UnitDefaults.pitch)
      const doodadLights = unit.lights ?? UnitDefaults.lights
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

  return output.getBuffer()
}

export function warToJson(buffer: Buffer, editorVersion: integer): [Unit[], integer, integer] {
  const input = new W3Buffer(buffer)
  const fileId = input.readChars(4)
  if (fileId !== 'W3do') {
    log.warn(`Mismatched file format magic number, found '${fileId}', expected 'W3do', will attempt parsing...`)
  }
  const formatVersion = input.readInt()
  if (formatVersion > 13) {
    log.warn(`Unknown preplaced units format version '${formatVersion}', expected 13 or less, will attempt parsing...`)
  } else {
    log.info(`Preplaced units format version is ${formatVersion}.`)
  }
  const formatSubversion = input.readInt()
  if (formatSubversion > 11) {
    log.warn(`Unknown preplaced units format subversion '${formatSubversion}', expected 11 or less, will attempt parsing...`)
  } else {
    log.info(`Preplaced units format subversion is ${formatSubversion}.`)
  }

  const result: Unit[] = []
  const unitCount = input.readInt()
  for (let i = 0; i < unitCount; i++) {
    const type = input.readChars(4)
    const variation = input.readInt()
    const position = [input.readFloat(), input.readFloat(), input.readFloat()] as vector3 // X Y Z coords
    const angle = rad2Deg(input.readFloat())
    const scale = [input.readFloat(), input.readFloat(), input.readFloat()] as vector3 // X Y Z scaling

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
      groupId = UnitDefaults.groupId
    }

    const flags: UnitFlag = { fixedZ: false, isUprooted: false, useModelAxes: false }
    if (formatVersion >= 6) {
      const flagsValue = input.readByte()
      // 0x01 - in unplayable area
      // 0x02 - not used in script
      flags.fixedZ = !!(flagsValue & 0x04)
      flags.useModelAxes = !!(flagsValue & 0x08)
    }
    const player = input.readShort()
    flags.isUprooted = !!(input.readInt() & 0x01)
    const hitpoints = input.readInt()
    const mana = input.readInt()

    let randomItemSetPtr: integer
    if (formatSubversion >= 11) {
      randomItemSetPtr = input.readInt()
    } else {
      randomItemSetPtr = UnitDefaults.randomItemSetPtr
    }

    const droppedItemSets: ItemSet[] = []
    const numDroppedItemSets = input.readInt()
    for (let j = 0; j < numDroppedItemSets; j++) {
      const items: DroppableItem[] = []
      droppedItemSets[j] = { items }
      const numDroppableItems = input.readInt()
      for (let k = 0; k < numDroppableItems; k++) {
        items[k] = {
          itemId: input.readChars(4), // Item ID
          chance: input.readInt() // % chance to drop
        }
      }
    }

    let gold: integer
    if (formatSubversion >= 2) {
      gold = input.readInt()
    } else {
      gold = UnitDefaults.gold
    }

    let targetAcquisition: number
    if (formatSubversion >= 3) {
      targetAcquisition = input.readFloat() // (-1 = normal, -2 = camp)
    } else {
      targetAcquisition = UnitDefaults.targetAcquisition
    }

    let level: integer
    let str: integer
    let agi: integer
    let int: integer
    const inventory: Inventory[] = []
    const abilities: Abilities[] = []
    if (formatSubversion >= 5) {
      level = input.readInt()
      if (formatSubversion >= 10) {
        str = input.readInt()
        agi = input.readInt()
        int = input.readInt()
      } else {
        str = UnitDefaults.hero.str
        agi = UnitDefaults.hero.agi
        int = UnitDefaults.hero.int
      }

      const numItemsInventory = input.readInt()
      for (let j = 0; j < numItemsInventory; j++) {
        inventory[j] = {
          slot: input.readInt() + 1, // the int is 0-based, but json format wants 1-6
          type: input.readChars(4) // Item ID
        }
      }

      const numModifiedAbil = input.readInt()
      for (let j = 0; j < numModifiedAbil; j++) {
        abilities[j] = {
          ability: input.readChars(4), // Ability ID
          active: !!input.readInt(), // autocast active? 0=no, 1=active
          level: input.readInt()
        }
      }
    } else {
      level = UnitDefaults.hero.level
      str = UnitDefaults.hero.str
      agi = UnitDefaults.hero.agi
      int = UnitDefaults.hero.int
    }
    const hero = { level, str, agi, int } satisfies Hero

    let random: RandomSpawn | undefined
    let randomType: integer
    let randomUnitSet: UnitSet | undefined
    if (formatSubversion == 7) {
      const randomUnitCount = input.readInt()
      randomUnitSet = []
      for (let j = 0; j < randomUnitCount; j++) {
        randomUnitSet[j] = {
          unitId: input.readChars(4), // Unit ID
          chance: input.readInt() // % chance
        }
      }

      random = {
        type: 2,
        level: undefined,
        itemClass: undefined,
        groupIndex: undefined,
        columnIndex: undefined,
        unitSet: randomUnitSet
      } satisfies RandomSpawn
    } else {
      let randomLevel: integer | undefined
      let itemClass: integer | undefined
      let groupIndex: integer | undefined
      let columnIndex: integer | undefined
      randomType = input.readInt() // random unit/item flag "r" (for uDNR units and iDNR items)
      let unitSetCount: integer
      switch (randomType) {
        case 0:
          // 0 = Any neutral passive building/item, in this case we have
          //   byte[3]: level of the random unit/item,-1 = any (this is actually interpreted as a 24-bit number)
          //   byte: item class of the random item, 0 = any, 1 = permanent ... (this is 0 for units)
          //   r is also 0 for non random units/items so we have these 4 bytes anyway (even if the id wasnt uDNR or iDNR)
          randomLevel = input.readInt()
          itemClass = (randomLevel & 0xFF000000) >> 24
          randomLevel &= 0x00FFFFFFFF
          break
        case 1:
          // 1 = random unit from random group (defined in the w3i), in this case we have
          //   int: unit group number (which group from the global table)
          //   int: position number (which column of this group)
          //   the column should of course have the item flag set (in the w3i) if this is a random item
          groupIndex = input.readInt()
          columnIndex = input.readInt()
          break
        case 2:
          // 2 = random unit from custom table, in this case we have
          //   int: number "n" of different available units
          //   then we have n times a random unit structure
          randomUnitSet = []
          unitSetCount = input.readInt()
          for (let j = 0; j < unitSetCount; j++) {
            randomUnitSet[j] = {
              unitId: input.readChars(4), // Unit ID
              chance: input.readInt() // % chance
            }
          }
          break
      }
      if (randomType > 0) {
        random = {
          type: randomType,
          level: randomLevel,
          itemClass,
          groupIndex,
          columnIndex,
          unitSet: randomUnitSet
        } satisfies RandomSpawn
      }
    }

    let color: integer
    let waygate: integer
    if (formatSubversion >= 9) {
      color = input.readInt()
      waygate = input.readInt() // waygate (-1 = deactivated, else its the creation number of the target rect as in war3map.w3r)
    } else {
      color = player
      waygate = UnitDefaults.waygate
    }


    let id: integer
    if (formatSubversion >= 4) {
      id = input.readInt()
    } else {
      id = 0 //TODO: generate
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

    result[i] = {
      type,
      variation,
      position,
      angle,
      scale,
      skinId,
      groupId,
      flags,
      player,
      hitpoints,
      mana,
      randomItemSetPtr,
      droppedItemSets,
      gold,
      targetAcquisition,
      hero,
      inventory,
      abilities,
      random,
      color,
      waygate,
      id,
      roll,
      pitch,
      lights
    }
  }

  return [result, formatVersion, formatSubversion]
}