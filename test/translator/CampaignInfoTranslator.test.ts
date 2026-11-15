import { expect } from 'chai';
import { describe } from 'mocha';
import { translators } from '../../src/translator'
import { BackgroundScreenVersion, CampaignInfo, CursorRace } from '../../src/translator/data/campaign/CampaignInfo';
import { FogType } from '../../src/wc3maptranslator/data/Info'
const CampaignInfoTranslator = translators.CampaignInfoTranslator;

const testData: CampaignInfo = {
    campaignVersion: 1,
    editorVersion: 6118,
    name: 'Name',
    difficulty: 'Difficulty',
    author: 'Author',
    description: 'Description',
    flags: {
        variableDifficulty: true,
        expansion: true
    },
    backgroundScreenIndex: 1,
    backgroundScreenPath: 'screenPath',
    minimapPicturePath: 'picturePath',
    ambientSoundIndex: 2,
    customAmbientSoundPath: 'ambientSoundPath',
    fog: {
        type: FogType.HEIGHT,
        startHeight: 123,
        endHeight: 234,
        density: 1,
        color: "#ff00ff00",
        newHeightStart: 41,
        newHeightEnd: 23,
        newLinearStart: 51,
        newLinearEnd: 63,
        maxOpacity: 1.20000004768372,
        drawFogOverSky: true
    },
    cursorRace: CursorRace.FORSAKEN,
    backgroundScreenVersion: BackgroundScreenVersion.REFORGED,
    maps: [{
        flags: {
            visible: true,
            cinematic: false
        },
        chapterTitle: 'Title 1',
        mapTitle: 'mapTitle 1',
        path: 'path1'
    }, {
        flags: {
            visible: false,
            cinematic: true
        },
        chapterTitle: 'Cinema2',
        mapTitle: 'CInmea2',
        path: 'cinema2path'
    }]
};

const output = CampaignInfoTranslator.jsonToWar(testData, 3);
const [readData, formatVersion, editorVersion] = CampaignInfoTranslator.warToJson(output);

describe('Custom script data translation', () => {
    it('Format versions match', () => {
        expect(formatVersion).to.equal(3)
    })
    it('Editor version match', () => {
        expect(editorVersion).to.equal(testData.editorVersion)
    })
    it('Campaign info IO matches', () => {
        expect(readData).to.deep.equal(testData)
    })
})
