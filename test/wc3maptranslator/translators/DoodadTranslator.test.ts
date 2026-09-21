import { expect } from 'chai';
import { describe } from 'mocha';
import { DoodadsTranslator } from "../../../src/wc3maptranslator/translators"
import { DoodadsTranslatorOutput } from '../../../src/wc3maptranslator/translators/DoodadsTranslator';

const testData: DoodadsTranslatorOutput = {
    doodads: [
        {
            type: 'dood',
            variation: 5,
            position: [10, 20, 30],
            angle: 4.010704565915763,
            scale: [1.2, 4.2, 0.3],
            skinId: 'dood',
            groupId: -1,
            flags: {
                inUnplayableArea: false,
                notUsedInScript: true,
                fixedZ: false,
                useModelAxes: false
            },
            life: 100,
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
            color: -1,
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
    ],
    specialDoodads: [
        {
            type: 'abcd',
            variation: 2,
            position: [1, 2]
        }
    ]
};

const output = DoodadsTranslator.jsonToWar(testData, 13, 11, 0, 7000);
const [readData, formatVersion, formatSubversion, specialDoodadFormatVersion] = DoodadsTranslator.warToJson(output, 7000);

describe('Doodad data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(13)
    })
    it('Format subversions match', () => {
        expect(formatSubversion).to.equal(11)
    })
    it('Format special version match', () => {
        expect(specialDoodadFormatVersion).to.equal(0)
    })
    it('Doodad IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})