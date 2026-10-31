import { TargetProfile } from "../Profile"

// Reign of Chaos 1.00 to 1.06: what its World Editor writes (measured on the RoC maps that ship with 1.28.5 and 1.29.2)
export const P1000: TargetProfile = {
  editorVersion: 4448,
  impFormatVersion: 0,
  wtgFormatVersion: 4,
  wtgFormatSubversion: 0x7FFFFFFF, // classic layout, no 0x80000004 header
  wtgVariableFormatVersion: 1,
  wctFormatVersion: 0,
  wctFormatSubversion: 0x7FFFFFFF,
  w3iFormatVersion: 18,
  objectFormatVersion: 1,
  w3eFormatVersion: 11,
  unitsDooFormatVersion: 7,
  unitsDooFormatSubversion: 9,
  dooFormatVersion: 7,
  dooFormatSubversion: 9,
  specialDooFormatVersion: 0,
  w3rFormatVersion: 5,
  w3cFormatVersion: 0,
  w3sFormatVersion: 1,
  w3lFormatVersion: undefined,
  w3grpFormatVersion: undefined
}

export const P1010: TargetProfile = { ...P1000, editorVersion: 4482 }
export const P1020: TargetProfile = { ...P1010, editorVersion: 4531 }
export const P1030: TargetProfile = { ...P1020, editorVersion: 4572 }
export const P1040: TargetProfile = { ...P1030, editorVersion: 4654 } // 1.04 to 1.06

// The Frozen Throne 1.07 to 1.30: the classic formats. Only the editor number changes, and the object data goes from
// version 1 (1.07) to 2 (1.13; 1.10 to 1.12 not measured, so they keep 1, which every later game reads too)
export const P1070: TargetProfile = {
  editorVersion: 6031,
  impFormatVersion: 1,
  wtgFormatVersion: 7,
  wtgFormatSubversion: 0x7FFFFFFF, // classic layout, no 0x80000004 header
  wtgVariableFormatVersion: 2,
  wctFormatVersion: 1,
  wctFormatSubversion: 0x7FFFFFFF,
  w3iFormatVersion: 25,
  objectFormatVersion: 1,
  w3eFormatVersion: 11,
  unitsDooFormatVersion: 8,
  unitsDooFormatSubversion: 11,
  dooFormatVersion: 8,
  dooFormatSubversion: 11,
  specialDooFormatVersion: 0,
  w3rFormatVersion: 5,
  w3cFormatVersion: 0,
  w3sFormatVersion: 1,
  w3lFormatVersion: undefined,
  w3grpFormatVersion: undefined
}

export const P1100: TargetProfile = { ...P1070, editorVersion: 6034 }
export const P1110: TargetProfile = { ...P1100, editorVersion: 6035 }
export const P1120: TargetProfile = { ...P1110, editorVersion: 6036 }
export const P1130: TargetProfile = { ...P1120, editorVersion: 6037, objectFormatVersion: 2 }
export const P1140: TargetProfile = { ...P1130, editorVersion: 6039 }
export const P1141: TargetProfile = { ...P1140, editorVersion: 6040 } // 1.14b
export const P1150: TargetProfile = { ...P1141, editorVersion: 6043 }
export const P1160: TargetProfile = { ...P1150, editorVersion: 6046 }
export const P1170: TargetProfile = { ...P1160, editorVersion: 6050 }
export const P1180: TargetProfile = { ...P1170, editorVersion: 6051 }
export const P1190: TargetProfile = { ...P1180, editorVersion: 6052 } // 1.19 to 1.21, and the editors built on it (JNGP, YDWE, KKWE)
export const P1220: TargetProfile = { ...P1190, editorVersion: 6057 }
export const P1230: TargetProfile = { ...P1220, editorVersion: 6058 }
export const P1240: TargetProfile = { ...P1230, editorVersion: 6059 } // 1.24a to 1.28.5
export const P1290: TargetProfile = { ...P1240, editorVersion: 6060 } // 24 players, same formats
export const P1300: TargetProfile = { ...P1290, editorVersion: 6061 }

// 1.31: map info 28 (game version, script language) and the 0x80000004 trigger files; cameras gain the local angles
// (editor 6071 and later)
export const P1310: TargetProfile = {
  ...P1300,
  editorVersion: 6072,
  wtgFormatVersion: 7,
  wtgFormatSubversion: 2147483652,
  wtgVariableFormatVersion: 2,
  wctFormatVersion: 2147483652,
  wctFormatSubversion: 1,
  w3iFormatVersion: 28
}

// 1.32 (Reforged) to 1.36: map info 31; doodads and units gain the skin field (editor 6089 and later). Sounds are
// version 3 from 1.32.4 on (measured); 1.32.0 to 1.32.3 were not measured and keep version 1, which they read
export const P1320: TargetProfile = { ...P1310, editorVersion: 6105, w3iFormatVersion: 31 }
export const P1322: TargetProfile = { ...P1320, editorVersion: 6106 }
export const P1323: TargetProfile = { ...P1322, editorVersion: 6108 }
export const P1324: TargetProfile = { ...P1323, editorVersion: 6109, w3sFormatVersion: 3 }
export const P1326: TargetProfile = { ...P1324, editorVersion: 6110 }
export const P1328: TargetProfile = { ...P1326, editorVersion: 6111 }
export const P1329: TargetProfile = { ...P1328, editorVersion: 6112 }
export const P13210: TargetProfile = { ...P1329, editorVersion: 6114 }

// the editors of 1.33 and later write object data version 3 and the war3mapSkin.* files; version 2 is read by every
// game since 1.13, so it stays
export const P1330: TargetProfile = { ...P13210, editorVersion: 6114, objectFormatVersion: 3 } // 1.33 and 1.34
export const P1350: TargetProfile = { ...P1330, editorVersion: 6115 } // 1.35 and 1.36

// 2.0.0 to 2.0.2 keep the 1.36 formats and editor number
export const P2000: TargetProfile = { ...P1350 }

// 2.0.3: map info 33 and terrain 12
export const P2030: TargetProfile = {
  editorVersion: 6116,
  impFormatVersion: 1,
  wtgFormatVersion: 7,
  wtgFormatSubversion: 2147483652,
  wtgVariableFormatVersion: 2,
  wctFormatVersion: 2147483652,
  wctFormatSubversion: 1,
  w3iFormatVersion: 33,
  objectFormatVersion: 3,
  w3eFormatVersion: 12,
  unitsDooFormatVersion: 8,
  unitsDooFormatSubversion: 11,
  dooFormatVersion: 8,
  dooFormatSubversion: 11,
  specialDooFormatVersion: 0,
  w3rFormatVersion: 5,
  w3cFormatVersion: 0,
  w3sFormatVersion: 3,
  w3lFormatVersion: undefined,
  w3grpFormatVersion: undefined
}

// 2.0.4 (2.0.4.23745, the last build before 3.0)
export const P2040: TargetProfile = { ...P2030, editorVersion: 6117 }

export const P3000: TargetProfile = {
  editorVersion: 7000,
  impFormatVersion: 1,
  wtgFormatVersion: 7,
  wtgFormatSubversion: 2147483652,
  wtgVariableFormatVersion: 2,
  wctFormatVersion: 2147483652,
  wctFormatSubversion: 1,
  w3iFormatVersion: 39,
  objectFormatVersion: 3,
  w3eFormatVersion: 12,
  unitsDooFormatVersion: 13,
  unitsDooFormatSubversion: 11,
  dooFormatVersion: 13,
  dooFormatSubversion: 11,
  specialDooFormatVersion: 0,
  w3rFormatVersion: 7,
  w3cFormatVersion: 3,
  w3sFormatVersion: 3,
  w3lFormatVersion: 3,
  w3grpFormatVersion: 0
}

// 3.0.1 (3.0.1.24371)
export const P3010: TargetProfile = { ...P3000, editorVersion: 7003 }