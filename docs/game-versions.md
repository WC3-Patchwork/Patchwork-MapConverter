# Game versions, map file formats and game data

What the World Editor of each Warcraft III patch writes into each map file, and what the game data (the SLK tables)
of each patch has. The built-in target profiles of `json2war` (`src/converter/profiles/`) follow the first table; the
SLK changes are in [`game-data-changes.json`](game-data-changes.json).

## How this was measured

- **Map files**: 1,243 distinct maps, read header by header. The authoritative ones are Blizzard's own maps shipped
  inside 1.28.5, 1.29.2, 2.0.4 (2.0.4.23745) and 3.0.1 (3.0.1.24371); the rest are user maps saved by every editor
  from RoC to 3.0.1. They are grouped by the editor number (`war3map.w3i`, third int) and, from w3i format 28 on, by
  the game version the w3i stores.
- **Cross-check with Patchwork itself**: for each profile, a real map of that version went through
  `war2json --generate-target-profile`; the recorded profile equals the built-in one in every file the map has
  (1.07, 1.28, 1.29, 1.30, 1.31, 1.32.4, 1.32.10, 1.36, 2.0.4, 3.0.1), except where the map itself was not fully
  re-saved (see the notes).
- **Editor numbers**: Drake53/War3Net's `GameBuilds.json` (MIT) for the release builds, the maps for 2.0.4 and 3.0.1,
  and the 1.27a/1.27b `worldedit.exe`, which has a function that returns 6059 (`mov eax, 0x17AB`) and no 6052.
- **Game data**: the SLK/TXT files of every patch from 1.24a to 1.29.2 rebuilt from Blizzard's official patch
  installers (each BNUpdate diff applied to the 1.21b base and checked against the target size and CRC); 2.0.4 and
  3.0.1 read from their CASC.

## Format versions per patch

| patch | editor | w3i | wtg / wct | objects | w3e | doo | units | w3r | w3c | w3s | imp | w3l / w3grp |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.00 - 1.06 (RoC) | 4448 - 4654 | 18 | 4 / 0 | 1 | 11 | 7/9 | 7/9 | 5 | 0 | 1 | 0 | - |
| 1.07 - 1.12 | 6031 - 6036 | 25 | 7 / 1 | 1 | 11 | 8/11 | 8/11 | 5 | 0 | 1 | 1 | - |
| 1.13 - 1.23 | 6037 - 6058 | 25 | 7 / 1 | 2 | 11 | 8/11 | 8/11 | 5 | 0 | 1 | 1 | - |
| 1.24a - 1.28.5 | 6059 | 25 | 7 / 1 | 2 | 11 | 8/11 | 8/11 | 5 | 0 | 1 | 1 | - |
| 1.29.x | 6060 | 25 | 7 / 1 | 2 | 11 | 8/11 | 8/11 | 5 | 0 | 1 | 1 | - |
| 1.30.x | 6061 | 25 | 7 / 1 | 2 | 11 | 8/11 | 8/11 | 5 | 0 | 1 | 1 | - |
| 1.31.x | 6072 | 28 | 0x80000004 | 2 | 11 | 8/11 | 8/11 | 5 | 0 + local angles | 1 | 1 | - |
| 1.32.0 - 1.32.3 | 6105 - 6108 | 31 | 0x80000004 | 2 | 11 | 8/11 + skin | 8/11 + skin | 5 | 0 + local angles | not measured | 1 | - |
| 1.32.4 - 1.32.10 | 6109 - 6114 | 31 | 0x80000004 | 2 | 11 | 8/11 + skin | 8/11 + skin | 5 | 0 + local angles | 3 | 1 | - |
| 1.33 - 1.36 | 6114, 6115 | 31 | 0x80000004 | 3 + skin files | 11 | 8/11 + skin | 8/11 + skin | 5 | 0 + local angles | 3 | 1 | - |
| 2.0.0 - 2.0.2 | 6115 | 31 | 0x80000004 | 3 + skin files | 11 | 8/11 + skin | 8/11 + skin | 5 | 0 + local angles | 3 | 1 | - |
| 2.0.3 | 6116 | 33 | 0x80000004 | 3 + skin files | 12 | 8/11 + skin | 8/11 + skin | 5 | 0 + local angles | 3 | 1 | - |
| 2.0.4 | 6117 | 33 | 0x80000004 | 3 + skin files | 12 | 8/11 + skin | 8/11 + skin | 5 | 0 + local angles | 3 | 1 | - |
| 3.0.0 | 7000 | 39 | 0x80000004 | 3 + skin files | 12 | 13/11 | 13/11, 13/9 | 7 | 3 | 3 | 1 | 3 / 0 |
| 3.0.1 | 7003 | 39 | 0x80000004 | 3 + skin files | 12 | 13/11 | 13/11, 13/9 | 7 | 3 | 3 | 1 | 3 / 0 |

`doo` and `units` are version/subversion; the special doodad section of `war3map.doo` is version 0 everywhere.
`0x80000004` means `war3map.wtg` starts with 0x80000004 and then 7 (in a profile: `wtgFormatSubversion` 0x80000004,
`wtgFormatVersion` 7) and `war3map.wct` with 0x80000004 and then 1 (`wctFormatVersion` 0x80000004,
`wctFormatSubversion` 1); the classic files have no second number (0x7FFFFFFF in a profile). The trigger variable
format (`wtgVariableFormatVersion`) is 1 in RoC and 2 from 1.07 on.

Editor number of every patch: 1.00 4448, 1.01 4482, 1.02 4531, 1.03 4572, 1.04 to 1.06 4654, 1.07 6031, 1.10 6034,
1.11 6035, 1.12 6036, 1.13 6037, 1.14 6039, 1.14b 6040, 1.15 6043, 1.16 6046, 1.17 6050, 1.18 6051, 1.19 to 1.21
6052, 1.22 6057, 1.23 6058, 1.24a to 1.28.5 6059, 1.29.x 6060, 1.30.x 6061, 1.31.x 6072, 1.32.0/1.32.1 6105, 1.32.2
6106, 1.32.3 6108, 1.32.4/1.32.5 6109, 1.32.6/1.32.7 6110, 1.32.8 6111, 1.32.9 6112, 1.32.10 to 1.34 6114, 1.35 to
2.0.2 6115, 2.0.3 6116, 2.0.4 6117, 3.0.0 7000, 3.0.1 7003.

Notes:

- **6052 is not 1.24-1.27.** Blizzard's editor writes 6059 from 1.24a to 1.28.5. Most maps of that era still carry
  6052 because they were saved by editors built on the 1.20/1.21 `worldedit.exe`: JNGP, YDWE, KKWE, the JassNative
  Editor (444 of the 447 maps with 6052 measured here have w3i 25 and the TFT formats).
- **Camera local angles** (3 floats per camera in version 0) come with editor 6072 (1.31): none of the cameras of the
  6061 maps have them, all of the 6072 and later ones do. Patchwork's rule (`editorVersion >= 6071`) agrees.
- **The skin field** of doodads and units (the 4 bytes after the scale) comes with 1.32; Patchwork's rule
  (`editorVersion >= 6089`) agrees with every map measured.
- **Objects**: the editor writes version 1 in 1.07 and 2 from 1.13 (1.10 to 1.12 not measured), and version 3 plus the
  `war3mapSkin.*` files from 1.33 (a 1.33 PTR wrote the skin files in version 2). The profiles write 2 for every game
  from 1.13 on, since every one of them reads it, and 1 before that.
- **Units subversion 9 or 11**: the 3.0 editor leaves both (13/9 and 13/11 measured); 11 adds the item table pointer and
  the hero's strength, agility and intelligence, so the profiles write 11.
- **Not re-saved files**: a map keeps the older format of a file its editor did not rewrite. Blizzard's Warchasers in
  2.0.4 has w3e 11 and units x/9 under a 2.0.3 w3i, and a few 3.0 maps keep regions 5 and units 7/9.
- **PTR editor numbers seen in Blizzard's maps**: 6110 and 6113 with game version 1.33.0 (215 ladder maps of 2.0.4),
  6140 with w3i 39 and game version 2.0.4 (one 3.0.1 map).
- 1.32.0 to 1.32.3 sounds were not measured (no map of those builds was found); the profiles keep version 1, which
  every game reads.

## What each format version adds

| file | versions |
|---|---|
| `war3map.w3i` | 18 RoC, 25 TFT; 27 the game version, 28 the script language (1.31), 29 supported modes, 30 game data version, 31 player enemy priorities (1.32); 32 forced default and maximum camera distance, 33 forced minimum camera distance (2.0.3); 34 to 39 HD water, water environment map, fog heights, race crest (and each player's HUD), minimap alpha colour, fog extra (3.0). Map flags by format: 0x20000 accurate probability and 0x40000 custom ability skin (31); 0x80000 no deny icon and 0x100000 to 0x400000 forced camera zoom (33); 0x800000 HD water colour, 0x1000000 alpha tile minimap, 0x2000000 dynamic minimap (39) |
| `war3map.wtg` | 4 RoC, 7 TFT; 0x80000004 (1.31): an element tree with ids and parent ids, deleted-id lists before the variables |
| `war3map.wct` | 0 RoC (no map header script), 1 TFT; 0x80000004 (1.31) |
| object data | 1, 2 (`w3a`/`w3d`/`w3q` modifications carry a level and data pointer); 3 (1.33): each object has sets (count, flag, modifications), and the art and text fields go to the `war3mapSkin.*` twin |
| `war3map.w3e` | 11; 12 (2.0.3): the tile's ground texture and flags take 16 bits (up to 64 ground textures) |
| `war3map.doo` | 7 RoC; 8 TFT (item tables); the skin field from 1.32; 13 (3.0): a group id, a colour, and roll, pitch and point lights per doodad |
| `war3mapUnits.doo` | 7/9 RoC; 8/11 TFT; the skin field from 1.32; 12 and 13 (3.0): a group id after the skin, and roll, pitch and a point light list after the creation number |
| `war3map.w3r` | 5; 7 (3.0): 8 more bytes per region |
| `war3map.w3c` | 0 (+ the 3 local angles from 1.31); 3 (3.0): depth of field, absolute z and the free camera flag |
| `war3map.w3s` | 1; 2 and 3 (Reforged): 11 more strings and ids per sound (dialogue, facial animation), then one more int |
| `war3map.w3l`, `war3map.w3grp` | 3 and 0, only from 3.0 |

## Game data (SLK) per patch

Counts and every id that changes are in [`game-data-changes.json`](game-data-changes.json).

- **1.24a to 1.29.2 have the same objects**: 836 units, 273 items, 799 abilities, 247 buffs, 89 upgrades,
  247 destructables and 469 doodads in every patch, and the same metadata fields except two: 1.29 adds the ability
  fields `Etq4` and `Ocr6`. Between them only values change: 1.24c `TriggerData.txt` (`SaveGameCacheBJ`); 1.25b
  `AbilityData`, `ItemData`, `UnitBalance`, `UpgradeData`; 1.28 `WorldEditData.txt`; 1.29 `TriggerData`,
  `WorldEditData`, `AbilityData`, `AbilityMetaData`, `MiscMetaData`, `UnitBalance`, `UnitWeapons` (whose first column is
  renamed from `unitWeapID` to `serpent`).
- **1.29.2 to 2.0.4** (1.30 to 1.36 are inside this step): +28 units, +10 items, +42 abilities, +6 buffs, +1 upgrade,
  +90 destructables (`DTsb` gone), +100 doodads (`ASbl` gone); fields: unit +6 (`isit`, `ista`, `uabs`, `uhas`, `upor`,
  `usit`), ability +27, misc +4, destructable +1 (`bsnd`), game interface +3.
- **2.0.4 to 3.0.1**: +64 units, +366 items, +715 abilities, +175 buffs, +8 destructables, +204 doodads (`NSra` gone);
  fields: unit +12, ability +185, doodad +8, destructable +4, misc +6, game interface +19.
- **Reforged moved the art out of the SLK tables** (1.29.2 to 3.0.1): `UnitUI` loses 26 columns (`file`, `unitSound`,
  `blend`, `scale`, the shadows, the colours...), `ItemData` 7, `DestructableData` 20, `Doodads` 43 and `UnitWeapons` 11
  (launch and impact offsets, weapon types); those fields live in the skin TXT files. `AbilityData` gains 107 columns
  (`DataJ` to `DataT`, and the level 5+ columns), and every `*MetaData.slk` a `netsafe` column. A map that ships its own
  SLK tables (optimized by w3x2lni or W3Optimizer) is read against these headers.
- `UI\SkinMetaData.slk` exists in every patch: it is the Game Interface table (`war3mapSkin.txt`), not the 1.32+ object
  skins.
- `TriggerData.txt` (events / conditions / actions / calls / types / presets): 1.24a 32 / 31 / 542 / 439 / 189 / 1500;
  1.24c to 1.28.5 one action more; 1.29.2 33 / 32 / 593 / 478 / 191 / 1542; 2.0.4 38 / 32 / 677 / 571 / 241 / 2840;
  3.0.1 38 / 34 / 749 / 624 / 250 / 3284. Nothing is removed from one patch to the next.
- Script API (natives, functions, types and constants of `common.j` and `Blizzard.j`, by the patch they came in,
  jassdoc's `@patch` checked against each patch's files): 1.00 2581, 1.01 +1, 1.03 +4, 1.07 +683, 1.13 +78, 1.15 +10,
  1.17 +112, 1.18 +75, 1.24a +204, 1.29 +123, 1.30 +114, 1.31 +1434, 1.32 +143, 2.0.3 +1, 3.0 +288.

## Other limits per patch

- Players: 12 up to 1.28, 24 from 1.29 (neutral hostile/passive move from 12/15 to 24/27).
- Lua scripts from 1.31.
- The largest map a game sends to other players: 8 MiB up to 1.27a, 128 MiB from 1.27b (measured in each `Game.dll`).
- Models above version 800, DDS textures and FLAC sounds load from 1.32, OGG from 1.30 (War3App's MapAdapter thresholds,
  not measured); the game's own models are version 1200 in 2.0.4 and 1800 in 3.0.1.