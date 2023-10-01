import { type byte } from './DataTypes'

/**
 * @type Bitmask - binary mask for fetching boolean value from a byte.
 */
export type bitmask = byte

export class PropertyFlags {
  private readonly value: byte
  constructor (byte: byte) {
    this.value = byte
  }

  readFlag (flagMask: bitmask): boolean {
    return (flagMask & this.value) > 0
  }
}
