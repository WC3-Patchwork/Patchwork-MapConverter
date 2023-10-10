import { Service } from 'typedi'
import { type Sound } from '../../../data/editor/sound/Sound'
import { type HexBuffer } from '../../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../../BinaryTranslationResult'
import { type JsonToBinaryConverter } from '../../JsonToBinaryConverter'

@Service()
export class SoundBinaryAssembler implements JsonToBinaryConverter<Sound[]> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length > 1 && metadata[0] === 3
  }

  public translate (outBufferToWar: HexBuffer, data: Sound[], ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors = new Array<Error>()
    const warnings = new Array<Error>()

    /*
    * Header
    */
    outBufferToWar.addInt(3) // file version
    outBufferToWar.addInt(data.length) // number of sounds

    /*
    * Body
    */
    data.forEach((sound) => {
      outBufferToWar.addString(sound.name) // e.g. gg_snd_HumanGlueScreenLoop1
      outBufferToWar.addString(sound.path) // e.g. Sound\Ambient\HumanGlueScreenLoop1.wav
      outBufferToWar.addString(sound.eax.name) // defaults to "DefaultEAXON"

      // Flags, if present (optional)
      let flags = 0
      if (sound.flags != null) {
        if (sound.flags.looping) flags |= 0x1
        if (sound.flags['3dSound']) flags |= 0x2
        if (sound.flags.stopOutOfRange) flags |= 0x4
        if (sound.flags.music) flags |= 0x8
      }
      outBufferToWar.addInt(flags)

      // Fade in and out rate (optional)
      outBufferToWar.addInt(sound.fadeRate != null ? sound.fadeRate.in != null ? sound.fadeRate.in : 10 : 10) // default to 10
      outBufferToWar.addInt(sound.fadeRate != null ? sound.fadeRate.out != null ? sound.fadeRate.out : 10 : 10) // default to 10

      // Volume (optional)
      outBufferToWar.addInt(sound.volume != null ? sound.volume : -1) // default to -1 (for normal volume)

      // Pitch (optional)
      outBufferToWar.addFloat(sound.pitch != null ? sound.pitch : 1.0) // default to 1.0 for normal pitch

      // Mystery numbers... their use is unknown by the w3x documentation, but they must be present
      outBufferToWar.addFloat(0)
      outBufferToWar.addInt(8) // or -1?
      outBufferToWar.addInt(sound.channel.value) // default to 0

      // Distance fields
      outBufferToWar.addFloat(sound.distance.min)
      outBufferToWar.addFloat(sound.distance.max)
      outBufferToWar.addFloat(sound.distance.cutoff)

      // More mystery numbers...
      outBufferToWar.addFloat(0)
      outBufferToWar.addFloat(0)
      outBufferToWar.addFloat(127) // or -1?
      outBufferToWar.addFloat(0)
      outBufferToWar.addFloat(0)
      outBufferToWar.addFloat(0)

      outBufferToWar.addString(sound.variableName)
      outBufferToWar.addString('')
      outBufferToWar.addString(sound.path)

      // More unknowns
      outBufferToWar.addFloat(0)
      outBufferToWar.addByte(0)
      outBufferToWar.addFloat(0)
      outBufferToWar.addFloat(0)
      outBufferToWar.addFloat(0)
      outBufferToWar.addByte(0)
      outBufferToWar.addFloat(0)
    })

    return {
      errors,
      warnings
    }
  }
}
