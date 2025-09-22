import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type WarResult, type JsonResult, type integer } from '../CommonInterfaces'
import { type Translator } from './Translator'
import { SoundChannel, SoundEnvironment, type Sound } from '../data/Sound'
import { LoggerFactory } from '../../logging/LoggerFactory'

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

export class SoundsTranslator implements Translator<Sound[]> {
  private static instance: SoundsTranslator

  private constructor () {}

  public static getInstance (): SoundsTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (sounds: Sound[], version: [integer, integer]): WarResult {
    return this.getInstance().jsonToWar(sounds, version)
  }

  public static warToJson (buffer: Buffer): JsonResult<Sound[]> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar (soundsJson: Sound[], [fileVersion, _]: [integer, integer]): WarResult {
    const errors: Error[] = []
    const output = new HexBuffer()

    if (fileVersion > 3 || fileVersion < 1) {
      throw new Error(`Unknown sound file format version ${fileVersion}`)
    }

    output.addInt(fileVersion)
    output.addInt(soundsJson.length ?? 0)
    soundsJson?.forEach((sound) => {
      let flagsValue = 0
      if (sound.flags != null) {
        if (sound.flags.looping) flagsValue |= 0x01
        if (sound.flags['3dSound']) flagsValue |= 0x02
        if (sound.flags.stopOutOfRange) flagsValue |= 0x04
        if (sound.flags.music) flagsValue |= 0x08
        if (sound.flags.customImported) flagsValue |= 0x10
      }

      output.addString(sound.name) // e.g. gg_snd_HumanGlueScreenLoop1
      output.addString(sound.path) // e.g. Sound\Ambient\HumanGlueScreenLoop1.wav
      output.addString(sound.eax ?? SoundEnvironment.DEFAULT)
      output.addInt(flagsValue)
      output.addInt(sound.fadeRate?.in ?? 0)
      output.addInt(sound.fadeRate?.out ?? 0)
      output.addInt(sound.volume ?? 105)
      output.addFloat(sound.pitch ?? 1.0)
      output.addFloat(sound.pitchVariance ?? 1.0)
      output.addInt(sound.priority ?? 10)
      output.addInt(soundChannelEnumReverse[sound.channel ?? SoundChannel.GENERAL])
      output.addFloat(sound['3d']?.distance?.min ?? 0xFFFFFFFF) // UINTMAX as default
      output.addFloat(sound['3d']?.distance?.max ?? 0xFFFFFFFF) // UINTMAX as default
      output.addFloat(sound['3d']?.distance?.cutoff ?? 10000.0)
      output.addFloat(sound['3d']?.cone?.insideAngle ?? 0xFFFFFFFF) // UINTMAX as default
      output.addFloat(sound['3d']?.cone?.outsideAngle ?? 0xFFFFFFFF) // UINTMAX as default
      output.addInt(sound['3d']?.cone?.outsideVolume ?? 0xFFFFFFFF) // UINTMAX as default
      output.addFloat(sound['3d']?.cone?.orientation?.at(0) ?? 0xFFFFFFFF) // UINTMAX as default
      output.addFloat(sound['3d']?.cone?.orientation?.at(1) ?? 0xFFFFFFFF) // UINTMAX as default
      output.addFloat(sound['3d']?.cone?.orientation?.at(2) ?? 0xFFFFFFFF) // UINTMAX as default

      if (fileVersion > 1) {
        const assetFlags = sound.assetFlags ?? 0

        output.addString(sound.name)
        output.addString(sound.labelSLK ?? '')
        output.addString(sound.path)
        output.addInt(sound.dialogueId ?? 0xFFFFFFFF)
        output.addString(sound.productionComments ?? '')
        output.addInt(sound.speakerNameId ?? 0xFFFFFFFF)
        output.addString(sound.listenerName ?? '')
        output.addByte(assetFlags & 0x00FF0000)
        output.addByte(assetFlags & 0x0000FF00)
        output.addByte(assetFlags & 0x000000FF)
        output.addString(sound.speakerUnitId ?? '')
        output.addString(sound.animationLabel ?? '')
        output.addString(sound.animationGroup ?? '')
        output.addString(sound.animationSetFilepath ?? '')

        if (fileVersion > 2) {
          output.addByte(sound.animationSetFilepath ? 1 : 0)
          output.addInt(sound.unknown)
        }
      }
    })

    return {
      errors,
      buffer: output.getBuffer()
    }
  }

  public warToJson (buffer: Buffer): JsonResult<Sound[]> {
    const errors: Error[] = []
    const result: Sound[] = []
    const input = new W3Buffer(buffer)

    const fileVersion = input.readInt() // File version
    if (fileVersion > 3) {
      log.warn(`Unsupported sound file format version ${fileVersion}, will attempt at parsing...`)
    }

    const numSounds = input.readInt() // # of sounds
    for (let i = 0; i < numSounds; i++) {
      let name = input.readString()
      let path = input.readString()
      let eax = input.readString() as SoundEnvironment
      const flagsValue = input.readInt()
      const fadeInRate = input.readInt()
      const fadeOutRate = input.readInt()
      // WE stores this as integer but casts as float internally, but the sound editor input and game API accepts only integers...
      const volume = input.readInt()
      const pitch = input.readInt()
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
      let unknown = 1

      if (fileVersion > 1) {
        name = input.readString()
        labelSLK = input.readString()
        path = input.readString()
        dialogueId = input.readInt()
        productionComments = input.readString()
        speakerNameId = input.readInt()
        listenerName = input.readString()
        assetFlags = (input.readByte() << 16) | (input.readByte() << 8) | input.readByte()
        speakerUnitId = input.readString()
        animationLabel = input.readString()
        animationGroup = input.readString()
        animationSetFilepath = input.readString()

        if (fileVersion > 2) {
          // Note: This field is true for older file formats, but editor generates sounds with this field as false by default
          animationSetFilepathIsMapRelative = !!input.readByte()
          unknown = input.readInt()// default value 1?
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
        animationSetFilepathIsMapRelative,
        unknown
      }
    }

    return {
      errors,
      json: result
    }
  }
}
