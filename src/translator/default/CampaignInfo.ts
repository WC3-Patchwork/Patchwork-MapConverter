import { FogType } from "@/wc3maptranslator/data"
import { BackgroundScreenVersion, CursorRace } from "../data/campaign/CampaignInfo"

const CampaignInfoDefaults = {
    flags: {
        variableDifficulty: false,
        expansion: false
    },
    fog: {
        type: FogType.LINEAR,
        zStart: 0.00,
        zEnd: 0.00,
        density: 0.00,
        color: "#FF000000",
        heightStart: 0.00,
        heightEnd: 0.00,
        linearStart: 0.00,
        linearEnd: 0.00,
        maxOpacity: 0.00,
        drawOverSky: false
    },
    cursorRace: CursorRace.HUMAN,
    backgroundScreenVersion: BackgroundScreenVersion.DEFAULT,
    map: {
        flags: {
            visible: false,
            cinematic: false
        }
    }
}
export { CampaignInfoDefaults }