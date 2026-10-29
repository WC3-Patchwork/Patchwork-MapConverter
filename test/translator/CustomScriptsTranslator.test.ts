import { expect } from 'chai';
import { describe } from 'mocha';
import { translators } from '../../src/translator'
import { CustomScriptsTranslatorOutput } from '../../src/translator/CustomScriptsTranslator'
const CustomScriptsTranslator = translators.CustomScriptsTranslator;

const testData: CustomScriptsTranslatorOutput = {
    headerComment: 'Header comment here!—————————————————————————————————————————————',
    scripts: ["This is a script", "", "this is another script—————————————————————————————————————————————"]
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

const classicOutput = CustomScriptsTranslator.jsonToWar(testData, 1, 0x7FFFFFFF);
const [classicReadData, classicFormatVersion] = CustomScriptsTranslator.warToJson(classicOutput);

describe('Classic custom script data translation', () => {
    it('Format versions match', () => {
        expect(classicFormatVersion).to.equal(1)
    })
    it('Script count excludes the header script', () => {
        const headerSize = Buffer.byteLength(testData.headerComment, 'utf-8') + 1 + 4 + Buffer.byteLength(testData.scripts[0] as string, 'utf-8') + 1
        expect(classicOutput.readInt32LE(4 + headerSize)).to.equal(testData.scripts.length - 1)
    })
    it('Custom Script IO matches', () => {
        expect(classicReadData).to.deep.equal(testData)
    })
})