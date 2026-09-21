import { color, integer } from "./CommonInterfaces"

export function deg2Rad(angleInDegrees: number): number {
  return angleInDegrees * Math.PI / 180
}

export function rad2Deg(angleInRadians: number): number {
  return angleInRadians * 180 / Math.PI
}

export function mergeBoolRecords<T extends Record<string, boolean>>(src: T, backup: T): T {
  if (src == null) {
    return { ...backup }
  } else {
    return { ...backup, ...src }
  }
}

function bytesToHexString(...byteArray: integer[]): string {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

function hexStringToBytes(hex: string): integer[] {
  const bytes: integer[] = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substring(c, c + 2), 16))
  }
  return bytes
}

// json wants it in ARGB, but binary files store it as BB GG RR AA
export function colorBytesToHex(blue: integer, green: integer, red: integer, alpha: integer): color {
  return `#${bytesToHexString(alpha, red, green, blue)}`
}

// The order in binary is BB GG RR AA, whereas the JSON spec order is #AARRGGBB
export function colorHexToBytes(hex: color): [integer, integer, integer, integer] {
  if (hex.startsWith('#') && hex.length === 9) {
    return hexStringToBytes(hex.substring(1)).reverse() as [integer, integer, integer, integer]
  } else {
    throw new Error(`Unable to parse ${hex} as color, expected '#AARRGGBB' format!`)
  }
}