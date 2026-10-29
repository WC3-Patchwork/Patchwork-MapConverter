import { TargetProfile } from '../Profile'

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
export const P1110: TargetProfile = { ...P1070, editorVersion: 6035 }
export const P1120: TargetProfile = { ...P1070, editorVersion: 6036 }
export const P1130: TargetProfile = { ...P1070, editorVersion: 6037, objectFormatVersion: 2 }
export const P1140: TargetProfile = { ...P1130, editorVersion: 6039 }
export const P1141: TargetProfile = { ...P1130, editorVersion: 6040 } // 1.14b
export const P1150: TargetProfile = { ...P1130, editorVersion: 6043 }
export const P1160: TargetProfile = { ...P1130, editorVersion: 6046 }
export const P1170: TargetProfile = { ...P1130, editorVersion: 6050 }
export const P1180: TargetProfile = { ...P1130, editorVersion: 6051 }
export const P1190: TargetProfile = { ...P1130, editorVersion: 6052 } // 1.19 to 1.21, and the editors built on it (JNGP, YDWE, KKWE)
export const P1220: TargetProfile = { ...P1130, editorVersion: 6057 }
export const P1230: TargetProfile = { ...P1130, editorVersion: 6058 }
export const P1240: TargetProfile = { ...P1130, editorVersion: 6059 } // 1.24a to 1.28.5
export const P1290: TargetProfile = { ...P1130, editorVersion: 6060 } // 24 players, same formats
export const P1300: TargetProfile = { ...P1130, editorVersion: 6061 }