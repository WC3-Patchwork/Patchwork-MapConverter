import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type integer } from '../CommonInterfaces'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { WidgetGroup, WidgetGroups } from '../data/WidgetGroup'

const log = LoggerFactory.createLogger('WidgetGroupTranslator')

export function jsonToWar(widgetGroupsJson: WidgetGroups, formatVersion: integer): Buffer {
  if (formatVersion < 0 || formatVersion > 0) {
    throw new Error(`Unknown widget groups format version=${formatVersion}, expected value 0`)
  }
  const output = new HexBuffer()
  output.addInt(formatVersion)

  function writeGroup(groups: WidgetGroup[]){
    output.addInt(groups?.length ?? 0)
    for(const group of groups){
      output.addInt(group.groupId)
      output.addString(group.groupName)
    }
  }

  writeGroup(widgetGroupsJson.chunk1);
  writeGroup(widgetGroupsJson.chunk2);

  return output.getBuffer()
}

export function warToJson(buffer: Buffer): [WidgetGroups, integer] {
  const input = new W3Buffer(buffer)
  const formatVersion = input.readInt()
  if (formatVersion < 0 || formatVersion > 0) {
    log.warn(`Unknown widget groups format version ${formatVersion} will attempt at reading...`)
  } else {
    log.info(`Widget groups format version is ${formatVersion}.`)
  }

  function readGroup(): WidgetGroup[] {
    const groupCount = input.readInt()
    const result: WidgetGroup[] = []
    for (let i = 0; i < groupCount; i++) {
      const groupId = input.readInt()
      const groupName = input.readString()

      result[i] = {
        groupId,
        groupName
      }
    }
    return result;
  }

  const result: WidgetGroups = {
    chunk1: readGroup(),
    chunk2: readGroup()
  }
  return [result, formatVersion]
}