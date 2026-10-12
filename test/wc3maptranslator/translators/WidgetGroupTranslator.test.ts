import { expect } from 'chai';
import { describe } from 'mocha';
import { WidgetGroups } from "../../../src/wc3maptranslator/data"
import { WidgetGroupTranslator } from "../../../src/wc3maptranslator/translators"

const testData: WidgetGroups = {
    chunk1: [{
        groupId: 0,
        groupName: 'Test'
    }],
    chunk2: [{
        groupId: 0,
        groupName: 'Test'
    }]
}

const output = WidgetGroupTranslator.jsonToWar(testData, 0);
const [readData, formatVersion] = WidgetGroupTranslator.warToJson(output);

describe('Widget group data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(0)
    })
    it('Widget group IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})