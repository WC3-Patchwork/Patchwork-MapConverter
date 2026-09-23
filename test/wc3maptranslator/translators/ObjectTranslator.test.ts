import { expect } from 'chai';
import { describe } from 'mocha';
import { ModificationType, ObjectModificationTable, ObjectType } from "../../../src/wc3maptranslator/data"
import { ObjectsTranslator } from "../../../src/wc3maptranslator/translators"

const testData: ObjectModificationTable = {
    original: {
        "Acrs": {
            originalId: "Acrs",
            modifications: [
                {
                    id: 'Crs\0',
                    type: ModificationType.INTEGER,
                    dataPointer: -1,
                    levelVariation: -1,
                    value: 1
                }
            ]
        }
    },
    custom: {}
};

const output = ObjectsTranslator.jsonToWar(testData, ObjectType.Abilities, 3);
const [readData, formatVersion] = ObjectsTranslator.warToJson(output, ObjectType.Abilities);

describe('Region data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(3)
    })
    it('Region IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})