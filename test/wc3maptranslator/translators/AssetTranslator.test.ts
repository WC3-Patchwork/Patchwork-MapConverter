import { expect } from 'chai';
import { describe } from 'mocha';
import { Asset, AssetType } from "../../../src/wc3maptranslator/data"
import { AssetsTranslator } from "../../../src/wc3maptranslator/translators"

const testData: Asset[] = [
    {
        path: 'this\\is\\a\\path\\yes.mdl',
        type: AssetType.Custom
    }
];

const output = AssetsTranslator.jsonToWar(testData, 1);
const [readData, formatVersion] = AssetsTranslator.warToJson(output);

describe('Asset data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(1)
    })
    it('Asset IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})