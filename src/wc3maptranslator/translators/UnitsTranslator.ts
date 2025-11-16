import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type WarResult, type JsonResult, type integer } from '../CommonInterfaces'
import { type Inventory, type Hero, type RandomSpawn, type Unit, type Abilities } from '../data/Unit'
import { type UnitSet } from '../data/UnitSet'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { LoggerFactory } from '../../logging/LoggerFactory'

const log = LoggerFactory.createLogger('UnitsTranslator')

export function jsonToWar (units: Unit[], [formatVersion, formatSubversion, editorVersion]: [integer, integer, integer]): WarResult {
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
    output.addInt(unit.mana ?? -1)

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
        // Random
        output.addInt(unit.random?.type ?? -1)
        switch (unit.random?.type) {
          case 0:
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

  return {
    errors: [],
    buffer: output.getBuffer()
  }
}

export function warToJson (buffer: Buffer): JsonResult<Unit[]> {
  const errors: Error[] = []
  const result: Unit[] = []
  const input = new W3Buffer(buffer)

  const fileId = input.readChars(4)
  if (fileId !== 'W3do') {
    log.warn(`Mismatched file format magic number, found '${fileId}', expected 'W3do', will attempt parsing...`)
  }

  const fileVersion = input.readInt()
  if (fileVersion !== 7 && fileVersion !== 8) {
    log.warn(`Unknown preplaced units file format version '${fileVersion}', expected 7 or 8, will attempt parsing...`)
  }

  const subVersion = input.readInt()
  if (subVersion !== 9 && subVersion !== 11) {
    log.warn(`Unknown preplaced units file format subversion '${fileVersion}', expected 9 or 11, will attempt parsing...`)
  }

  const numUnits = input.readInt() // # of units
  for (let i = 0; i < numUnits; i++) {
    result[i] = {
      type: input.readChars(4), // (iDNR = random item, uDNR = random unit)
      variation: input.readInt(),
      position: [input.readFloat(), input.readFloat(), input.readFloat()], // X Y Z coords
      angle: input.readFloat(),
      scale: [input.readFloat(), input.readFloat(), input.readFloat()], // X Y Z scaling
      skin: this.getUnitSkin(input, fileVersion),
      flags: input.readByte(),
      player: input.readShort(), // (player1 = 0, 16=neutral passive); note: wc3 patch now has 24 max players
      // the following 4 bytes are flags??
      flags1: input.readByte(), // unknown
      flags2: input.readByte(), // unknown
      flags1: input.readByte(), // unknown
      flags2: input.readByte(), // unknown
      hitpoints: input.readInt(), // -1 = use default
      mana: input.readInt(), // -1 = use default, 0 = unit doesn't have mana
      randomItemSetPtr: this.getRandomItemSetPtr(input, subVersion),
      droppedItemSets: this.getDroppedItemSets(input),
      gold: input.readInt(),
      targetAcquisition: input.readFloat(), // (-1 = normal, -2 = camp)
      hero: this.getHeroStats(input, subVersion),
      inventory: this.getInventory(input),
      abilities: this.getAbilities(input),
      random: this.getRandomDropTable(input),
      color: input.readInt(),
      waygate: input.readInt(), // waygate (-1 = deactivated, else its the creation number of the target rect as in war3map.w3r)
      id: input.readInt()
    }
  }

  return {
    errors,
    json: result
  }
}

function getUnitSkin (outBufferToJSON: W3Buffer, fileVersion: number): string | undefined {
  if (fileVersion > 7) {
    return outBufferToJSON.readChars(4)
  }
}

function getRandomItemSetPtr (outBufferToJSON: W3Buffer, subVersion: number): number {
  if (subVersion !== 9) { // not RoC
    return outBufferToJSON.readInt()
  } else {
    return -1
  }
}

function getDroppedItemSets (outBufferToJSON: W3Buffer): ItemSet[] {
  const itemSets: ItemSet[] = []
  const numDroppedItemSets = outBufferToJSON.readInt()
  for (let j = 0; j < numDroppedItemSets; j++) {
    const items: DroppableItem[] = []
    itemSets[j] = { items }
    const numDroppableItems = outBufferToJSON.readInt()
    for (let k = 0; k < numDroppableItems; k++) {
      items[k] = {
        itemId: outBufferToJSON.readChars(4), // Item ID
        chance: outBufferToJSON.readInt() // % chance to drop
      }
    }
  }
  return itemSets
}

function getHeroStats (outBufferToJSON: W3Buffer, subVersion: number): Hero {
  if (subVersion !== 9) { // Not-RoC version
    return {
      level: outBufferToJSON.readInt(), // non-hero units = 1
      str: outBufferToJSON.readInt(),
      agi: outBufferToJSON.readInt(),
      int: outBufferToJSON.readInt()
    }
  } else {
    return {
      level: outBufferToJSON.readInt(), // non-hero units = 1
      str: 1,
      agi: 1,
      int: 1
    }
  }
}

function getInventory (outBufferToJSON: W3Buffer): Inventory[] {
  const inventory: Inventory[] = []
  const numItemsInventory = outBufferToJSON.readInt()
  for (let j = 0; j < numItemsInventory; j++) {
    inventory.push({
      slot: outBufferToJSON.readInt() + 1, // the int is 0-based, but json format wants 1-6
      type: outBufferToJSON.readChars(4) // Item ID
    })
  }
  return inventory
}

function getAbilities (outBufferToJSON: W3Buffer): Abilities[] {
  const abilities: Abilities[] = []
  const numModifiedAbil = outBufferToJSON.readInt()
  for (let j = 0; j < numModifiedAbil; j++) {
    abilities.push({
      ability: outBufferToJSON.readChars(4), // Ability ID
      active: outBufferToJSON.readInt() === 1, // autocast active? 0=no, 1=active
      level: outBufferToJSON.readInt()
    })
  }
  return abilities
}

function getRandomDropTable (outBufferToJSON: W3Buffer): RandomSpawn | undefined {
  const randomType = outBufferToJSON.readInt() // random unit/item flag "r" (for uDNR units and iDNR items)
  if (randomType === 0) {
    // 0 = Any neutral passive building/item, in this case we have
    //   byte[3]: level of the random unit/item,-1 = any (this is actually interpreted as a 24-bit number)
    //   byte: item class of the random item, 0 = any, 1 = permanent ... (this is 0 for units)
    //   r is also 0 for non random units/items so we have these 4 bytes anyway (even if the id wasnt uDNR or iDNR)
    return {
      type: randomType,
      level: (outBufferToJSON.readShort() << 8) | outBufferToJSON.readByte(),
      itemClass: outBufferToJSON.readByte(),
      groupIndex: undefined,
      columnIndex: undefined,
      unitSet: undefined
    } satisfies RandomSpawn
  } else if (randomType === 1) {
    // 1 = random unit from random group (defined in the w3i), in this case we have
    //   int: unit group number (which group from the global table)
    //   int: position number (which column of this group)
    //   the column should of course have the item flag set (in the w3i) if this is a random item
    return {
      type: randomType,
      level: undefined,
      itemClass: undefined,
      groupIndex: outBufferToJSON.readInt(),
      columnIndex: outBufferToJSON.readInt(),
      unitSet: undefined
    } satisfies RandomSpawn
  } else if (randomType === 2) {
    // 2 = random unit from custom table, in this case we have
    //   int: number "n" of different available units
    //   then we have n times a random unit structure
    const unitSet: UnitSet = []
    const numDiffAvailUnits = outBufferToJSON.readInt()
    for (let k = 0; k < numDiffAvailUnits; k++) {
      unitSet[k] = {
        unitId: outBufferToJSON.readChars(4), // Unit ID
        chance: outBufferToJSON.readInt() // % chance
      }
    }

    return {
      type: randomType,
      level: undefined,
      itemClass: undefined,
      groupIndex: undefined,
      columnIndex: undefined,
      unitSet
    } satisfies RandomSpawn
  }
}
