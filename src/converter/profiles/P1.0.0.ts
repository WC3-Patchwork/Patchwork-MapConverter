import { TargetProfile } from '../Profile'

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
export const P1020: TargetProfile = { ...P1000, editorVersion: 4531 }
export const P1030: TargetProfile = { ...P1000, editorVersion: 4572 }
export const P1040: TargetProfile = { ...P1000, editorVersion: 4654 } // 1.04 to 1.06