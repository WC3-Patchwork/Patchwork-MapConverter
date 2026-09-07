import { expect } from 'chai';
import { describe } from 'mocha';
import { CustomScript, GUITrigger, MapHeader, Statement, translators, TriggerComment, TriggerContainer } from '../../src/translator'
import { StatementType } from '../../src/translator/data/statement/StatementType'
import { ParameterType } from '../../src/translator/data/parameter/ParameterType'
import { TriggerTranslatorOutput } from '../../src/translator/TriggersTranslator';
import { ContentType } from '../../src/translator/data/content/TriggerContent';
import { TriggerDataRegistry } from '../../src/enhancements/TriggerDataRegistry';
const TriggersTranslator = translators.TriggersTranslator
TriggerDataRegistry.loadTriggerData('test/triggerdata.txt')

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
        name: 'TriggerRegisterPlayerUnitEventSimple',
        isEnabled: true,
        parameters: [
            {
                type: ParameterType.PRESET,
                value: 'Player00'
            },
            {
                type: ParameterType.PRESET,
                value: 'PlayerUnitEventDeath'
            }
        ]
    }],
    conditions: [{
        type: StatementType.CONDITION,
        name: 'OperatorCompareBoolean',
        isEnabled: true,
        parameters: [
            {
                type: ParameterType.FUNCTION,
                value: 'IsUnitInGroup',
                statement: {
                    type: StatementType.CALL,
                    name: 'IsUnitInGroup',
                    isEnabled: true,
                    parameters: [
                        {
                            type: ParameterType.FUNCTION,
                            value: 'GetTriggerUnit',
                            statement: {
                                type: StatementType.CALL,
                                name: 'GetTriggerUnit',
                                isEnabled: true
                            }
                        },
                        {
                            type: ParameterType.FUNCTION,
                            value: 'GetUnitsInRangeOfLocAll',
                            statement: {
                                type: StatementType.CALL,
                                name: 'GetUnitsInRangeOfLocAll',
                                isEnabled: true,
                                parameters: [
                                    {
                                        type: ParameterType.VALUE,
                                        value: '128.00'
                                    },
                                    {
                                        type: ParameterType.FUNCTION,
                                        value: 'Location',
                                        statement: {
                                            type: StatementType.CALL,
                                            name: 'Location',
                                            isEnabled: true,
                                            parameters: [
                                                {
                                                    type: ParameterType.VALUE,
                                                    value: '0.00'
                                                },
                                                {
                                                    type: ParameterType.VALUE,
                                                    value: '0.00'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                } 
            },
            {
                type: ParameterType.PRESET,
                value: 'EqualNotEqualOperator'
            },
            {
                type: ParameterType.VALUE,
                value: 'true'
            }
        ]
    }],
    actions: [{
        type: StatementType.ACTION,
        name: 'ForGroupMultiple',
        isEnabled: true,
        parameters: [
            {
                type: ParameterType.FUNCTION,
                value: 'GetUnitsInRangeOfLocAll',
                statement: {
                    type: StatementType.CALL,
                    name: 'GetUnitsInRangeOfLocAll',
                    isEnabled: true,
                    parameters: [
                        {
                            type: ParameterType.VALUE,
                            value: '128.00'
                        },
                        {
                            type: ParameterType.FUNCTION,
                            value: 'Location',
                            statement: {
                                type: StatementType.CALL,
                                name: 'Location',
                                isEnabled: true,
                                parameters: [
                                    {
                                        type: ParameterType.VALUE,
                                        value: '0.00'
                                    },
                                    {
                                        type: ParameterType.VALUE,
                                        value: '0.00'
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ],
        statements: {
            [0]: [{
                type: StatementType.ACTION,
                name: 'KillUnit',
                isEnabled: true,
                parameters: [
                    {
                        type: ParameterType.FUNCTION,
                        value: 'GetEnumUnit',
                        statement: {
                            type: StatementType.CALL,
                            name: 'GetEnumUnit',
                            isEnabled: true
                        }
                    }
                ]
            },
            {
                type: StatementType.ACTION,
                name: 'SetVariable',
                isEnabled: true,
                parameters: [
                    {
                        type: ParameterType.VARIABLE,
                        value: 'TempInteger',
                        arrayIndex: {
                            type: ParameterType.VALUE,
                            value: '1'
                        }
                    },
                    {
                        type: ParameterType.FUNCTION,
                        value: 'OperatorInt',
                        statement: {
                            type: StatementType.CALL,
                            name: 'OperatorInt',
                            isEnabled: true,
                            parameters: [
                                {
                                    type: ParameterType.VARIABLE,
                                    value: 'TempInteger',
                                    arrayIndex: {
                                        type: ParameterType.VALUE,
                                        value: '1'
                                    }
                                },
                                {
                                    type: ParameterType.PRESET,
                                    value: 'OperatorAdd'
                                },
                                {
                                    type: ParameterType.VALUE,
                                    value: '1'
                                }
                            ]
                        }
                    }
                ]
            }] as Statement[]
        } as Record<number, Statement[]>
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

describe('Triggers translation', () => {
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