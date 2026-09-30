import { color, type integer } from '../CommonInterfaces'
import { FogType, PlayerType, Race, RaceCrest, RandomGroupObjectType, ResearchState, ScriptLanguage } from '../data'

const InfoDefaults = {
  mapVersion: 0,
  editorVersion: 0,
  gameVersion: {
    major: 0,
    minor: 0,
    patch: 0,
    build: 0
  },
  gameDataSet: -1,
  gameDataVersion: 0, // TODO: find default
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
      forceMinCameraZoom: false,
      overrideHdWaterColor: false,
      alphaTileDefaultMinimapColor: false,
      dynamicMinimap: false
    },
    mainTileType: '\0',
    fog: {
      type: FogType.LINEAR, // TODO: find default
      startHeight: 0, // TODO: find default
      endHeight: 0, // TODO: find default
      density: 0, // TODO: find default
      color: "#FFFFFFFF" as color, // TODO: find default
      newHeightStart: 0, // TODO: find default
      newHeightEnd: 0, // TODO: find default
      newLinearStart: 0, // TODO: find default
      newLinearEnd: 0, // TODO: find default
      maxOpacity: 0, // TODO: find default
      drawFogOverSky: false // TODO: find default
    },
    globalWeatherEffect: 0, // TODO: find default
    customSoundEnvironment: '', // TODO: find default
    customLightEnvironment: 0, // TODO: find default
    water: {
      color: "#FFFFFFFF" as color, // TODO: find default
      hdMinOpacity: 0, // TODO: find default
      hdMaxOpacity: 0, // TODO: find default
      hdReflectivity: 0, // TODO: find default
      hdEmissivity: 0, // TODO: find default
      hdEdgeSoftness: 0, // TODO: find default
      hdWavesVertexDisplacement: 0, // TODO: find default
      hdWavesNormalMapStrength: 0, // TODO: find default
      hdEnvmapReflectivity: 0, // TODO: find default
      hdColor: "#FFFFFFFF" as color, // TODO: find default
    },
    alphaTileMinimapColor: "#FFFFFFFF" as color, // TODO: find default
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
    raceCrest: RaceCrest.SELECTED_RACE,
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
    HD: true,
    DE: true
  },
  players: [],
  upgrades: [],
  techtree: [],
  randomGroups: [],
  randomItemTables: []
}

const PlayerDefaults = {
  type: PlayerType.HUMAN,
  race: Race.RANDOM,
  raceCrest: RaceCrest.SELECTED_RACE,
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
  objectType: RandomGroupObjectType.ANY_UNIT,
  objectId: '\0\0\0\0'
}

export { InfoDefaults, PlayerDefaults, ForceDefaults, UpgradeAvailableDefaults, RandomGroupDefaults }