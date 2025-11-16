import { type vector3, type integer } from '../CommonInterfaces'

interface Sound {
  name: string
  path: string
  eax: SoundEnvironment
  flags: SoundFlags
  fadeRate: FadeRate
  volume: integer
  pitch: number
  pitchVariance: number
  priority: integer
  channel: SoundChannel
  '3d': ThreeDSound
  labelSLK: string
  dialogueId: integer
  productionComments: string
  speakerNameId: integer
  listenerName: string
  assetFlags: integer // TODO: map asset flags
  speakerUnitId: string
  animationLabel: string
  animationGroup: string
  animationSetFilepath: string
  animationSetFilepathIsMapRelative: boolean
}

interface FadeRate {
  in: number
  out: number
}

interface SoundFlags {
  looping: boolean
  '3dSound': boolean
  stopOutOfRange: boolean
  music: boolean
  customImported: boolean
}

interface ThreeDSound {
  distance: Distance
  cone: Cone
}

interface Distance {
  min: number
  max: number
  cutoff: number
}

interface Cone {
  insideAngle: number
  outsideAngle: number
  outsideVolume: integer
  orientation: vector3
}

enum SoundEnvironment {
  DEFAULT = 'DefaultEAXON',
  COMBAT = 'CombatSoundsEAX',
  DRUMS = 'KotoDrumsEAX',
  SPELLS = 'SpellsEAX',
  MISSILES = 'MissilesEAX',
  HERO_SPEECH = 'HeroAcksEAX',
  DOODADS = 'DoodadsEAX'
}

enum SoundChannel {
  GENERAL = 'GENERAL',
  UNIT_SELECTION = 'UNIT_SELECTION',
  UNIT_ACKNOWLEDGEMENT = 'UNIT_ACKNOWLEDGEMENT',
  UNIT_MOVEMENT = 'UNIT_MOVEMENT',
  UNIT_READY = 'UNIT_READY',
  COMBAT = 'COMBAT',
  ERROR = 'ERROR',
  MUSIC = 'MUSIC',
  USER_INTERFACE = 'USER_INTERFACE',
  LOOPING_MOVEMENT = 'LOOPING_MOVEMENT',
  LOOPING_AMBIENT = 'LOOPING_AMBIENT',
  ANIMATIONS = 'ANIMATIONS',
  CONSTRUCTIONS = 'CONSTRUCTIONS',
  BIRTH = 'BIRTH',
  FIRE = 'FIRE',
  LEGACY_MIDI = 'Legacy Midi',
  CINEMATIC_GENERAL = 'Cinematic General',
  CINEMATIC_AMBIENT = 'Cinematic Ambient',
  CINEMATIC_MUSIC = 'Cinematic Music',
  CINEMATIC_DIALOGUE = 'Cinematic Dialogue',
  CINEMATIC_SFX1 = 'Cinematic SFX 1',
  CINEMATIC_SFX2 = 'Cinematic SFX 2',
  CINEMATIC_SFX3 = 'Cinematic SFX 3',
}

export type { Sound, FadeRate, SoundFlags, Distance }
export { SoundChannel, SoundEnvironment }
