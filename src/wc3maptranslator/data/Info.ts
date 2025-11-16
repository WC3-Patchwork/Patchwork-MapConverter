import { type integer } from '../CommonInterfaces'

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
  bounds: number[] // x,y pairs
  margins: number[] // left, right, top, bottom
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
  imageId: number
  path: string
  text: string
  title: string
  subtitle: string
}

enum FogType {
  LINEAR = 'LINEAR',
  EXPONENTIAL1 = 'EXPONENTIAL1',
  EXPONENTIAL2 = 'EXPONENTIAL2'
}

interface Fog {
  type: FogType
  startHeight: number
  endHeight: number
  density: number
  color: [integer, integer, integer, integer] // R G B A
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
  mapVersion: number
  gameVersion: GameVersion
  editorVersion: number
  scriptLanguage: ScriptLanguage
  assetMode: SupportedMode
  mapDataVersion: number
  forcedDefaultCamDistance: number
  forcedMaxCamDistance: number
  forcedMinCamDistance: number
  map: Map
  camera: PlayableCamera
  gameDataSet: number
  prologue: Prologue
  loadingScreen: LoadingScreen
  fog: Fog
  globalWeatherEffect: number
  customSoundEnvironment: string
  customLightEnvironment: number
  waterColor: [integer, integer, integer, integer] // R G B A
  players: Player[] | undefined
  forces: Force[] | undefined
  upgrades: UpgradeAvailable[] | undefined
  techtree: TechUnavailable[] | undefined
  randomGroups: RandomGroup[] | undefined
  randomItemTables: ItemTable[] | undefined
}

interface PlayerStartingPosition {
  x: number
  y: number
  fixed: boolean
}

interface Player {
  slotId: integer
  type: PlayerType
  race: Race

  name: string
  startLocation: PlayerStartingPosition
  allyLowPriorities: PlayerList
  allyHighPriorities: PlayerList
  enemyLowPriorities: PlayerList
  enemyHighPriorities: PlayerList
}

enum Race {
  HUMAN = 'HUMAN',
  ORC = 'ORC',
  UNDEAD = 'UNDEAD',
  NIGHT_ELF = 'NIGHT_ELF',
  RANDOM = 'RANDOM'
}

enum PlayerType {
  HUMAN = 'HUMAN',
  COMPUTER = 'COMPUTER',
  NEUTRAL = 'NEUTRAL',
  RESCUABLE = 'RESCUABLE'
}

interface ForceFlags {
  allied: boolean // 0x00000001: allied (force 1)
  alliedVictory: boolean // 0x00000002: allied victory
  // 0x00000004: share vision (the documentation has this incorrect)
  shareVision: boolean // 0x00000008: share vision
  shareUnitControl: boolean // 0x00000010: share unit control
  shareAdvUnitControl: boolean // 0x00000020: share advanced unit control
}

type PlayerList = integer[] // 0-indexed player IDs

interface Force {
  flags: ForceFlags
  players: PlayerList
  name: string
}

interface UpgradeAvailable {
  players: PlayerList
  upgradeId: string
  level: integer
  state: ResearchState
}

interface TechUnavailable {
  players: PlayerList
  techId: string
}

interface ItemTable {
  id: integer
  name: string
  table: ObjectChance[][] | undefined
}

interface ObjectChance {
  objectId: string
  chance: number
}

interface RandomGroup {
  id: integer
  name: string
  sets: RandomGroupSet[]
}

interface RandomGroupSet {
  type: RandomGroupSetType
  chance: integer
  objects: string[]
}

enum RandomGroupSetType {
  ANY_UNIT = 'ANY_UNIT',
  ANY_BUILDING = 'ANY_BUILDING',
  ANY_ITEM = 'ANY_ITEM'
}

enum ScriptLanguage {
  JASS = 'JASS',
  LUA = 'LUA'
}

interface SupportedMode {
  SD: boolean
  HD: boolean
}

enum ResearchState {
  UNAVAILABLE = 'UNAVAILABLE',
  AVAILABLE = 'AVAILABLE',
  RESEARCHED = 'RESEARCHED'
}

export {
  type Map, type GameVersion, type PlayableCamera, type MapFlags, PlayerType, Race, RandomGroupSetType,
  type LoadingScreen, FogType, type PlayableMapArea, type Prologue, ResearchState,
  type Info, type PlayerStartingPosition, type Player, type ForceFlags, type PlayerList,
  type Force, ScriptLanguage, type SupportedMode, type UpgradeAvailable, type TechUnavailable,
  type ItemTable as RandomTable, type RandomGroup, type RandomGroupSet, type ObjectChance
}
