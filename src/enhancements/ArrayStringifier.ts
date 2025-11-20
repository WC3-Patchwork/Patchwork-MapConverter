import { type integer } from '../wc3maptranslator/CommonInterfaces'

type PaddedDoubleDigitString = string
type SingleDigitString = string
type BinaryDigitString = string
type CSVString = string

const ArrayStringifier = {
  ConvertToPaddedDoubleDigitString: function(data: integer[]): PaddedDoubleDigitString {
    const result: string[] = []
    for (const bit of data) {
      if (bit >= 0 && bit <= 9) {
        result.push('0')
      }
      result.push(bit.toFixed(0).substring(0, 2)) // just to make sure
    }
    return result.join('')
  },

  ConvertFromPaddedDoubleDigitString: function(stringData: PaddedDoubleDigitString): integer[] {
    const result: integer[] = []
    for (let i = 0; i < stringData.length - 1; i += 2) {
      const bit = stringData.substring(i, i + 2)
      result.push(Number.parseInt(bit))
    }
    return result
  },

  ConvertToSingleDigitString: function(data: integer[]): SingleDigitString {
    const result: string[] = []
    for (const bit of data) {
      result.push(bit.toFixed(0).substring(0, 1)) // just to make sure
    }
    return result.join('')
  },

  ConvertFromSingleDigitString: function(stringData: SingleDigitString): integer[] {
    const result: integer[] = []
    for (let i = 0; i < stringData.length; i++) {
      const bit = stringData.substring(i, i + 1)
      result.push(Number.parseInt(bit))
    }
    return result
  },

  ConvertToBinaryDigitString: function(data: boolean[]): BinaryDigitString {
    const result: string[] = []
    for (const bit of data) {
      result.push(bit ? '1' : '0')
    }
    return result.join('')
  },

  ConvertFromBinaryDigitString: function(stringData: BinaryDigitString): boolean[] {
    const result: boolean[] = []
    for (let i = 0; i < stringData.length; i++) {
      const bit = stringData.substring(i, i + 1)
      result.push(bit === '1')
    }
    return result
  },

  ConvertToCSVString: function(data: unknown[]): CSVString {
    return data.join(',')
  },

  ConvertFromCSVString: function<T>(stringData: CSVString, parser: (data: string) => T): T[] {
    const result: T[] = []
    for (const data of stringData.split(',')) {
      result.push(parser(data))
    }
    return result
  }
}
export { ArrayStringifier }
export type { PaddedDoubleDigitString, SingleDigitString, BinaryDigitString, CSVString }