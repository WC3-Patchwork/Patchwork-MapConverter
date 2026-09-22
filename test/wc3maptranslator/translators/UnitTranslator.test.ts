import { expect } from 'chai';
import { describe } from 'mocha';
import { UnitsTranslator } from "../../../src/wc3maptranslator/translators"
import { Unit } from '../../../src/wc3maptranslator/data';

const testData: Unit[] = [
    {
        type: 'dood',
        variation: 5,
        position: [10, 20, 30],
        angle: 4.010704565915763,
        scale: [1.2, 4.2, 0.3],
        skinId: 'dood',
        groupId: -1,
        flags: {
            fixedZ: false,
            useModelAxes: false,
            isUprooted: true
        },
        player: 1,
        hitpoints: 100,
        mana: 30,
        randomItemSetPtr: -1,
        droppedItemSets: [
            {
                items: [
                    {
                        itemId: 'item',
                        chance: 1.0
                    }
                ]
            }
        ],
        gold: 30000,
        targetAcquisition: -1,
        hero: {
            level: 1,
            str: 2,
            agi: 3,
            int: 4
        },
        inventory: [
            {
                slot: 1,
                type: 'item'
            }
        ],
        abilities: [
            {
                ability: 'abil',
                active: false,
                level: 1
            }
        ],
        random: {
            type: 2,
            level: undefined,
            itemClass: undefined,
            groupIndex: undefined,
            columnIndex: undefined,
            unitSet: [
                {
                    unitId: 'ugol',
                    chance: 20
                }
            ]
        },
        color: -1,
        waygate: -1,
        id: 4,
        roll: 2.5,
        pitch: 3.1,
        lights: [
            {
                index: 0,
                isShadowCasting: false,
                color: '#ffaabbcc',
                intensity: 31,
                shadowCastingStart: 32,
                shadowCastingEnd: 33,
                quadraticFalloff: 34,
                linearFalloff: 35,
                damping: 36
            }
        ]
    }
];

const output = UnitsTranslator.jsonToWar(testData, 13, 11, 7000);
const [readData, formatVersion, formatSubversion] = UnitsTranslator.warToJson(output, 7000);

describe('Units data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(13)
    })
    it('Format subversions match', () => {
        expect(formatSubversion).to.equal(11)
    })
    it('Unit IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})