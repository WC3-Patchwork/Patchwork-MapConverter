import { type integer } from './DataTypes'

export class FourCC {
  public readonly integerRep: integer
  public readonly codeRep: string

  private constructor (codeRep: string, integerRep: integer) {
    this.integerRep = integerRep
    this.codeRep = codeRep
  }

  public static fromCode (codeRep: string): FourCC {
    if (codeRep.length !== 4) {
      throw new Error(`Invalid FourCC code: ${codeRep}`)
    }
    const intRep = Number(codeRep.charCodeAt(0)) << 24 + Number(codeRep.charCodeAt(1)) << 16 + Number(codeRep.charCodeAt(2)) << 8 + Number(codeRep.charCodeAt(3))

    return new FourCC(codeRep, intRep)
  }

  public static fromInt (intRep: integer): FourCC {
    const codeRep: string[] = []

    for (let i = 0; i < 4; i++) {
      codeRep.push(String.fromCharCode(intRep % 256))
      intRep = intRep >> 8
    }

    return new FourCC(codeRep.reverse().join(), intRep)
  }
}
