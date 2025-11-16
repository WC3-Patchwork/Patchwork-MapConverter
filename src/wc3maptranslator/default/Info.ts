import { type integer } from '../CommonInterfaces'
import { FogType, PlayerType, Race, RandomGroupSetType, ResearchState, ScriptLanguage } from '../data'

const InfoDefaults = {
  mapVersion: 0,
  editorVersion: 0,
  gameVersion: {
    major: 0, minor: 0, patch: 0, build: 0
  },
  gameDataSet: -1,
  mapDataVersion: 0, // TODO: find default
  map: {
    name: 'Just another Patchworked map',
    author: 'Someone who didn\'t put their name here',
    description: '',
    recommendedPlayers: '',
    playableArea: {
      width: 0, // TODO: find default value
      height: 0 // TODO: find default value
    },
    flags: { // TODO: confirm default values
      hideMinimapInPreview: false,
      modifyAllyPriorities: false,
      isMeleeMap: false,
      nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium: false,
      maskedPartiallyVisible: true,
      fixedPlayerSetting: false,
      useCustomForces: false,
      useCustomTechtree: false,
      useCustomAbilities: false,
      useCustomUpgrades: false,
      mapPropertiesMenuOpenedAtLeastOnce: false,
      waterWavesOnCliffShores: true,
      waterWavesOnRollingShores: true,
      useTerrainFog: false,
      tftRequired: false,
      useItemClassificationSystem: true,
      enableWaterTinting: false,
      useAccurateProbabilityForCalculations: false,
      useCustomAbilitySkins: false,
      disableDenyIcon: false,
      forceDefaultCameraZoom: false,
      forceMaxCameraZoom: false,
      forceMinCameraZoom: false
    },
    mainTileType: '\0',
    fog: {
      type: FogType.LINEAR, // TODO: find default
      startHeight: 0, // TODO: find default
      endHeight: 0, // TODO: find default
      density: 0, // TODO: find default
      color: [0, 0, 0, 0] as [integer, integer, integer, integer] // TODO: find default // R G B A
    },
    globalWeatherEffect: 0, // TODO: find default
    customSoundEnvironment: '', // TODO: find default
    customLightEnvironment: 0, // TODO: find default
    waterColor: [0, 0, 0, 0] as [integer, integer, integer, integer] // TODO: find default // R G B A
  },
  camera: {
    bounds: [0, 0, 0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number, number, number], // TODO: find default values
    margins: [0, 0, 0, 0] as [number, number, number, number], // TODO: find default values
    forcedDefaultCamDistance: 0, // TODO: find default
    forcedMaxCamDistance: 0, // TODO: find default
    forcedMinCamDistance: 0 // TODO: find default
  },
  loadingScreen: {
    imageId: -1,
    path: '',
    text: '',
    title: '',
    subtitle: ''
  },
  prologueScreen: {
    path: '',
    text: '',
    title: '',
    subtitle: ''
  },
  scriptLanguage: ScriptLanguage.JASS,
  assetMode: {
    SD: true,
    HD: true
  },
  players: [
    {
      type: PlayerType.HUMAN,
      race: Race.HUMAN, // Check
      allyLowPriorities: [],
      allyHighPriorities: [],
      enemyLowPriorities: [],
      enemyHighPriorities: []
    }
  ],
  upgrades: [],
  techtree: [],
  randomGroups: [],
  randomItemTables: []
}

const PlayerDefaults = {
  type: PlayerType.HUMAN,
  race: Race.RANDOM,
  allyLowPriorities: [],
  allyHighPriorities: [],
  enemyLowPriorities: [],
  enemyHighPriorities: []
}

const ForceDefaults = {
  flags: {
    allied: false,
    alliedVictory: false,
    shareVision: false,
    shareUnitControl: false,
    shareAdvUnitControl: false
  },
  // players: integer[] // whatever players are defined in map - only for format < 0x03
  name: 'Players'
}

const UpgradeAvailableDefaults = {
  state: ResearchState.AVAILABLE
}

const RandomGroupDefaults = {
  set: {
    type: RandomGroupSetType.ANY_UNIT
  }
}

export { InfoDefaults, PlayerDefaults, ForceDefaults, UpgradeAvailableDefaults, RandomGroupDefaults }
