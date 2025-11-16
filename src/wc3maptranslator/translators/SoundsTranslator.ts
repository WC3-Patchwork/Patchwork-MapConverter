import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type integer } from '../CommonInterfaces'
import { SoundChannel, SoundEnvironment, type Sound } from '../data/Sound'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { SoundDefaults } from '../default/Sound'

const log = LoggerFactory.createLogger('SoundsTranslator')

const soundChannelEnum = {
  0: SoundChannel.GENERAL,
  1: SoundChannel.UNIT_SELECTION,
  2: SoundChannel.UNIT_ACKNOWLEDGEMENT,
  3: SoundChannel.UNIT_MOVEMENT,
  4: SoundChannel.UNIT_READY,
  5: SoundChannel.COMBAT,
  6: SoundChannel.ERROR,
  7: SoundChannel.MUSIC,
  8: SoundChannel.USER_INTERFACE,
  9: SoundChannel.LOOPING_MOVEMENT,
  10: SoundChannel.LOOPING_AMBIENT,
  11: SoundChannel.ANIMATIONS,
  12: SoundChannel.CONSTRUCTIONS,
  13: SoundChannel.BIRTH,
  14: SoundChannel.FIRE,
  15: SoundChannel.LEGACY_MIDI,
  16: SoundChannel.CINEMATIC_GENERAL,
  17: SoundChannel.CINEMATIC_AMBIENT,
  18: SoundChannel.CINEMATIC_MUSIC,
  19: SoundChannel.CINEMATIC_DIALOGUE,
  20: SoundChannel.CINEMATIC_SFX1,
  21: SoundChannel.CINEMATIC_SFX2,
  22: SoundChannel.CINEMATIC_SFX3,
  0xFFFFFFFF: SoundChannel.GENERAL // this key takes priority in reverse
}
const soundChannelEnumReverse = Object.entries(soundChannelEnum).reduce((acc, it) => {
  acc[it[1]] = it[0]
  return acc
}, {}) as Record<string, integer>

export function jsonToWar (soundsJson: Sound[], formatVersion: integer): Buffer {
  if (formatVersion > 3 || formatVersion < 1) {
    throw new Error(`Unknown sounds format version ${formatVersion}`)
  }
  const output = new HexBuffer()
  output.addInt(formatVersion)
  output.addInt(soundsJson.length ?? 0)
  soundsJson?.forEach((sound) => {
    let flagsValue = 0
    const flags = sound.flags ?? SoundDefaults.flags
    if (flags.looping) flagsValue |= 0x01
    if (flags['3dSound']) flagsValue |= 0x02
    if (flags.stopOutOfRange) flagsValue |= 0x04
    if (flags.music) flagsValue |= 0x08
    if (flags.customImported) flagsValue |= 0x10

    output.addString(sound.name) // e.g. gg_snd_HumanGlueScreenLoop1
    output.addString(sound.path) // e.g. Sound\Ambient\HumanGlueScreenLoop1.wav
    output.addString(sound.eax ?? SoundDefaults.eax)
    output.addInt(flagsValue)
    output.addInt(sound.fadeRate?.in ?? SoundDefaults.fadeRate.in)
    output.addInt(sound.fadeRate?.out ?? SoundDefaults.fadeRate.out)
    output.addInt(sound.volume ?? SoundDefaults.volume)
    output.addFloat(sound.pitch ?? SoundDefaults.pitch)
    output.addFloat(sound.pitchVariance ?? SoundDefaults.pitchVariance)
    output.addInt(sound.priority ?? SoundDefaults.priority)
    output.addInt(soundChannelEnumReverse[sound.channel ?? SoundDefaults.channel])
    output.addFloat(sound['3d']?.distance?.min ?? SoundDefaults['3d'].distance.min)
    output.addFloat(sound['3d']?.distance?.max ?? SoundDefaults['3d'].distance.max)
    output.addFloat(sound['3d']?.distance?.cutoff ?? SoundDefaults['3d'].distance.cutoff)
    output.addFloat(sound['3d']?.cone?.insideAngle ?? SoundDefaults['3d'].cone.insideAngle)
    output.addFloat(sound['3d']?.cone?.outsideAngle ?? SoundDefaults['3d'].cone.outsideAngle)
    output.addInt(sound['3d']?.cone?.outsideVolume ?? SoundDefaults['3d'].cone.outsideVolume)
    output.addFloat(sound['3d']?.cone?.orientation?.at(0) ?? SoundDefaults['3d'].cone.orientation[0])
    output.addFloat(sound['3d']?.cone?.orientation?.at(1) ?? SoundDefaults['3d'].cone.orientation[1])
    output.addFloat(sound['3d']?.cone?.orientation?.at(2) ?? SoundDefaults['3d'].cone.orientation[2])

    if (formatVersion > 1) {
      const assetFlags = sound.assetFlags ?? 0

      output.addString(sound.name)
      output.addString(sound.labelSLK ?? SoundDefaults.labelSLK)
      output.addString(sound.path)
      output.addInt(sound.dialogueId ?? SoundDefaults.dialogueId)
      output.addString(sound.productionComments ?? SoundDefaults.productionComments)
      output.addInt(sound.speakerNameId ?? SoundDefaults.speakerNameId)
      output.addString(sound.listenerName ?? SoundDefaults.listenerName)
      output.addInt(assetFlags)
      output.addString(sound.speakerUnitId ?? SoundDefaults.speakerUnitId)
      output.addString(sound.animationLabel ?? SoundDefaults.animationLabel)
      output.addString(sound.animationGroup ?? SoundDefaults.animationGroup)
      output.addString(sound.animationSetFilepath ?? SoundDefaults.animationSetFilepath)

      if (formatVersion > 2) {
        output.addInt(+(sound.animationSetFilepathIsMapRelative ?? SoundDefaults.animationSetFilepathIsMapRelative))
      }
    }
  })

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): [Sound[], integer] {
  const result: Sound[] = []
  const input = new W3Buffer(buffer)
  const formatVersion = input.readInt()
  if (formatVersion > 3) {
    log.warn(`Unsupported sounds format version ${formatVersion}, will attempt at parsing...`)
  } else {
    log.info(`Sounds format version is ${formatVersion}.`)
  }

  const soundCount = input.readInt()
  for (let i = 0; i < soundCount; i++) {
    let name = input.readString()
    let path = input.readString()
    let eax = input.readString() as SoundEnvironment
    const flagsValue = input.readInt()
    const fadeInRate = input.readInt()
    const fadeOutRate = input.readInt()
    // WE stores this as integer but casts as float internally, but the sound editor input and game API accepts only integers...
    const volume = input.readInt()
    const pitch = input.readFloat()
    const pitchVariance = input.readFloat()
    const priority = input.readInt()
    const channelValue = input.readInt()
    const distanceMin = input.readFloat()
    const distanceMax = input.readFloat()
    const distanceCutoff = input.readFloat()
    const coneInsideAngle = input.readFloat()
    const coneOutsideAngle = input.readFloat()
    const coneOutsideVolume = input.readInt()
    const coneOrientationX = input.readFloat()
    const coneOrientationY = input.readFloat()
    const coneOrientationZ = input.readFloat()
    let channel = soundChannelEnum[channelValue] as SoundChannel

    let labelSLK = ''
    let dialogueId = 0xFFFFFFFF
    let productionComments = ''
    let speakerNameId = 0xFFFFFFFF
    let listenerName = ''
    let assetFlags = 0
    let speakerUnitId = ''
    let animationLabel = ''
    let animationGroup = ''
    let animationSetFilepath = ''
    let animationSetFilepathIsMapRelative = true

    if (formatVersion > 1) {
      name = input.readString()
      labelSLK = input.readString()
      path = input.readString()
      dialogueId = input.readInt()
      productionComments = input.readString()
      speakerNameId = input.readInt()
      listenerName = input.readString()
      assetFlags = input.readInt()
      speakerUnitId = input.readString()
      animationLabel = input.readString()
      animationGroup = input.readString()
      animationSetFilepath = input.readString()

      if (formatVersion > 2) {
        // Note: This field is true for older file formats, but editor generates sounds with this field as false by default
        animationSetFilepathIsMapRelative = !!input.readInt()
      }
    }

    if (Object.keys(SoundEnvironment).findIndex(it => it === eax) === -1) {
      log.warn(`EAX value='${eax}' is not valid for sound '${name}', defaulting to DEFAULT`)
      eax = SoundEnvironment.DEFAULT
    }

    const flags = {
      looping: !!(flagsValue & 0x01),
      '3dSound': !!(flagsValue & 0x02),
      stopOutOfRange: !!(flagsValue & 0x04),
      music: !!(flagsValue & 0x08),
      customImported: !!(flagsValue & 0x10)
    }

    if (channel == null) {
      log.warn(`Channel id=${channelValue} is not valid for sound '${name}'. Defaulting to GENERAL.`)
      channel = SoundChannel.GENERAL
    }

    result[i] = {
      name,
      path,
      eax,
      flags,
      fadeRate: { in: fadeInRate, out: fadeOutRate },
      volume,
      pitch,
      pitchVariance,
      priority,
      channel,
      '3d': {
        distance: { min: distanceMin, max: distanceMax, cutoff: distanceCutoff },
        cone: {
          insideAngle: coneInsideAngle,
          outsideAngle: coneOutsideAngle,
          outsideVolume: coneOutsideVolume,
          orientation: [coneOrientationX, coneOrientationY, coneOrientationZ]
        }
      },
      labelSLK,
      dialogueId,
      productionComments,
      speakerNameId,
      listenerName,
      assetFlags,
      speakerUnitId,
      animationLabel,
      animationGroup,
      animationSetFilepath,
      animationSetFilepathIsMapRelative
    }
  }

  return [result, formatVersion]
}
