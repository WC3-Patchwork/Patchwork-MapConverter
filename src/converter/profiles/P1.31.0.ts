import { TargetProfile } from '../Profile'
import { P1300 } from './P1.7.0'

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