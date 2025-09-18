interface Map {
  name: string
  author: string
  description: string
  recommendedPlayers: string
  playableArea: PlayableMapArea
  flags: MapFlags
  mainTileType: string
}

interface GameVersion {
  major: number
  minor: number
  patch: number
  build: number
}

interface PlayableCamera {
  bounds: number[]
  complements: number[]
}

interface MapFlags {
  hideMinimapInPreview: boolean // 0x0001: 1=hide minimap in preview screens
  modifyAllyPriorities: boolean // 0x0002: 1=modify ally priorities
  isMeleeMap: boolean // 0x0004: 1=melee map
  nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium: boolean // 0x0008: 1=playable map size was large and has never been reduced to medium (?)
  maskedPartiallyVisible: boolean // 0x0010: 1=masked area are partially visible
  fixedPlayerSetting: boolean // 0x0020: 1=fixed player setting for custom forces
  useCustomForces: boolean // 0x0040: 1=use custom forces
  useCustomTechtree: boolean // 0x0080: 1=use custom techtree
  useCustomAbilities: boolean // 0x0100: 1=use custom abilities
  useCustomUpgrades: boolean // 0x0200: 1=use custom upgrades
  mapPropertiesMenuOpenedAtLeastOnce: boolean // 0x0400: 1=map properties menu opened at least once since map creation (?)
  waterWavesOnCliffShores: boolean // 0x0800: 1=show water waves on cliff shores
  waterWavesOnRollingShores: boolean // 0x1000: 1=show water waves on rolling shores
  useTerrainFog: boolean// 0x2000: 1=yes
  tftRequired: boolean // 0x4000: 1=yes
  useItemClassificationSystem: boolean // 0x8000: 1=use item classification system
  enableWaterTinting: boolean // 0x10000
  useAccurateProbabilityForCalculations: boolean // 0x20000
  useCustomAbilitySkins: boolean // 0x40000
  disableDenyIcon: boolean // 0x80000
  forceDefaultCameraZoom: boolean // 0x100000
  forceMaxCameraZoom: boolean // 0x200000
  forceMinCameraZoom: boolean // 0x400000
}

interface LoadingScreen {
  background: number
  path: string
  text: string
  title: string
  subtitle: string
}

enum FogType {
  Linear = 0,
  Exponential1 = 1,
  Exponential2 = 2
}

interface Fog {
  type: FogType
  startHeight: number
  endHeight: number
  density: number
  color: number[] // R G B A
}

interface PlayableMapArea {
  width: number
  height: number
}

interface Prologue {
  path: string
  text: string
  title: string
  subtitle: string
}

interface Info {
  saves: number
  gameVersion: GameVersion
  editorVersion: number
  scriptLanguage: ScriptLanguage
  supportedModes: SupportedModes
  gameDataVersion: number
  forcedDefaultCamDistance: number
  forcedMaxCamDistance: number
  forcedMinCamDistance: number
  map: Map
  camera: PlayableCamera
  gameDataSet: number
  prologue: Prologue
  loadingScreen: LoadingScreen
  fog: Fog
  globalWeather: number
  customSoundEnvironment: string
  customLightEnv: number
  water: number[] // R G B A
  players: Player[] | undefined
  forces: Force[] | undefined
  upgrades: UpgradeAvailable[] | undefined
  techBlacklist: TechUnavailable[] | undefined
  randomUnitTables: RandomUnitTable[] | undefined
  randomItemTables: RandomTable[] | undefined
}

interface PlayerStartingPosition {
  x: number
  y: number
  fixed: boolean
}

interface Player {
  playerNum: number
  type: number // 1=Human, 2=Computer, 3=Neutral, 4=Rescuable
  race: number // 1=Human, 2=Orc, 3=Undead, 4=Night Elf

  name: string
  startingPos: PlayerStartingPosition
  allyLowPriorities: number
  allyHighPriorities: number
  enemyLowPriorities: number
  enermyHighPriorities: number
}

interface ForceFlags {
  allied: boolean // 0x00000001: allied (force 1)
  alliedVictory: boolean // 0x00000002: allied victory
  // 0x00000004: share vision (the documentation has this incorrect)
  shareVision: boolean // 0x00000008: share vision
  shareUnitControl: boolean // 0x00000010: share unit control
  shareAdvUnitControl: boolean // 0x00000020: share advanced unit control
}

interface Force {
  flags: ForceFlags
  players: number[] // 0-based player indices
  name: string
}

interface UpgradeAvailable {
  playerFlags: number
  upgradeId: string
  level: number
  availability: Availability
}

interface TechUnavailable {
  playerFlags: number
  techId: string
}

interface RandomTable {
  id: number
  name: string
  rows: ObjectPool[] | undefined
}

interface ObjectPool {
  type: number
  objects: RandomObject[] | undefined
}

interface RandomObject {
  objectId: string
  chance: number
}

interface RandomUnitTable {
  id: number
  name: string
  positions: number[] | undefined
  chances: Array<{ chance: number, unitIds: string[] }>
}

enum ScriptLanguage {
  JASS = 0,
  Lua = 1
}

enum SupportedModes {
  SD = 1,
  HD = 2,
  Both = 3
}

enum Availability {
  UNAVAILABLE = 0,
  AVAILABLE = 1,
  RESEARCHED = 2
}

export {
  type Map, type GameVersion, type PlayableCamera, type MapFlags,
  type LoadingScreen, FogType, type PlayableMapArea, type Prologue,
  type Info, type PlayerStartingPosition, type Player, type ForceFlags,
  type Force, ScriptLanguage, SupportedModes, type UpgradeAvailable, type TechUnavailable,
  type RandomTable, type RandomUnitTable, type ObjectPool, type RandomObject
}
