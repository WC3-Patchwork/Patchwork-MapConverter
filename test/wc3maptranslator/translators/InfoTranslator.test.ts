import { expect } from 'chai';
import { describe } from 'mocha';
import { FogType, GameDataSet, GameDataVersion, Info, PlayerType, Race, RaceCrest, RandomGroupObjectType, ResearchState, ScriptLanguage, Tileset } from "../../../src/wc3maptranslator/data"
import { InfoTranslator } from "../../../src/wc3maptranslator/translators"

const testData: Info = {
    mapVersion: 0,
    editorVersion: 7000,
    gameVersion: {
        major: 3,
        minor: 0,
        patch: 0,
        build: 24268
    },
    gameDataSet: GameDataSet.DEFAULT,
    gameDataVersion: GameDataVersion.FK,
    map: {
        name: 'Just another stupid map',
        author: 'Patchwork',
        description: 'Patchworkstuff',
        recommendedPlayers: 'none',
        playableArea: {
            width: 52,
            height: 52
        },
        flags: {
            hideMinimapInPreview: false,
            modifyAllyPriorities: false,
            isMeleeMap: false,
            nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium: false,
            maskedPartiallyVisible: false,
            fixedPlayerSetting: false,
            useCustomForces: false,
            useCustomTechtree: false,
            useCustomAbilities: false,
            useCustomUpgrades: false,
            mapPropertiesMenuOpenedAtLeastOnce: false,
            waterWavesOnCliffShores: true,
            waterWavesOnRollingShores: false,
            useTerrainFog: false,
            tftRequired: false,
            useItemClassificationSystem: false,
            enableWaterTinting: false,
            useAccurateProbabilityForCalculations: false,
            useCustomAbilitySkins: false,
            disableDenyIcon: false,
            forceDefaultCameraZoom: false,
            forceMaxCameraZoom: false,
            forceMinCameraZoom: false,
            overrideHdWaterColor: false,
            alphaTileDefaultMinimapColor: false,
            dynamicMinimap: true
        },
        mainTileType: Tileset.BARRENS,
        fog: {
            type: FogType.LINEAR,
            startHeight: 3,
            endHeight: 5,
            density: 10,
            color: '#ffaabbdd',
            newHeightStart: 60,
            newHeightEnd: 50,
            newLinearStart: 40,
            newLinearEnd: 30,
            maxOpacity: 20,
            drawFogOverSky: true
        },
        globalWeatherEffect: '\0\0\0\0',
        customSoundEnvironment: 'Ayaya',
        customLightEnvironment: 'a',
        water: {
            color: '#abcdefab',
            hdMinOpacity: 70,
            hdMaxOpacity: 80,
            hdReflectivity: 90,
            hdEmissivity: 100,
            hdEdgeSoftness: 110,
            hdWavesVertexDisplacement: 120,
            hdWavesNormalMapStrength: 130,
            hdEnvmapReflectivity: 140,
            hdColor: '#93123211'
        },
        alphaTileMinimapColor: '#ff119383'
    },
    camera: {
        bounds: [-2816, -3328, 2816, 2816, -2816, 2816, 2816, -3328],
        margins: [6, 6, 4, 8],
        forcedDefaultCamDistance: 0,
        forcedMaxCamDistance: 0,
        forcedMinCamDistance: 0
    },
    loadingScreen: {
        imageId: 0,
        raceCrest: RaceCrest.SELECTED_RACE,
        path: '',
        text: '',
        title: '',
        subtitle: ''
    },
    prologue: {
        path: '',
        text: '',
        title: '',
        subtitle: ''
    },
    scriptLanguage: ScriptLanguage.JASS,
    assetMode: {
        SD: false,
        HD: false,
        DE: true
    },
    players: [
        {
            slotId: 0,
            type: PlayerType.HUMAN,
            race: Race.HUMAN,
            raceCrest: RaceCrest.SELECTED_RACE,
            name: 'Player 1',
            startLocation: {
                x: 0,
                y: 0,
                fixed: false
            },
            allyLowPriorities: [],
            allyHighPriorities: [],
            enemyLowPriorities: [],
            enemyHighPriorities: []
        }
    ],
    forces: [{
        flags: {
            allied: true,
            alliedVictory: false,
            shareVision: true,
            shareUnitControl: true,
            shareAdvUnitControl: false
        },
        players: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        name: 'Force 1'
    }],
    upgrades: [
        {
            players: [0],
            upgradeId: 'Argb',
            level: 2,
            state: ResearchState.UNAVAILABLE
        }
    ],
    techtree: [
        {
            players: [1, 2],
            techId: 'hpea'
        }
    ],
    randomGroups: [
        {
            id: 0,
            name: 'MyLittleSet',
            sets: [{
                chance: 20,
                objects: [{
                    type: RandomGroupObjectType.ANY_UNIT,
                    objectId: 'hpea'
                }, {
                    type: RandomGroupObjectType.ANY_ITEM,
                    objectId: 'itmm'
                }]
            }]
        }
    ],
    randomItemTables: [{
        id: 0,
        name: 'testitemspawn',
        table: [ [
            {
                objectId: 'isel',
                chance: 20
            }, {
                objectId: 'lsle',
                chance: 20
            }
        ], [
            {
                objectId: 'abdd',
                chance: 100
            }
        ]]
    }]
};

const output = InfoTranslator.jsonToWar(testData, 39);
const [readData, formatVersion, editorVersion] = InfoTranslator.warToJson(output);

describe('Info data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(39)
    })
    it('Format subversions match', () => {
        expect(editorVersion).to.equal(testData.editorVersion)
    })
    it('Info IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})