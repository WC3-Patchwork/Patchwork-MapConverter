import { expect } from 'chai';
import { describe } from 'mocha';
import { Region } from "../../../src/wc3maptranslator/data"
import { RegionsTranslator } from "../../../src/wc3maptranslator/translators"

const testData: Region[] = [
    {
        position: {
            left: 1,
            bottom: 2,
            right: 3,
            top: 4
        },
        name: 'TestRect',
        id: 1,
        weatherEffect: 'wrtg',
        ambientSound: 'ards.gog',
        color: '#ffaabbcc',
        blockCamera: false,
        alphaTileMinimapColor: true
    }
];

const output = RegionsTranslator.jsonToWar(testData, 7);
const [readData, formatVersion] = RegionsTranslator.warToJson(output);

describe('Region data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(7)
    })
    it('Region IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})