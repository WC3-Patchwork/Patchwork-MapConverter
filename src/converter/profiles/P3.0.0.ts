import { TargetProfile } from '../Profile'

export const P3000: TargetProfile = {
  editorVersion: 7000,
  impFormatVersion: 1,
  wtgFormatVersion: 7,
  wtgFormatSubversion: 2147483652,
  wtgVariableFormatVersion: 2,
  wctFormatVersion: 2147483652,
  wctFormatSubversion: 1,
  w3iFormatVersion: 39,
  objectFormatVersion: 2, // the editor writes 3; 2 is read by every game since 1.13
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
export const P3001: TargetProfile = { ...P3000, editorVersion: 7003 }