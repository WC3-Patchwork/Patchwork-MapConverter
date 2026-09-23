import { expect } from 'chai';
import { describe } from 'mocha';
import { Camera } from "../../../src/wc3maptranslator/data"
import { CamerasTranslator } from "../../../src/wc3maptranslator/translators"

const testData: Camera[] = [
    {
        name: 'TestCam',
        targetX: 2000.00,
        targetY: 3000.00,
        offsetZ: 4000.00,
        rotation: 4.187,
        angleOfAttack: 3.282,
        distance: 1200.00,
        roll: 2.178,
        fieldOfView: 20,
        farClipping: 30000,
        nearClipping: 10,
        localPitch: 12,
        localYaw: 11,
        localRoll: 13,
        dofDistance: 14,
        dofScale: 15,
        posAbsoluteZ: 16,
        freeCamera: true
    }
];

const output = CamerasTranslator.jsonToWar(testData, 3, 7000);
const [readData, formatVersion] = CamerasTranslator.warToJson(output, 7000);

describe('Camera data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(3)
    })
    it('Camera IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})