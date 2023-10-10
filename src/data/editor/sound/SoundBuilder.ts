import { type Distance, type FadeRate, type Sound, type SoundFlags } from './Sound'
import { SoundChannel } from './SoundChannel'
import { SoundEAX } from './SoundEAX'

export class SoundBuilder implements Sound {
  name: string
  path: string
  eax: SoundEAX = SoundEAX.DEFAULT
  flags: SoundFlags = { looping: true, '3dSound': true, stopOutOfRange: true, music: true }
  fadeRate: FadeRate = { in: 0, out: 0 }
  volume = 0
  pitch = 0
  channel: SoundChannel = SoundChannel.GENERAL
  distance: Distance = { min: 0, max: 0, cutoff: 0 }
  variableName = ''

  public constructor (name: string, path: string) {
    this.name = name
    this.path = path
  }
}
