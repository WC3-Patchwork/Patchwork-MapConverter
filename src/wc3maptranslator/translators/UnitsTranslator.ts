import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type vector3, type integer } from '../CommonInterfaces'
import { type Inventory, type Hero, type RandomSpawn, type Unit, type Abilities, type UnitFlag } from '../data/Unit'
import { type UnitSet } from '../data/UnitSet'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { LoggerFactory } from '../../logging/LoggerFactory'

const log = LoggerFactory.createLogger('UnitsTranslator')

export function jsonToWar (units: Unit[], [formatVersion, formatSubversion, editorVersion]: [integer, integer, integer]): Buffer {
  const output = new HexBuffer()
  if (formatVersion < 9) {
    throw new Error(`Unknown doodad format version=${formatVersion}, expected below 9`)
  }

  if (formatSubversion < 12) {
    throw new Error(`Unknown doodad format subversion=${formatSubversion}, expected below 12`)
  }

  output.addChars('W3do')
  output.addInt(formatVersion)
  if (formatVersion > 4) {
    output.addInt(formatSubversion)
  }
  units?.forEach((unit) => {
    output.addChars(unit.type)
    output.addInt(unit.variation ?? 0)
    output.addFloat(unit.position[0])
    output.addFloat(unit.position[1])
    output.addFloat(unit.position[2])
    output.addFloat(unit.angle ?? 0)
    output.addFloat(unit.scale?.at(0) ?? 1)
    output.addFloat(unit.scale?.at(1) ?? 1)
    output.addFloat(unit.scale?.at(2) ?? 1)

    if (editorVersion >= 6089) {
      output.addChars(unit.skin ?? unit.type)
    }

    if (formatVersion > 5) {
      output.addByte(0x02 | (unit.flags.fixedZ ? 0x04 : 0)) // by default all units have 0x02, which means nothing
    }
    output.addShort(unit.player)
    output.addInt(unit.flags.isUprooted ? 1 : 0)
    output.addInt(unit.hitpoints ?? -1)
    output.addInt(unit.mana ?? 0)

    if (formatSubversion >= 11) {
      output.addInt(unit.randomItemSetPtr)
    }
    if (formatSubversion !== 0) {
      output.addInt(unit.droppedItemSets?.length ?? 0)
      unit.droppedItemSets?.forEach(itemSet => {
        output.addInt(itemSet.items?.length ?? 0)
        itemSet.items?.forEach(item => {
          output.addChars(item.itemId)
          output.addInt(item.chance)
        })
      })
    }

    if (formatSubversion >= 2) {
      output.addInt(unit.gold ?? 0)
    }

    if (formatSubversion >= 3) {
      output.addFloat(unit.targetAcquisition ?? -1)
    }

    if (formatSubversion >= 5) {
      output.addInt(unit.hero?.level ?? 1)
      if (formatSubversion >= 10) {
        output.addInt(unit.hero?.str ?? 1)
        output.addInt(unit.hero?.agi ?? 1)
        output.addInt(unit.hero?.int ?? 1)
      }

      output.addInt(unit.inventory?.length ?? 0)
      unit.inventory?.forEach(item => {
        output.addInt(item.slot - 1) // zero-index item slot
        output.addChars(item.type)
      })

      output.addInt(unit.abilities?.length ?? 0)
      unit.abilities?.forEach((ability) => {
        output.addChars(ability.ability) // ability string
        output.addInt(+ability.active) // 0 = not active, 1 = active
        output.addInt(ability.level)
      })
    }

    if (formatSubversion > 6) {
      if (formatSubversion < 8) {
        output.addInt((unit?.random?.unitSet)?.length ?? 0)
        unit?.random?.unitSet?.forEach(spawnableUnit => {
          output.addChars(spawnableUnit.unitId)
          output.addInt(spawnableUnit.chance)
        })
      } else {
        output.addInt(unit.random?.type ?? -1)
        switch (unit.random?.type) {
          case 0:
            // reminder: Little-Endian
            output.addInt(((unit.random.level as integer) & 0x00FFFFFFFF) |
        ((unit.random.itemClass as integer) ?? 0) & 0xFF00000000)
            break
          case 1:
            output.addInt(unit.random.groupIndex as integer)
            output.addInt(unit.random.columnIndex as integer)
            break
          case 2:
            output.addInt((unit.random.unitSet as UnitSet)?.length || 0)
            unit.random.unitSet?.forEach(spawnableUnit => {
              output.addChars(spawnableUnit.unitId)
              output.addInt(spawnableUnit.chance)
            })
            break
        }
      }

      if (formatSubversion >= 9) {
        output.addInt(unit.playerColor ?? unit.player) // custom color, defaults to owning player
        output.addInt(unit.waygate ?? -1) // waygate
      }
    }

    if (formatVersion > 3) {
      output.addInt(unit.id ?? 0)
    }
  })

  return output.getBuffer()
}

export function warToJson (buffer: Buffer, editorVersion: integer): Unit[] {
  const input = new W3Buffer(buffer)

  const fileId = input.readChars(4)
  if (fileId !== 'W3do') {
    log.warn(`Mismatched file format magic number, found '${fileId}', expected 'W3do', will attempt parsing...`)
  }

  const formatVersion = input.readInt()
  if (formatVersion < 9) {
    log.warn(`Unknown preplaced units file format version '${formatVersion}', expected less than 9, will attempt parsing...`)
  }

  const formatSubversion = input.readInt()
  if (formatSubversion < 12) {
    log.warn(`Unknown preplaced units file format subversion '${formatVersion}', expected less than 12, will attempt parsing...`)
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
    if (formatSubversion !== 0) {
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
    if (formatSubversion >= 2) {
      gold = input.readInt()
    } else {
      gold = 0
    }

    let targetAcquisition: number
    if (formatSubversion >= 3) {
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
    if (formatSubversion >= 5) {
      level = input.readInt()
      if (formatSubversion >= 10) {
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
          active: input.readInt() === 1, // autocast active? 0=no, 1=active
          level: input.readInt()
        }
      }
    } else {
      level = 1; str = 1; agi = 1; int = 1
    }
    const hero = { level, str, agi, int } satisfies Hero

    let random: RandomSpawn | undefined
    let playerColor: integer
    let waygate: integer
    if (formatSubversion > 6) {
      let randomType: integer
      let randomUnitSet: UnitSet | undefined
      let randomLevel: integer | undefined
      let itemClass: integer | undefined
      let groupIndex: integer | undefined
      let columnIndex: integer | undefined
      if (formatSubversion < 8) {
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
        let unitSetCount
        switch (randomType) {
          case 0:
            // 0 = Any neutral passive building/item, in this case we have
            //   byte[3]: level of the random unit/item,-1 = any (this is actually interpreted as a 24-bit number)
            //   byte: item class of the random item, 0 = any, 1 = permanent ... (this is 0 for units)
            //   r is also 0 for non random units/items so we have these 4 bytes anyway (even if the id wasnt uDNR or iDNR)
            randomLevel = input.readInt()
            itemClass = randomLevel & 0xFF000000
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
          type: randomType,
          level: randomLevel,
          itemClass,
          groupIndex,
          columnIndex,
          unitSet: randomUnitSet
        } satisfies RandomSpawn
      }

      if (formatSubversion >= 9) {
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
    if (formatSubversion > 3) {
      id = input.readInt()
    } else {
      id = 0
    }
    result[i] = { type, variation, position, angle, scale, skin, flags, player, hitpoints, mana, randomItemSetPtr, droppedItemSets, gold, targetAcquisition, hero, inventory, abilities, random, playerColor, waygate, id }
  }

  return result
}
