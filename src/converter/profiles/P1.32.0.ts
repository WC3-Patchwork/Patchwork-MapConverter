import { TargetProfile } from '../Profile'
import { P1310 } from './P1.31.0'

// 1.32 (Reforged) to 1.36: map info 31; doodads and units gain the skin field (editor 6089 and later). Sounds are
// version 3 from 1.32.4 on (measured); 1.32.0 to 1.32.3 were not measured and keep version 1, which they read
export const P1320: TargetProfile = { ...P1310, editorVersion: 6105, w3iFormatVersion: 31 }
export const P1322: TargetProfile = { ...P1320, editorVersion: 6106 }
export const P1323: TargetProfile = { ...P1320, editorVersion: 6108 }
export const P1324: TargetProfile = { ...P1320, editorVersion: 6109, w3sFormatVersion: 3 }
export const P1326: TargetProfile = { ...P1324, editorVersion: 6110 }
export const P1328: TargetProfile = { ...P1324, editorVersion: 6111 }
export const P1329: TargetProfile = { ...P1324, editorVersion: 6112 }
export const P13210: TargetProfile = { ...P1324, editorVersion: 6114 }
// the editors of 1.33 and later write object data version 3 and the war3mapSkin.* files; version 2 is read by every
// game since 1.13, so it stays
export const P1330: TargetProfile = { ...P13210, editorVersion: 6114 } // 1.33 and 1.34
export const P1350: TargetProfile = { ...P13210, editorVersion: 6115 } // 1.35 and 1.36