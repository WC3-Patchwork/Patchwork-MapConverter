/*
  war3map.imp file format consists of following:
  [integer] file version (always 01 00 00 00)
  [integer] x = number of imports
    for each x do
    [byte] assetType
    [string] assetPath
  end

  AssetType determines if the standard import path has been changed or not (if path starts with "war3mapImported\")
*/

import { type integer } from '../common/DataTypes'

export class AssetType {
  static readonly STANDARD = new AssetType(8, 'standard')
  static readonly CUSTOM = new AssetType(13, 'custom')

  readonly ordinal: integer
  readonly text: string

  private constructor (ordinal: integer, text: string) {
    this.ordinal = ordinal
    this.text = text
  }

  // 0: AssetType.Standard,
  // 5: AssetType.Standard,
  // 8: AssetType.Standard, // * preferred
  // 10: AssetType.Custom,
  // 13: AssetType.Custom // * preferred
  public static fromOrdinal (ordinal: integer): AssetType {
    switch (ordinal) {
      case 0:
      case 5:
      case this.STANDARD.ordinal:
        return this.STANDARD
      case 10:
      case this.CUSTOM.ordinal:
        return this.CUSTOM
      default:
        throw new Error(`AssetType with ordinal '${ordinal}' not recognized!`)
    }
  }

  public static fromText (text: string): AssetType {
    switch (text.trim().toLowerCase()) {
      case this.STANDARD.text:
        return this.STANDARD
      case this.CUSTOM.text:
        return this.CUSTOM
      default:
        throw new Error(`AssetType '${text}' not recognized!`)
    }
  }
}

export interface Asset {
  path: string
  type: AssetType
}
