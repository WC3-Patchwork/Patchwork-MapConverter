import { TargetProfile } from '../Profile'
import { P1350 } from './P1.32.0'

// 2.0.0 to 2.0.2 keep the 1.36 formats and editor number
export const P2000: TargetProfile = { ...P1350 }

// 2.0.3: map info 33 and terrain 12
export const P2003: TargetProfile = {
  editorVersion: 6116,
  impFormatVersion: 1,
  wtgFormatVersion: 7,
  wtgFormatSubversion: 2147483652,
  wtgVariableFormatVersion: 2,
  wctFormatVersion: 2147483652,
  wctFormatSubversion: 1,
  w3iFormatVersion: 33,
  objectFormatVersion: 2, // the editor writes 3; 2 is read by every game since 1.13
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
export const P2004: TargetProfile = { ...P2003, editorVersion: 6117 }