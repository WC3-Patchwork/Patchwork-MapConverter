import { expect } from 'chai';
import { describe } from 'mocha';
import { translators } from '../../src/translator'
import { CustomScriptsTranslatorOutput } from '../../src/translator/CustomScriptsTranslator'
const CustomScriptsTranslator = translators.CustomScriptsTranslator;

const testData: CustomScriptsTranslatorOutput = {
    headerComment: 'Header comment here!',
    scripts: ["This is a script", "", "this is another script"]
};

const output = CustomScriptsTranslator.jsonToWar(testData, 0x80000004, 1);
const [readData, formatVersion, formatSubversion] = CustomScriptsTranslator.warToJson(output);

describe('Custom script data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(0x80000004)
    })
    it('Format subversion match', () => {
        expect(formatSubversion).to.equal(1)
    })
    it('Custom Script IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})