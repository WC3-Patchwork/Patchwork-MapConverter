import { expect } from 'chai';
import { describe } from 'mocha';
import { StringsTranslator } from "../../../src/wc3maptranslator/translators"

const testData: Record<string, string> = {
    "001": "abcd",
    "002": "bcda",
    "003": "dcda"
};

const output = StringsTranslator.jsonToWar(testData);
const readData = StringsTranslator.warToJson(output);

describe('String data translation', () => {
    it('String IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})