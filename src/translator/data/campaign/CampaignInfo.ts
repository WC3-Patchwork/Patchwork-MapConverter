import { color, integer } from "@/wc3maptranslator/CommonInterfaces";
import { FogType } from "@/wc3maptranslator/data";

export interface CampaignInfo {
    campaignVersion: integer,
    editorVersion: integer,
    name: string,
    difficulty: string,
    author: string,
    description: string,
    flags: CampaignFlags,
    backgroundScreenIndex: integer,
    backgroundScreenPath: string,
    minimapPicturePath: string,
    ambientSoundIndex: integer,
    customAmbientSoundPath: string,
    fog: {
        type: FogType | undefined
        startHeight: number | undefined
        endHeight: number | undefined
        density: number | undefined
        color: color | undefined
        newHeightStart: number | undefined
        newHeightEnd: number | undefined
        newLinearStart: number | undefined
        newLinearEnd: number | undefined
        maxOpacity: number | undefined
        drawFogOverSky: boolean | undefined
    } | undefined,
    cursorRace: CursorRace,
    backgroundScreenVersion: BackgroundScreenVersion
    maps: CampaignMap[]
}

export interface CampaignFlags {
    variableDifficulty: boolean,
    expansion: boolean
}

export interface CampaignMap {
    flags: MapFlags,
    chapterTitle: string,
    mapTitle: string,
    path: string
}

export interface MapFlags {
    visible: boolean,
    cinematic: boolean
}

export enum CursorRace {
  HUMAN = 'HUMAN',
  ORC = 'ORC',
  UNDEAD = 'UNDEAD',
  NIGHT_ELF = 'NIGHT_ELF',
  FORSAKEN = 'FORSAKEN'
}

export enum BackgroundScreenVersion {
    DEFAULT = 'DEFAULT',
    CLASSIC = 'CLASSIC',
    REFORGED = 'REFORGED'
}