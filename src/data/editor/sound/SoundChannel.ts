import { type integer } from '../common/DataTypes'

export class SoundChannel {
  public static readonly GENERAL = new SoundChannel(0)
  public static readonly UNIT_SELECTION = new SoundChannel(1)
  public static readonly UNIT_ACKNOWLEDGEMENT = new SoundChannel(2)
  public static readonly UNIT_MOVEMENT = new SoundChannel(3)
  public static readonly UNIT_READY = new SoundChannel(4)
  public static readonly COMBAT = new SoundChannel(5)
  public static readonly ERROR = new SoundChannel(6)
  public static readonly MUSIC = new SoundChannel(7)
  public static readonly USER_INTERFACE = new SoundChannel(8)
  public static readonly LOOPING_MOVEMENT = new SoundChannel(9)
  public static readonly LOOPING_AMBIENT = new SoundChannel(10)
  public static readonly ANIMATIONS = new SoundChannel(11)
  public static readonly CONSTRUCTIONS = new SoundChannel(12)
  public static readonly BIRTH = new SoundChannel(13)
  public static readonly FIRE = new SoundChannel(14)

  private static readonly values: Record<integer, SoundChannel> = {
    0: this.GENERAL,
    1: this.UNIT_SELECTION,
    2: this.UNIT_ACKNOWLEDGEMENT,
    3: this.UNIT_MOVEMENT,
    4: this.UNIT_READY,
    5: this.COMBAT,
    6: this.ERROR,
    7: this.MUSIC,
    8: this.USER_INTERFACE,
    9: this.LOOPING_MOVEMENT,
    10: this.LOOPING_AMBIENT,
    11: this.ANIMATIONS,
    12: this.CONSTRUCTIONS,
    13: this.BIRTH,
    14: this.FIRE
  }

  private constructor (public readonly value: integer) {}

  public static fromValue (value: integer): SoundChannel {
    const enumerated = SoundChannel.values[value]
    if (enumerated == null) {
      throw new Error(`Unknown enum value '${value}'!`)
    }
    return enumerated
  }
}
