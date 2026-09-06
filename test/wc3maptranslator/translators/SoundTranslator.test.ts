import { expect } from 'chai';
import { describe } from 'mocha';
import { Sound, SoundChannel, SoundEnvironment } from "../../../src/wc3maptranslator/data"
import { SoundsTranslator } from "../../../src/wc3maptranslator/translators"

const testData: Sound[] = [
    {
        name: "testSound.mp3",
        path: "wc3mapImported\\testSound.mp3",
        eax: SoundEnvironment.SPELLS,
        flags: {
            looping: false,
            "3dSound": false,
            stopOutOfRange: false,
            music: false,
            customImported: false
        },
        fadeRate: {
            in: 0,
            out: 0
        },
        volume: 127,
        pitch: 0,
        pitchVariance: 0,
        priority: 0,
        channel: SoundChannel.GENERAL,
        "3d": {
            distance: {
                min: 0,
                max: 0,
                cutoff: 0
            },
            cone: {
                insideAngle: 0,
                outsideAngle: 0,
                outsideVolume: 0,
                orientation: [0, 0, 0]
            }
        },
        labelSLK: "",
        dialogueId: 0,
        productionComments: "",
        speakerNameId: 0,
        listenerName: "",
        assetFlags: 0,
        speakerUnitId: "",
        animationLabel: "",
        animationGroup: "",
        animationSetFilepath: "",
        animationSetFilepathIsMapRelative: false
    }
];

const output = SoundsTranslator.jsonToWar(testData, 3);
const [readData, formatVersion] = SoundsTranslator.warToJson(output);

describe('Sound data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(3)
    })
    it('Sound IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})