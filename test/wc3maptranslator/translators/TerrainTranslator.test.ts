import { expect } from 'chai';
import { describe } from 'mocha';
import { Boundary, Terrain, Tileset } from "../../../src/wc3maptranslator/data"
import { TerrainTranslator } from "../../../src/wc3maptranslator/translators"
import { integer } from '../../../src/wc3maptranslator/CommonInterfaces';

const testData: Terrain = {
    tileset: Tileset.ASHENVALE,
    customTileset: false,
    tilePalette: ['Pdrt', 'Pdtr', 'Pblm', 'Pbtl', 'Psqd', 'Prtl', 'Pgsb', 'Phdg', 'Pwmb'],
    cliffTilePalette: ['CPdi', 'CPsq'],
    map: {
        sizeX: 2,
        sizeY: 2,
        offsetX: -4096,
        offsetY: -4096
    },
    groundTexture: [],
    groundVariation: [],
    cliffTexture: [],
    cliffVariation: [],
    cliffLevel: [],
    groundHeight: [],
    waterHeight: [],
    ramp: [],
    blight: [],
    water: [],
    boundary: []
};

function getRandomInt(min: integer, max: integer): integer {
    return Number.parseInt((min + Math.random() * (max - min)).toFixed(0))
}

function getRandomNumber(min: number, max: number): number {
    return getRandomInt(4*min, 4*max)/4
}

function getRandomBoolean(): boolean {
    return Math.random() > 0.5
}

for (let i = 0; i <= testData.map.sizeY; i++) {
    (testData.groundTexture[i] as integer[]) = [];
    (testData.groundVariation[i] as integer[]) = [];
    (testData.cliffTexture[i] as integer[]) = [];
    (testData.cliffVariation[i] as integer[]) = [];
    (testData.cliffLevel[i] as integer[]) = [];
    (testData.groundHeight[i] as number[]) = [];
    (testData.waterHeight[i] as number[]) = [];
    (testData.ramp[i] as boolean[]) = [];
    (testData.blight[i] as boolean[]) = [];
    (testData.water[i] as boolean[]) = [];
    (testData.boundary[i] as Boundary[]) = [];
    for (let j = 0; j <= testData.map.sizeX; j++) {
        (testData.groundTexture[i][j] as integer) = getRandomInt(0, testData.tilePalette.length);
        (testData.groundVariation[i][j] as integer) = getRandomInt(0, 3);
        (testData.cliffTexture[i][j] as integer) = getRandomInt(0, testData.cliffTilePalette.length);
        (testData.cliffVariation[i][j] as integer) = getRandomInt(0, 3);
        (testData.cliffLevel[i][j] as integer) = getRandomInt(0, 2);
        (testData.groundHeight[i][j] as number) = getRandomNumber(-2000, 2000);
        (testData.waterHeight[i][j] as number) = getRandomNumber(-2000, 2000);
        (testData.ramp[i][j] as boolean) = getRandomBoolean();
        (testData.blight[i][j] as boolean) = getRandomBoolean();
        (testData.water[i][j] as boolean) = getRandomBoolean();
        (testData.boundary[i][j] as Boundary) = Boundary.Type1;
    }
}

const output = TerrainTranslator.jsonToWar(testData, 12);
const [readData, formatVersion] = TerrainTranslator.warToJson(output);

describe('Terrain data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(12)
    })
    it('Terrain IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})