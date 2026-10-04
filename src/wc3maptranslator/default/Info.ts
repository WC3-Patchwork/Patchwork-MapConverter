import { color, type integer } from '../CommonInterfaces'
import { FogType, GameDataSet, GameDataVersion, PlayerType, Race, RaceCrest, RandomGroupObjectType, ResearchState, ScriptLanguage, Tileset } from '../data'

const InfoDefaults = {
  mapVersion: 1,
  editorVersion: 0,
  gameVersion: {
    major: 3,
    minor: 0,
    patch: 0,
    build: 24268
  },
  gameDataSet: GameDataSet.DEFAULT,
  gameDataVersion: GameDataVersion.FK,
  map: {
    name: 'Just another Patchworked map',
    author: 'Someone who didn\'t put their name here',
    description: 'Nondescript',
    recommendedPlayers: 'Any',
    playableArea: {
      width: 52,
      height: 52
    },
    flags: {
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
      mapPropertiesMenuOpenedAtLeastOnce: true,
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
    mainTileType: Tileset.LORDAERON_SUMMER,
    fog: {
      type: FogType.LINEAR,
      startHeight: 3000,
      endHeight: 5000,
      density: 0.5,
      color: "#FF000000" as color,
      newHeightStart: 0,
      newHeightEnd: 0,
      newLinearStart: 10000,
      newLinearEnd: 10000,
      maxOpacity: 1,
      drawFogOverSky: false
    },
    globalWeatherEffect: '\0\0\0\0',
    customSoundEnvironment: '', // dynamic string
    customLightEnvironment: '', // single char
    water: {
      color: "#FFFFFFFF" as color,
      hdMinOpacity: 0,
      hdMaxOpacity: 100,
      hdReflectivity: 10,
      hdEmissivity: 0,
      hdEdgeSoftness: 50,
      hdWavesVertexDisplacement: 20,
      hdWavesNormalMapStrength: 100,
      hdEnvmapReflectivity: 100,
      hdColor: "#00000000" as color
    },
    alphaTileMinimapColor: "#FFFFFFFF" as color
  },
  camera: {
    bounds: [-2816, -3328, 2816, 2816, -2816, 2816, 2816, -3328],
    margins: [6, 6, 4, 8],
    forcedDefaultCamDistance: 0,
    forcedMaxCamDistance: 0,
    forcedMinCamDistance: 0
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
    DE: false
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