import { color, integer } from "@/wc3maptranslator/CommonInterfaces";
import { BackgroundScreenVersion, CampaignInfo, CampaignMap, CursorRace } from "./data/campaign/CampaignInfo";
import { LoggerFactory } from "@/logging/LoggerFactory";
import { HexBuffer, W3Buffer } from "@/wc3maptranslator";
import { FogType } from "@/wc3maptranslator/data";
import { colorBytesToHex, colorHexToBytes, mergeBoolRecords } from "@/wc3maptranslator/Util";
import { CampaignInfoDefaults } from "./default/CampaignInfo"

const log = LoggerFactory.createLogger('InfoTranslator')

export function jsonToWar(campaignInfoJson: CampaignInfo, formatVersion: number): Buffer {
  if (formatVersion < 0 || formatVersion > 3) {
    throw new Error(`Unknown campaign info format version=${formatVersion}, expected value from range [0, 3]`)
  }

  const output = new HexBuffer()
  output.addInt(formatVersion)
  output.addInt(campaignInfoJson.campaignVersion)
  output.addInt(campaignInfoJson.editorVersion)

  output.addString(campaignInfoJson.name)
  output.addString(campaignInfoJson.difficulty)
  output.addString(campaignInfoJson.author)
  output.addString(campaignInfoJson.description)

  const flags = mergeBoolRecords(campaignInfoJson.flags, CampaignInfoDefaults.flags)
  let flagsValue = 0
  if (flags.variableDifficulty) flagsValue |= 0x01
  if (flags.expansion) flagsValue |= 0x02
  output.addInt(flagsValue)

  output.addInt(campaignInfoJson.backgroundScreenIndex)
  output.addString(campaignInfoJson.backgroundScreenPath)
  output.addString(campaignInfoJson.minimapPicturePath)
  output.addInt(campaignInfoJson.ambientSoundIndex)
  output.addString(campaignInfoJson.customAmbientSoundPath)

  if (formatVersion >= 1) {
    output.addInt(((fogType: FogType) => {
      switch (fogType) {
        case FogType.LINEAR: return 0
        case FogType.EXPONENTIAL1: return 1
        case FogType.EXPONENTIAL2: return 2
        case FogType.NEW_EXPONENTIAL1: return 3
        case FogType.NEW_EXPONENTIAL2: return 4
        case FogType.HEIGHT: return 5
        default: return 1
      }
    })(campaignInfoJson?.fog?.type ?? CampaignInfoDefaults.fog.type))
    output.addFloat(campaignInfoJson?.fog?.startHeight ?? CampaignInfoDefaults.fog.zStart)
    output.addFloat(campaignInfoJson?.fog?.endHeight ?? CampaignInfoDefaults.fog.zEnd)
    output.addFloat(campaignInfoJson?.fog?.density ?? CampaignInfoDefaults.fog.density)
    colorHexToBytes(campaignInfoJson?.fog?.color ?? CampaignInfoDefaults.fog.color).forEach((it) => {
      output.addByte(it)
    })
    output.addInt(((value) => {
      switch (value) {
        case CursorRace.HUMAN: return 0
        case CursorRace.ORC: return 1
        case CursorRace.UNDEAD: return 2
        case CursorRace.NIGHT_ELF: return 3
        case CursorRace.FORSAKEN: return 4
      }
    })(campaignInfoJson.cursorRace ?? CampaignInfoDefaults.cursorRace))

    if (formatVersion >= 3) {
      output.addFloat(campaignInfoJson?.fog?.newHeightStart ?? CampaignInfoDefaults.fog.heightStart)
      output.addFloat(campaignInfoJson?.fog?.newHeightEnd ?? CampaignInfoDefaults.fog.heightEnd)
      output.addFloat(campaignInfoJson?.fog?.newLinearStart ?? CampaignInfoDefaults.fog.linearStart)
      output.addFloat(campaignInfoJson?.fog?.newLinearEnd ?? CampaignInfoDefaults.fog.linearEnd)
      output.addFloat(campaignInfoJson?.fog?.maxOpacity ?? CampaignInfoDefaults.fog.maxOpacity)
      output.addInt(+(campaignInfoJson?.fog?.drawFogOverSky ?? CampaignInfoDefaults.fog.drawOverSky))
      output.addInt(((value) => {
        switch (value) {
          case BackgroundScreenVersion.DEFAULT: return 0
          case BackgroundScreenVersion.CLASSIC: return 1
          case BackgroundScreenVersion.REFORGED: return 2
        }
      })(campaignInfoJson.backgroundScreenVersion ?? CampaignInfoDefaults.backgroundScreenVersion))
    }
  }

  const maps = campaignInfoJson.maps ?? []
  output.addInt(maps.length)
  for (const map of maps) {
    const mapFlags = mergeBoolRecords(map.flags, CampaignInfoDefaults.map.flags)
    let flags = 0
    if (mapFlags.visible) flags |= 0x01
    if (mapFlags.cinematic) flags |= 0x02
    output.addInt(flags)

    output.addString(map.chapterTitle)
    output.addString(map.mapTitle)
    output.addString(map.path)
  }
  output.addInt(maps.length)
  for (const map of maps) {
    output.addByte(0)
    output.addString(map.path)
  }

  return output.getBuffer()
}

export function warToJson(buffer: Buffer): [CampaignInfo, integer, integer] {
  const input = new W3Buffer(buffer)
  const formatVersion = input.readInt()
  if (formatVersion < 0 || formatVersion > 3) {
    log.warn(`Unknown campaign info format version ${formatVersion} will attempt at reading...`)
  } else {
    log.info(`Info format version is ${formatVersion}.`)
  }

  const campaignVersion = input.readInt()
  const editorVersion = input.readInt()

  const name = input.readString()
  const difficulty = input.readString()
  const author = input.readString()
  const description = input.readString()

  const flagsValue = input.readInt()

  const backgroundScreenIndex = input.readInt()
  const backgroundScreenPath = input.readString()
  const minimapPicturePath = input.readString()
  const ambientSoundIndex = input.readInt()
  const customAmbientSoundPath = input.readString()

  let fogType: FogType
  let fogZStart: number
  let fogZEnd: number
  let fogDensity: number
  let fogColor: color
  let cursorRace: CursorRace
  let fogHeightStart: number
  let fogHeightEnd: number
  let fogLinearStart: number
  let fogLinearEnd: number
  let fogMaxOpacity: number
  let fogDrawOverSky: boolean
  let backgroundScreenVersion: BackgroundScreenVersion
  if (formatVersion >= 1) {
    fogType = ((type) => {
      switch (type) {
        case 0: return FogType.LINEAR
        case 1: return FogType.EXPONENTIAL1
        case 2: return FogType.EXPONENTIAL2
        case 3: return FogType.NEW_EXPONENTIAL1
        case 4: return FogType.NEW_EXPONENTIAL2
        case 5: return FogType.HEIGHT
        default: return FogType.LINEAR
      }
    })(input.readInt())
    fogZStart = input.readFloat()
    fogZEnd = input.readFloat()
    fogDensity = input.readFloat()
    fogColor = colorBytesToHex(input.readByte(), input.readByte(), input.readByte(), input.readByte())
    cursorRace = ((race) => {
      switch (race) {
        case 0: return CursorRace.HUMAN
        case 1: return CursorRace.ORC
        case 2: return CursorRace.UNDEAD
        case 3: return CursorRace.NIGHT_ELF
        case 4: return CursorRace.FORSAKEN
        default: return CampaignInfoDefaults.cursorRace
      }
    })(input.readInt());
    if (formatVersion >= 3) {
      fogHeightStart = input.readFloat()
      fogHeightEnd = input.readFloat()
      fogLinearStart = input.readFloat()
      fogLinearEnd = input.readFloat()
      fogMaxOpacity = input.readFloat()
      fogDrawOverSky = !!(input.readInt())
      backgroundScreenVersion = ((value) => {
        switch (value) {
          case 0: return BackgroundScreenVersion.DEFAULT
          case 1: return BackgroundScreenVersion.CLASSIC
          case 2: return BackgroundScreenVersion.REFORGED
          default: return CampaignInfoDefaults.backgroundScreenVersion
        }
      })(input.readInt());
    } else {
      fogHeightStart = CampaignInfoDefaults.fog.heightStart
      fogHeightEnd = CampaignInfoDefaults.fog.heightEnd
      fogLinearStart = CampaignInfoDefaults.fog.linearStart
      fogLinearEnd = CampaignInfoDefaults.fog.linearEnd
      fogMaxOpacity = CampaignInfoDefaults.fog.maxOpacity
      fogDrawOverSky = CampaignInfoDefaults.fog.drawOverSky
      backgroundScreenVersion = CampaignInfoDefaults.backgroundScreenVersion
    }
  } else {
    fogType = CampaignInfoDefaults.fog.type
    fogZStart = CampaignInfoDefaults.fog.zStart
    fogZEnd = CampaignInfoDefaults.fog.zEnd
    fogDensity = CampaignInfoDefaults.fog.density
    fogColor = CampaignInfoDefaults.fog.color
    cursorRace = CampaignInfoDefaults.cursorRace
    fogHeightStart = CampaignInfoDefaults.fog.heightStart
    fogHeightEnd = CampaignInfoDefaults.fog.heightEnd
    fogLinearStart = CampaignInfoDefaults.fog.linearStart
    fogLinearEnd = CampaignInfoDefaults.fog.linearEnd
    fogMaxOpacity = CampaignInfoDefaults.fog.maxOpacity
    fogDrawOverSky = CampaignInfoDefaults.fog.drawOverSky
    backgroundScreenVersion = CampaignInfoDefaults.backgroundScreenVersion
  }

  const maps: CampaignMap[] = [];
  const mapCount = input.readInt()
  for (let i = 0; i < mapCount; i++) {
    const mapFlagsValue = input.readInt()
    const chapterTitle = input.readString()
    const mapTitle = input.readString()
    const path = input.readString()
    maps.push({
      flags: {
        visible: !!(mapFlagsValue & 0x01),
        cinematic: !!(mapFlagsValue & 0x02)
      },
      chapterTitle,
      mapTitle,
      path
    })
  }

  const orderCount = input.readInt()
  for (let i = 0; i < orderCount; i++) {
    input.readByte() //padding \0 byte
    input.readString() // map filepath
  }

  return [{
    campaignVersion,
    editorVersion,
    name,
    difficulty,
    author,
    description,
    flags: {
      variableDifficulty: !!(flagsValue & 0x01),
      expansion: !!(flagsValue & 0x02)
    },
    backgroundScreenIndex,
    backgroundScreenPath,
    minimapPicturePath,
    ambientSoundIndex,
    customAmbientSoundPath,
    fog: {
      type: fogType,
      startHeight: fogZStart,
      endHeight: fogZEnd,
      density: fogDensity,
      color: fogColor,
      newHeightStart: fogHeightStart,
      newHeightEnd: fogHeightEnd,
      newLinearStart: fogLinearStart,
      newLinearEnd: fogLinearEnd,
      maxOpacity: fogMaxOpacity,
      drawFogOverSky: fogDrawOverSky
    },
    backgroundScreenVersion,
    cursorRace,
    maps: maps
  }, formatVersion, editorVersion]
}