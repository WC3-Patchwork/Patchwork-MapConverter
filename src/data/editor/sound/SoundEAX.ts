export class SoundEAX {
  public static readonly DEFAULT = new SoundEAX('DefaultEAXON')
  public static readonly COMBAT = new SoundEAX('CombatSoundsEAX')
  public static readonly DRUMS = new SoundEAX('KotoDrumsEAX')
  public static readonly SPELLS = new SoundEAX('SpellsEAX')
  public static readonly MISSILES = new SoundEAX('MissilesEAX')
  public static readonly HERO_SPEECH = new SoundEAX('HeroAcksEAX')
  public static readonly DOODADS = new SoundEAX('DoodadsEAX')

  private static readonly values: Record<string, SoundEAX> = {
    DefaultEAXON: this.DEFAULT,
    CombatSoundsEAX: this.COMBAT,
    KotoDrumsEAX: this.DRUMS,
    SpellsEAX: this.SPELLS,
    MissilesEAX: this.MISSILES,
    HeroAcksEAX: this.HERO_SPEECH,
    DoodadsEAX: this.DOODADS
  }

  private constructor (public readonly name: string) {}

  public static fromName (name: string): SoundEAX {
    const enumerated = SoundEAX.values[name]
    if (enumerated == null) {
      throw new Error(`Unknown enum value '${name}'!`)
    }
    return enumerated
  }
}
