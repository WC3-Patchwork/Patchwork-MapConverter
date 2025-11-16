import { type integer } from '../wc3maptranslator/CommonInterfaces'

type PaddedDoubleDigitString = string

function ConvertToPaddedDoubleDigitString (data: integer[]): PaddedDoubleDigitString {
  const result: string[] = []
  for (const bit of data) {
    if (bit >= 0 && bit <= 9) {
      result.push('0')
    }
    result.push(bit.toFixed(0).substring(0, 2)) // just to make sure
  }
  return result.join('')
}

function ConvertFromPaddedDoubleDigitString (stringData: PaddedDoubleDigitString): integer[] {
  const result: integer[] = []
  for (let i = 0; i < stringData.length - 1; i += 2) {
    const bit = stringData.substring(i, i + 2)
    result.push(Number.parseInt(bit))
  }
  return result
}

type SingleDigitString = string

function ConvertToSingleDigitString (data: integer[]): SingleDigitString {
  const result: string[] = []
  for (const bit of data) {
    result.push(bit.toFixed(0).substring(0, 1)) // just to make sure
  }
  return result.join('')
}

function ConvertFromSingleDigitString (stringData: SingleDigitString): integer[] {
  const result: integer[] = []
  for (let i = 0; i < stringData.length; i++) {
    const bit = stringData.substring(i, i + 1)
    result.push(Number.parseInt(bit))
  }
  return result
}

type BinaryDigitString = string

function ConvertToBinaryDigitString (data: boolean[]): BinaryDigitString {
  const result: string[] = []
  for (const bit of data) {
    result.push(bit ? '1' : '0')
  }
  return result.join('')
}

function ConvertFromBinaryDigitString (stringData: BinaryDigitString): boolean[] {
  const result: boolean[] = []
  for (let i = 0; i < stringData.length; i++) {
    const bit = stringData.substring(i, i + 1)
    result.push(bit === '1')
  }
  return result
}

type CSVString = string

function ConvertToCSVString (data: unknown[]): CSVString {
  return data.join(',')
}

function ConvertFromCSVString<T> (stringData: CSVString, parser: (data: string) => T): T[] {
  const result: T[] = []
  for (const data of stringData.split(',')) {
    result.push(parser(data))
  }
  return result
}

export {
  ConvertToPaddedDoubleDigitString,
  ConvertFromPaddedDoubleDigitString,
  ConvertFromSingleDigitString,
  ConvertToSingleDigitString,
  ConvertToBinaryDigitString,
  ConvertFromBinaryDigitString,
  ConvertToCSVString,
  ConvertFromCSVString
}
export type { PaddedDoubleDigitString, SingleDigitString, BinaryDigitString, CSVString }
