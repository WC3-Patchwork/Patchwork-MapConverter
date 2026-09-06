import { expect } from 'chai';
import { describe } from 'mocha';
import { CustomScript, GUITrigger, MapHeader, translators, TriggerComment, TriggerContainer } from '../../src/translator'
import { StatementType } from '../../src/translator/data/statement/StatementType'
import { TriggerTranslatorOutput } from '../../src/translator/TriggersTranslator';
import { ContentType } from '../../src/translator/data/content/TriggerContent';
const TriggersTranslator = translators.TriggersTranslator

const header = {
    contentType: ContentType.HEADER,
    name: 'header',
    isExpanded: false,
    children: [],
    script: '',
    description: ''
} as MapHeader

const category = {
    contentType: ContentType.CATEGORY,
    name: 'Folder',
    isExpanded: false,
    children: []
} as TriggerContainer

const comment = {
    contentType: ContentType.COMMENT,
    name: 'ThisIsAComment',
    comment: 'This is a dummy comment'
} as TriggerComment

const trigger = {
    contentType: ContentType.TRIGGER,
    name: 'GuiTriggerExample',
    initiallyOff: false,
    isEnabled: true,
    runOnMapInit: false,
    description: 'Lel',
    events: [{
        type: StatementType.EVENT,
        name: '',
        isEnabled: true,
        parameters: [
            {

            }
        ]
    }],
    conditions: [{
        type: StatementType.CONDITION,
        name: '',
        isEnabled: true,
        parameters: [
            {

            }
        ]
    }],
    actions: [{
        type: StatementType.ACTION,
        name: '',
        isEnabled: true,
        parameters: [
            {

            }
        ]
    }]
} as GUITrigger

const script = {
    contentType: ContentType.CUSTOM_SCRIPT,
    name: 'CustomScriptExample',
    description: 'Dummy lel',
    isEnabled: true,
    script: "if local then something idfk"
} as CustomScript

header.children.push(category);
category.children.push(comment, trigger, script);

const testData: TriggerTranslatorOutput = {
    root: header,
    scriptReferences: [header, script]
}

const output = TriggersTranslator.jsonToWar(testData, 7, 2, 2147483652)
const [readData, formatVersion, variableFormatVersion, formatSubversion] = TriggersTranslator.warToJson(output)

describe('Sound data translation', () => {
    it('Trigger format versions match', () => {
        expect(formatVersion).to.equal(7)
    })
    it('Variable format versions match', () => {
        expect(variableFormatVersion).to.equal(2)
    })
    it('Trigger format subversions match', () => {
        expect(formatSubversion).to.equal(2147483652)
    })
    it('Triggers IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})