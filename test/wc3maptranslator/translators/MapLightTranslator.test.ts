import { expect } from 'chai';
import { describe } from 'mocha';
import { MapLight } from "../../../src/wc3maptranslator/data"
import { MapLightTranslator } from "../../../src/wc3maptranslator/translators"

const testData: MapLight = {
    unitLightFilename: 'test.mdl',
    terrainLightFilename: 'test2.mdl',
    useCustomUnitLight: false,
    useCustomTerrainLight: false,
    useCustomBothLights: true
}

const output = MapLightTranslator.jsonToWar(testData, 3);
const [readData, formatVersion] = MapLightTranslator.warToJson(output);

describe('Map light data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(3)
    })
    it('Map light IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})