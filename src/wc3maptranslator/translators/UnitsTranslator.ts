import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type WarResult, type JsonResult, type integer } from '../CommonInterfaces'
import { type Inventory, type Hero, type RandomSpawn, type Unit, type Abilities } from '../data/Unit'
import { type Translator } from './Translator'
import { type UnitSet } from '../data/UnitSet'
import { type DroppableItem, type ItemSet } from '../data/ItemSet'
import { LoggerFactory } from '../../logging/LoggerFactory'

const log = LoggerFactory.createLogger('UnitsTranslator')

export class UnitsTranslator implements Translator<Unit[]> {
  private static instance: UnitsTranslator

  private constructor () { }

  public static getInstance (): UnitsTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (units: Unit[], version: [integer, integer]): WarResult {
    return this.getInstance().jsonToWar(units, version)
  }

  public static warToJson (buffer: Buffer): JsonResult<Unit[]> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar (unitsJson: Unit[], [fileVersion, subVersion]: [integer, integer]): WarResult {
    const outBufferToWar = new HexBuffer()

    /*
    * Header
    */
    outBufferToWar.addChars('W3do')
    outBufferToWar.addInt(9)
    outBufferToWar.addInt(11)
    outBufferToWar.addInt(unitsJson.length) // number of units

    /*
    * Body
    */
    unitsJson?.forEach((unit) => {
      outBufferToWar.addChars(unit.type) // type
      outBufferToWar.addInt(unit.variation ?? 0) // variation
      outBufferToWar.addFloat(unit.position[0]) // position x
      outBufferToWar.addFloat(unit.position[1]) // position y
      outBufferToWar.addFloat(unit.position[2]) // position z
      outBufferToWar.addFloat(unit.rotation ?? 0) // rotation angle
      outBufferToWar.addFloat(unit.scale?.at(0) ?? 1) // scale x
      outBufferToWar.addFloat(unit.scale?.at(1) ?? 1) // scale y
      outBufferToWar.addFloat(unit.scale?.at(2) ?? 1) // scale z
      outBufferToWar.addChars(unit.skin ?? unit.type)
      outBufferToWar.addByte(unit.flags)
      outBufferToWar.addInt(unit.player)
      outBufferToWar.addByte(unit.byte1) // (byte unknown)
      outBufferToWar.addByte(unit.byte2) // (byte unknown)
      outBufferToWar.addInt(unit.hitpoints)
      outBufferToWar.addInt(unit.mana ?? 0)
      outBufferToWar.addInt(unit.randomItemSetPtr)
      outBufferToWar.addInt(unit.droppedItemSets?.length ?? 0)
      unit.droppedItemSets?.forEach(itemSet => {
        outBufferToWar.addInt(itemSet.items?.length ?? 0)
        itemSet.items?.forEach(item => {
          outBufferToWar.addChars(item.itemId)
          outBufferToWar.addInt(item.chance)
        })
      })

      // Gold amount
      // Required if unit is a gold mine
      // Optional (set to zero) if unit is not a gold mine
      outBufferToWar.addInt(unit.gold ?? 0)
      outBufferToWar.addFloat(unit.targetAcquisition ?? -1)

      // Unit hero attributes
      outBufferToWar.addInt(unit.hero?.level ?? 1)
      outBufferToWar.addInt(unit.hero?.str ?? 1)
      outBufferToWar.addInt(unit.hero?.agi ?? 1)
      outBufferToWar.addInt(unit.hero?.int ?? 1)

      // Inventory - - -
      outBufferToWar.addInt(unit.inventory?.length ?? 0)
      unit.inventory?.forEach(item => {
        outBufferToWar.addInt(item.slot - 1) // zero-index item slot
        outBufferToWar.addChars(item.type)
      })

      // Modified abilities - - -
      outBufferToWar.addInt(unit.abilities?.length ?? 0)
      unit.abilities?.forEach((ability) => {
        outBufferToWar.addChars(ability.ability) // ability string
        outBufferToWar.addInt(+ability.active) // 0 = not active, 1 = active
        outBufferToWar.addInt(ability.level)
      })

      // Random
      outBufferToWar.addInt(unit.random?.type ?? -1)
      switch (unit.random?.type) {
        case 0:
          outBufferToWar.addShort((unit.random.level as number) & 0xFFFF00)
          outBufferToWar.addByte((unit.random.level as number) & 0x0000FF)
          outBufferToWar.addByte(unit.random.itemClass as number)
          break
        case 1:
          outBufferToWar.addInt(unit.random.groupIndex as number)
          outBufferToWar.addInt(unit.random.columnIndex as number)
          break
        case 2:
          outBufferToWar.addInt((unit.random.unitSet as UnitSet)?.length || 0)
          unit.random.unitSet?.forEach(spawnableUnit => {
            outBufferToWar.addChars(spawnableUnit.unitId)
            outBufferToWar.addInt(spawnableUnit.chance)
          })
          break
      }

      outBufferToWar.addInt(unit.color ?? unit.player) // custom color, defaults to owning player
      outBufferToWar.addInt(unit.waygate ?? -1) // waygate
      outBufferToWar.addInt(unit.id) // id
    })

    return {
      errors: [],
      buffer: outBufferToWar.getBuffer()
    }
  }

  public warToJson (buffer: Buffer): JsonResult<Unit[]> {
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
        rotation: input.readFloat(),
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

  private getUnitSkin (outBufferToJSON: W3Buffer, fileVersion: number): string | undefined {
    if (fileVersion > 7) {
      return outBufferToJSON.readChars(4)
    }
  }

  private getRandomItemSetPtr (outBufferToJSON: W3Buffer, subVersion: number): number {
    if (subVersion !== 9) { // not RoC
      return outBufferToJSON.readInt()
    } else {
      return -1
    }
  }

  private getDroppedItemSets (outBufferToJSON: W3Buffer): ItemSet[] {
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

  private getHeroStats (outBufferToJSON: W3Buffer, subVersion: number): Hero {
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

  private getInventory (outBufferToJSON: W3Buffer): Inventory[] {
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

  private getAbilities (outBufferToJSON: W3Buffer): Abilities[] {
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

  private getRandomDropTable (outBufferToJSON: W3Buffer): RandomSpawn | undefined {
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
}
