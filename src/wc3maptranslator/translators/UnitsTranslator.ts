import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type vector3, type integer } from '../CommonInterfaces'
import { type Inventory, type Hero, type RandomSpawn, type Unit, type Abilities, type UnitFlag } from '../data/Unit'
import { type UnitSet } from '../data/UnitSet'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { UnitDefaults } from '../default/Units'
import { mergeBoolRecords } from '../Util'

const log = LoggerFactory.createLogger('UnitsTranslator')

export function jsonToWar(units: Unit[], formatVersion: integer, formatSubversion: integer, editorVersion: integer): Buffer {
  if (formatVersion < 9) {
    throw new Error(`Unknown preplaced units format version=${formatVersion}, expected below 9`)
  }

  if (formatSubversion < 12) {
    throw new Error(`Unknown preplaced units format subversion=${formatSubversion}, expected below 12`)
  }
  const output = new HexBuffer()
  output.addChars('W3do')
  output.addInt(formatVersion)
  if (formatVersion > 4) {
    output.addInt(formatSubversion)
  }
  units?.forEach((unit) => {
    output.addChars(unit.type)
    output.addInt(unit.variation ?? UnitDefaults.variation)
    output.addFloat(unit.position[0])
    output.addFloat(unit.position[1])
    output.addFloat(unit.position[2])
    output.addFloat(unit.angle ?? 0)
    output.addFloat(unit.scale?.[0] ?? UnitDefaults.scale[0])
    output.addFloat(unit.scale?.[1] ?? UnitDefaults.scale[1])
    output.addFloat(unit.scale?.[2] ?? UnitDefaults.scale[2])

    if (editorVersion >= 6089) {
      output.addChars(unit.skin ?? unit.type)
    }

    const flags = mergeBoolRecords(unit.flags, UnitDefaults.flags)
    if (formatVersion > 5) {
      let flagValue = 0
      if (flags.fixedZ) flagValue |= 0x04
      output.addByte(flagValue | 0x02) // by default all units have 0x02, which means nothing
    }
    output.addShort(unit.player)
    output.addInt(flags.isUprooted ? 1 : 0)
    output.addInt(unit.hitpoints ?? UnitDefaults.hitpoints)
    output.addInt(unit.mana ?? UnitDefaults.mana)

    if (formatSubversion >= 11) {
      output.addInt(unit.randomItemSetPtr ?? UnitDefaults.randomItemSetPtr)
    }
    if (formatVersion !== 0) {
      const droppedItemSets = unit.droppedItemSets ?? UnitDefaults.droppedItemSets
      output.addInt(droppedItemSets.length)
      droppedItemSets?.forEach(itemSet => {
        output.addInt(itemSet.items?.length ?? 0)
        itemSet.items?.forEach(item => {
          output.addChars(item.itemId)
          output.addInt(item.chance)
        })
      })
    }

    if (formatVersion >= 2) {
      output.addInt(unit.gold ?? UnitDefaults.gold)
    }

    if (formatVersion >= 3) {
      output.addFloat(unit.targetAcquisition ?? UnitDefaults.targetAcquisition)
    }

    if (formatVersion >= 5) {
      output.addInt(unit.hero?.level ?? UnitDefaults.hero.level)
      if (formatVersion >= 10) {
        output.addInt(unit.hero?.str ?? UnitDefaults.hero.str)
        output.addInt(unit.hero?.agi ?? UnitDefaults.hero.agi)
        output.addInt(unit.hero?.int ?? UnitDefaults.hero.int)
      }

      const inventory = unit.inventory ?? UnitDefaults.inventory
      output.addInt(inventory.length)
      inventory.forEach(item => {
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

    if (formatVersion > 6) {
      const randomUnitSet = unit.random?.unitSet ?? UnitDefaults.random.unitSet
      if (formatVersion < 8) {
        output.addInt(randomUnitSet.length)
        randomUnitSet.forEach(spawnableUnit => {
          output.addChars(spawnableUnit.unitId)
          output.addInt(spawnableUnit.chance)
        })
      } else {
        output.addInt(unit.random?.type ?? -1)
        switch (unit.random?.type) {
          case 0:
            output.addInt(((unit.random.level!) & 0x00FFFFFFFF) |
        (((unit.random.itemClass!) ?? 0) << 24) & 0xFF00000000)
            break
          case 1:
            output.addInt(unit.random.groupIndex!)
            output.addInt(unit.random.columnIndex!)
            break
          case 2:
            output.addInt(randomUnitSet.length)
            randomUnitSet.forEach(spawnableUnit => {
              output.addChars(spawnableUnit.unitId)
              output.addInt(spawnableUnit.chance)
            })
            break
        }
      }

      if (formatVersion >= 9) {
        output.addInt(unit.playerColor ?? unit.player)
        output.addInt(unit.waygate ?? UnitDefaults.waygate)
      }
    }

    if (formatVersion > 3) {
      output.addInt(unit.id ?? 0) // TODO: auto-assign, check how this works
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
  if (formatVersion < 9) {
    log.warn(`Unknown preplaced units format version '${formatVersion}', expected less than 9, will attempt parsing...`)
  } else {
    log.info(`Preplaced units format version is ${formatVersion}.`)
  }
  const formatSubversion = input.readInt()
  if (formatSubversion < 12) {
    log.warn(`Unknown preplaced units format subversion '${formatVersion}', expected less than 12, will attempt parsing...`)
  } else {
    log.info(`Preplaced units format subversion is ${formatVersion}.`)
  }

  const result: Unit[] = []
  const unitCount = input.readInt()
  for (let i = 0; i < unitCount; i++) {
    const type = input.readChars(4)
    const variation = input.readInt()
    const position = [input.readFloat(), input.readFloat(), input.readFloat()] as vector3 // X Y Z coords
    const angle = input.readFloat()
    const scale = [input.readFloat(), input.readFloat(), input.readFloat()] as vector3 // X Y Z scaling

    let skin: string
    if (editorVersion >= 6089) {
      skin = input.readChars(4)
    } else {
      skin = type
    }

    const flags: UnitFlag = { fixedZ: false, isUprooted: false }
    if (formatVersion > 5) {
      const flagsValue = input.readByte()
      flags.fixedZ = !!(flagsValue & 0x04)
    }
    const player = input.readShort()
    flags.isUprooted = !!(input.readInt() & 0x01)
    const hitpoints = input.readInt()
    const mana = input.readInt()

    let randomItemSetPtr: integer
    if (formatSubversion >= 11) {
      randomItemSetPtr = input.readInt()
    } else {
      randomItemSetPtr = -1
    }

    const droppedItemSets: ItemSet[] = []
    if (formatVersion !== 0) {
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
    }

    let gold: integer
    if (formatVersion >= 2) {
      gold = input.readInt()
    } else {
      gold = 0
    }

    let targetAcquisition: number
    if (formatVersion >= 3) {
      targetAcquisition = input.readFloat() // (-1 = normal, -2 = camp)
    } else {
      targetAcquisition = -1
    }

    let level: integer
    let str: integer
    let agi: integer
    let int: integer
    const inventory: Inventory[] = []
    const abilities: Abilities[] = []
    if (formatVersion >= 5) {
      level = input.readInt()
      if (formatVersion >= 10) {
        str = input.readInt()
        agi = input.readInt()
        int = input.readInt()
      } else {
        str = 1; agi = 1; int = 1
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
          active : input.readInt() === 1, // autocast active? 0=no, 1=active
          level  : input.readInt()
        }
      }
    } else {
      level = 1; str = 1; agi = 1; int = 1
    }
    const hero = { level, str, agi, int } satisfies Hero

    let random: RandomSpawn | undefined
    let playerColor: integer
    let waygate: integer
    if (formatVersion > 6) {
      let randomType: integer
      let randomUnitSet: UnitSet | undefined
      let randomLevel: integer | undefined
      let itemClass: integer | undefined
      let groupIndex: integer | undefined
      let columnIndex: integer | undefined
      if (formatVersion < 8) {
        const randomUnitCount = input.readInt()
        randomUnitSet = []
        for (let j = 0; j < randomUnitCount; j++) {
          randomUnitSet[j] = {
            unitId: input.readChars(4), // Unit ID
            chance: input.readInt() // % chance
          }
        }
        randomType = 2
      } else {
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
      }

      if (randomType > 0) {
        random = {
          type   : randomType,
          level  : randomLevel,
          itemClass,
          groupIndex,
          columnIndex,
          unitSet: randomUnitSet
        } satisfies RandomSpawn
      }

      if (formatVersion >= 9) {
        playerColor = input.readInt()
        waygate = input.readInt() // waygate (-1 = deactivated, else its the creation number of the target rect as in war3map.w3r)
      } else {
        playerColor = player
        waygate = -1
      }
    } else {
      playerColor = player
      waygate = -1
    }

    let id: integer
    if (formatVersion > 3) {
      id = input.readInt()
    } else {
      id = 0
    }
    result[i] = {
      type,
      variation,
      position,
      angle,
      scale,
      skin,
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
      playerColor,
      waygate,
      id
    }
  }

  return [result, formatVersion, formatSubversion]
}