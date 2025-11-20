import { type integer } from '../CommonInterfaces'

interface Info {
  mapVersion: number
  editorVersion: number
  gameVersion: {
    major: integer
    minor: integer
    patch: integer
    build: integer
  }
  gameDataSet: number
  mapDataVersion: number
  map: {
    name: string
    author: string
    description: string
    recommendedPlayers: string
    playableArea: {
      width: number
      height: number
    }
    flags: {
      hideMinimapInPreview: boolean // 0x0001
      modifyAllyPriorities: boolean // 0x0002
      isMeleeMap: boolean // 0x0004
      nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium: boolean // 0x0008
      maskedPartiallyVisible: boolean // 0x0010
      fixedPlayerSetting: boolean // 0x0020
      useCustomForces: boolean // 0x0040
      useCustomTechtree: boolean // 0x0080
      useCustomAbilities: boolean // 0x0100
      useCustomUpgrades: boolean // 0x0200
      mapPropertiesMenuOpenedAtLeastOnce: boolean // 0x0400
      waterWavesOnCliffShores: boolean // 0x0800
      waterWavesOnRollingShores: boolean // 0x1000
      useTerrainFog: boolean// 0x2000
      tftRequired: boolean // 0x4000
      useItemClassificationSystem: boolean // 0x8000
      enableWaterTinting: boolean // 0x10000
      useAccurateProbabilityForCalculations: boolean // 0x20000
      useCustomAbilitySkins: boolean // 0x40000
      disableDenyIcon: boolean // 0x80000
      forceDefaultCameraZoom: boolean // 0x100000
      forceMaxCameraZoom: boolean // 0x200000
      forceMinCameraZoom: boolean // 0x400000
    }
    mainTileType: string
    fog: {
      type: FogType
      startHeight: number
      endHeight: number
      density: number
      color: [integer, integer, integer, integer]
    }
    globalWeatherEffect: number
    customSoundEnvironment: string
    customLightEnvironment: number
    waterColor: [integer, integer, integer, integer]
  }
  camera: {
    bounds: [number, number, number, number, number, number, number, number] // x,y pairs
    margins: [number, number, number, number] // left, right, top, bottom
    forcedDefaultCamDistance: number
    forcedMaxCamDistance: number
    forcedMinCamDistance: number

  }
  loadingScreen: {
    imageId: number
    path: string
    text: string
    title: string
    subtitle: string
  }
  prologue: {
    path: string
    text: string
    title: string
    subtitle: string
  }
  scriptLanguage: ScriptLanguage
  assetMode: {
    SD: boolean
    HD: boolean
  }
  players: Player[] | undefined
  forces: Force[] | undefined
  upgrades: UpgradeAvailable[] | undefined
  techtree: TechUnavailable[] | undefined
  randomGroups: RandomGroup[] | undefined
  randomItemTables: ItemTable[] | undefined
}

interface Player {
  slotId: integer
  type: PlayerType
  race: Race
  name: string
  startLocation: {
    x: number
    y: number
    fixed: boolean
  }
  allyLowPriorities: PlayerList
  allyHighPriorities: PlayerList
  enemyLowPriorities: PlayerList
  enemyHighPriorities: PlayerList
}

interface Force {
  flags: {
    allied: boolean // 0x00000001: allied (force 1)
    alliedVictory: boolean // 0x00000002: allied victory
    // 0x00000004: share vision (the documentation has this incorrect)
    shareVision: boolean // 0x00000008: share vision
    shareUnitControl: boolean // 0x00000010: share unit control
    shareAdvUnitControl: boolean // 0x00000020: share advanced unit control
  }
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

enum FogType {
  LINEAR = 'LINEAR',
  EXPONENTIAL1 = 'EXPONENTIAL1',
  EXPONENTIAL2 = 'EXPONENTIAL2'
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

type PlayerList = integer[] // 0-indexed player IDs

enum RandomGroupSetType {
  ANY_UNIT = 'ANY_UNIT',
  ANY_BUILDING = 'ANY_BUILDING',
  ANY_ITEM = 'ANY_ITEM'
}

enum ScriptLanguage {
  JASS = 'JASS',
  LUA = 'LUA'
}

enum ResearchState {
  UNAVAILABLE = 'UNAVAILABLE',
  AVAILABLE = 'AVAILABLE',
  RESEARCHED = 'RESEARCHED'
}

export { PlayerType, Race, RandomGroupSetType, FogType, ResearchState, ScriptLanguage }
export type { Info, Player, PlayerList, Force, UpgradeAvailable, TechUnavailable, ItemTable, RandomGroup, RandomGroupSet, ObjectChance }