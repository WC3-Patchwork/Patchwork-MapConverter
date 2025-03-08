import { Camera, Doodad, Offset, Rect, Unit } from "../../wc3maptranslator/data";

//Any position information is converted to relative x/y within the chunk
// The chunk itself contains the main offset
interface WorldChunk{
    size: Offset,
    offset: Offset,
    groundHeight: number[][],
    waterHeight: number[][],
    groundTexture: number[][],
    groundVariation: number[][],
    cliffVariation: number[][],
    cliffTexture: number[][],
    layerHeight: number[][],
    cameras: Camera[],
    doodads: Doodad[],
    units: Unit[]
    rects: Rect[] //Rects are only stored here if they're contained within the chunk boundaries. Otherwise check the main w3r file
}

export { WorldChunk }