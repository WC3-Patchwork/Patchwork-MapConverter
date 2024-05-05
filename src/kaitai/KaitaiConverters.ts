import W3Blp from "./w3-blp/W3Blp"; //Image files
import W3Doo from "./w3-doo/W3Doo"; //Preplaced doodads
import W3Doo132 from "./w3-doo-1-32/W3Doo132"; //Preplaced doodads
import W3DooPre132 from "./w3-doo-pre-1-32/W3DooPre132"; //Preplaced doodads
import W3DooUnits from "./w3-dooUnits/W3DooUnits"; //Preplaced units
import W3DooUnits132 from "./w3-dooUnits-1-32/W3DooUnits132"; //Preplaced units
import W3DooUnitsPre132 from "./w3-dooUnits-pre-1-32/W3DooUnitsPre132"; //Preplaced units
import W3Imp from "./w3-imp/W3Imp"; //Assets
import W3Mmp from "./w3-mmp/W3Mmp"; //Minimap
import W3Mpq from "./w3-mpq/W3Mpq"; //Map archive file
import W3ObjModFile from "./w3-obj-mod-file/W3ObjModFile"; //colletive object data reader, replaces following:
/*
Abilities: W3W3a
Destructable: W3W3b
Doodads: W3W3d
Buff: W3W3h
Item: W3W3t
Upgrade: W3W3q
Unit: W3W3u
*/
import W3Shd from "./w3-shd/W3Shd"; //Shadowmap
import W3W3c from "./w3-w3c/W3W3c"; //cameras
import W3W3e from "./w3-w3e/W3W3e"; //enviroment
import W3W3f from "./w3-w3f/W3W3f"; //difficulty?
import W3W3g from "./w3-w3g/W3W3g"; //cheats? more settings?
import W3W3i from "./w3-w3i/W3W3i"; //environment and settings? honestly how many of them are there?
import W3W3o from "./w3-w3o/W3W3o"; //Object editor export?
import W3W3r from "./w3-w3r/W3W3r"; //World Editor regions
import W3W3s from "./w3-w3s/W3W3s"; //Sound editor data
import W3W3v from "./w3-w3v/W3W3v"; //Gamecache?
import W3W3z from "./w3-w3z/W3W3z"; //Saved games? (unfinished)
import W3Wai from "./w3-wai/W3Wai"; //AI editor data
import W3Wct from "./w3-wct/W3Wct"; //Custom script
import W3Wgc from "./w3-wgc/W3Wgc"; //Player-race settings?
import W3Wpm from "./w3-wpm/W3Wpm"; //Pathing map
import W3Wtg from "./w3-wtg-pre131/W3Wtg.js"; //Triggers data
import W3Wtg131 from "./w3-wtg-131/W3Wtg131"; //Triggers data
import W3char from "./w3char/W3char";
import W3id from "./w3id/W3id";
import W3str from "./w3str/W3str";
import KaitaiStream from "kaitai-struct";

export class KaitaiConverter<T> {
    constructor(stream: KaitaiStream){
        
    };
}

const converterRecords: Record<string, KaitaiConverter<unknown>[]> = {
    '.blp': [W3Blp],
    '.doo': [W3Doo, W3Doo132, W3DooPre132],
    '.Units.doo': [W3DooUnits, W3DooUnits132, W3DooUnitsPre132],
    '.imp': [W3Imp],
    '.mmp': [W3Mmp],
    '.mpq': [W3Mpq],

    '.w3u': [W3ObjModFile],
    '.w3t': [W3ObjModFile],
    '.w3a': [W3ObjModFile],
    '.w3b': [W3ObjModFile],
    '.w3d': [W3ObjModFile],
    '.w3q': [W3ObjModFile],
    '.w3h': [W3ObjModFile],

    '.shd': [W3Shd],
    '.w3c': [W3W3c],
    '.w3e': [W3W3e],
    '.w3f': [W3W3f],
    '.w3g': [W3W3g],
    '.w3i': [W3W3i],
    '.w3o': [W3W3o],
    '.w3r': [W3W3r],
    '.w3s': [W3W3s],
    '.w3v': [W3W3v],
    '.w3z': [W3W3z],
    '.wai': [W3Wai],
    '.wct': [W3Wct],
    '.wgc': [W3Wgc],
    '.wpm': [W3Wpm],
    '.wtg': [W3Wtg, W3Wtg131]
}

export const KaitaiConverters = {
    get: function (filename: string): KaitaiConverter<unknown>[] | null {
        for (const [extension, converters] of Object.entries(converterRecords)) {
            if (filename.includes(extension)) {
                return converters;
            }
        }
        return null;
    }
}