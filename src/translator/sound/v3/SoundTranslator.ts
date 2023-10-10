import { Service } from 'typedi'
import { type Sound } from '../../../data/editor/sound/Sound'
import { type VersionedBinaryToJsonConverter } from '../../VersionedBinaryToJsonConverter'
import { W3Buffer } from '../../W3Buffer'
import { type integer } from '../../../data/editor/common/DataTypes'
import { SoundBuilder } from '../../../data/editor/sound/SoundBuilder'
import { PropertyFlags } from '../../../data/editor/common/PropertyFlag'
import { SoundEAX } from '../../../data/editor/sound/SoundEAX'
import { SoundChannel } from '../../../data/editor/sound/SoundChannel'

@Service()
export class SoundTranslator implements VersionedBinaryToJsonConverter<Sound[]> {
  private readonly expectedFormatVersion: integer = 3

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    const formatVersion = w3Buffer.readInt()
    return this.canTranslateFor(formatVersion)
  }

  public translate (buffer: Buffer): JSONTranslationResult<Sound[]> {
    const resultObject: JSONTranslationResult<Sound[]> = {
      result: [],
      errors: [],
      warnings: []
    }
    const outBufferToJSON = new W3Buffer(buffer)

    const fileVersion = outBufferToJSON.readInt() // File version
    if (!this.canTranslateFor(fileVersion)) {
      resultObject.warnings.push((
        new Error(`Attempting to translate with translator not intended for following data: 
                fileVersion: ${fileVersion}\t\tExpected: ${this.expectedFormatVersion}`)))
    }

    const numSounds = outBufferToJSON.readInt() // # of sounds
    for (let i = 0; i < numSounds; i++) {
      // name, path
      const sound = new SoundBuilder(outBufferToJSON.readString(), outBufferToJSON.readString())
      sound.eax = SoundEAX.fromName(outBufferToJSON.readString())
      const flags = new PropertyFlags(outBufferToJSON.readInt())
      sound.flags = {
        looping: flags.readFlag(0b1), // 0x00000001=looping
        '3dSound': flags.readFlag(0b10), // 0x00000002=3D sound
        stopOutOfRange: flags.readFlag(0b100), // 0x00000004=stop when out of range
        music: flags.readFlag(0b1000) // 0x00000008=music
      }

      sound.fadeRate = {
        in: outBufferToJSON.readInt(),
        out: outBufferToJSON.readInt()
      }

      sound.volume = outBufferToJSON.readInt()
      sound.pitch = outBufferToJSON.readFloat()

      // Unknown values
      outBufferToJSON.readFloat()
      outBufferToJSON.readInt()

      sound.channel = SoundChannel.fromValue(outBufferToJSON.readInt())

      sound.distance = {
        min: outBufferToJSON.readFloat(),
        max: outBufferToJSON.readFloat(),
        cutoff: outBufferToJSON.readFloat()
      }

      // Unknown values
      outBufferToJSON.readFloat()
      outBufferToJSON.readFloat()
      outBufferToJSON.readFloat()
      outBufferToJSON.readFloat()
      outBufferToJSON.readFloat()
      outBufferToJSON.readFloat()

      sound.variableName = outBufferToJSON.readString()

      // Unknown values
      outBufferToJSON.readString()
      outBufferToJSON.readString()
      outBufferToJSON.readChars(4)
      outBufferToJSON.readChars(1)
      outBufferToJSON.readChars(4)
      outBufferToJSON.readChars(4)
      outBufferToJSON.readChars(4)
      outBufferToJSON.readChars(1)
      outBufferToJSON.readChars(4)

      resultObject.result.push(sound)
    }

    return resultObject
  }

  private canTranslateFor (formatVersion: integer): boolean {
    return formatVersion === this.expectedFormatVersion
  }
}
