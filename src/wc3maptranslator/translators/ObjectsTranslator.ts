import { LoggerFactory } from '../../logging/LoggerFactory'
import { type integer } from '../CommonInterfaces'
import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type Modification, ModificationType, type ObjectData, type ObjectModificationTable, ObjectType } from '../data/ObjectModificationTable'
import { ModificationDefaults, ObjectModificationTableDefaults } from '../default/ObjectModificationTable'

const log = LoggerFactory.createLogger('ObjectsTranslator')

enum TableType {
  original = 'original',
  custom = 'custom'
}

export function jsonToWar(json: ObjectModificationTable, objectType: ObjectType, formatVersion: integer): Buffer {
  if (formatVersion < 0 || formatVersion > 3) {
    throw new Error(`Unknown object definition format version=${formatVersion}, expected value from range [0, 3]`)
  }
  const output = new HexBuffer()
  output.addInt(formatVersion)

  const generateTableFromJson = (tableType: TableType, tableData: Record<string, ObjectData>): void => {
    const data = tableData ? Object.entries(tableData) : []
    output.addInt(data.length)
    data.forEach(([defKey, objectData]) => {
      if (tableType === TableType.original) {
        output.addChars(defKey)
        output.addChars(ModificationDefaults.customId)
      } else {
        output.addChars(objectData.originalId)
        output.addChars(defKey)
      }

      if (formatVersion >= 3) {
        // Once Blizzard decides to do something with this, I will add Set/Variant support
        // TODO: sets means adding another for loop, just take a look at warToJson function
        output.addInt(1) // SetCount
        output.addInt(ModificationDefaults.setFlag)
      }

      output.addInt(objectData.modifications.length)
      for (const modification of objectData.modifications) {
        output.addChars(modification.id)

        const fieldTypeValue = (function(fieldType: ModificationType): integer {
          switch (fieldType) {
            case ModificationType.INTEGER:
              return 0
            case ModificationType.REAL:
              return 1
            case ModificationType.UNREAL:
              return 2
            case ModificationType.STRING:
              return 3
          }
        })(modification.type)
        output.addInt(fieldTypeValue)

        let useExtraData: boolean
        switch (objectType) {
          case ObjectType.Abilities:
          case ObjectType.Upgrades:
            useExtraData = true
            break
          case ObjectType.Doodads:
            useExtraData = formatVersion > 0x01
            break
          default:
            useExtraData = false
            break
        }

        if (useExtraData) {
          output.addInt(modification.levelVariation ?? ModificationDefaults.levelVariation) // Level or variation
          output.addInt(modification.dataPointer ?? ModificationDefaults.dataPointer) // E.g DataA1 is 1 because of col A; refer to the xyzData.slk files for Data fields
        }

        switch (modification.type) {
          case ModificationType.INTEGER:
            output.addInt(modification.value as integer)
            break
          case ModificationType.REAL:
          case ModificationType.UNREAL:
            output.addFloat(modification.value as number)
            break
          case ModificationType.STRING:
            output.addString(modification.value as string)
            break
        }

        if (formatVersion > 0x00) {
          output.addChars(defKey)
        }
      }
    })
  }

  generateTableFromJson(TableType.original, json.original)
  if (json.custom) {
    generateTableFromJson(TableType.custom, json.custom)
  }

  return output.getBuffer()
}

export function warToJson(buffer: Buffer, objectType: ObjectType): [ObjectModificationTable, integer] {
  const input = new W3Buffer(buffer)
  const formatVersion = input.readInt()
  if (formatVersion < 0 || formatVersion > 3) {
    log.warn(`Unknown object definition format version ${formatVersion} will attempt at reading...`)
  } else {
    log.info(`Object definition format version is ${formatVersion}.`)
  }

  const readModificationTable = (input: W3Buffer, objectType: ObjectType, formatVersion: integer): Record<string, ObjectData> => {
    const modificationTable: Record<string, ObjectData> = {}

    const numTableModifications = input.readInt()
    for (let i = 0; i < numTableModifications; i++) {
      const modifications: Modification[] = []

      const originalId = input.readChars(4)
      const customId = input.readChars(4)
      let sets: number
      if (formatVersion >= 3) {
        sets = input.readInt()
      } else {
        sets = 1
      }

      for (let j = 0; j < sets; j++) {
        if (formatVersion >= 3) {
          input.readInt() // SetFlag unused in editor, who knows. (Variant in WE)
        }
        const modificationCount = input.readInt()
        for (let k = 0; k < modificationCount; k++) {
          const fieldId = input.readChars(4)
          const fieldTypeValue = input.readInt()

          let useExtraData: boolean
          switch (objectType) {
            case ObjectType.Abilities:
            case ObjectType.Upgrades:
              useExtraData = true
              break
            case ObjectType.Doodads:
              useExtraData = formatVersion > 0x01
              break
            default:
              useExtraData = false
              break
          }

          let levelVariant: integer
          let dataPointer: integer
          if (useExtraData) {
            levelVariant = input.readInt()
            dataPointer = input.readInt()
          } else {
            levelVariant = -1
            dataPointer = -1
          }

          let fieldType: ModificationType
          let fieldValue: integer | string
          switch (fieldTypeValue) {
            case 0:
              fieldType = ModificationType.INTEGER
              fieldValue = input.readInt()
              break
            case 1:
              fieldType = ModificationType.REAL
              fieldValue = input.readFloat()
              break
            case 2:
              fieldType = ModificationType.UNREAL
              fieldValue = input.readFloat()
              break
            case 3:
              fieldType = ModificationType.STRING
              fieldValue = input.readString()
              break
            default:
              throw new Error(`Unknown object modification type ${fieldTypeValue} for '${originalId}'->'${fieldId}'`)
          }

          if (formatVersion > 0x00) {
            input.readChars(4) // ObjectID, again
          }

          modifications.push({
            id            : fieldId,
            type          : fieldType,
            value         : fieldValue,
            levelVariation: levelVariant,
            dataPointer
          })
        }
      }

      const objectKey = (customId === ModificationDefaults.customId) ? originalId : customId
      modificationTable[objectKey] = { originalId, modifications }
    }
    return modificationTable
  }

  const original = readModificationTable(input, objectType, formatVersion)
  let custom: Record<string, ObjectData>
  if (!input.isExhausted()) {
    custom = readModificationTable(input, objectType, formatVersion)
  } else {
    custom = ObjectModificationTableDefaults.custom
  }

  return [{ original, custom }, formatVersion]
}