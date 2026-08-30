import { WithImplicitCoercion } from 'buffer'
import ieee754 from 'ieee754'

//unsigned or signed doesn't matter for output, but let's keep it here for lolz
function int2Hex(num: number, isShort = false, unsigned: boolean) {
  const bits = isShort ? 16 : 32;
  const mask = (1n << BigInt(bits)) - 1n;
  const val = BigInt(num) & mask;
  const width = bits / 4;
  const hex = val.toString(16).padStart(width, '0').toUpperCase();

  // split into bytes and reverse
  return hex.match(/.{2}/g)!.reverse().join('');
}
const charToHex = (character: string): string => {
  return `0x${character.charCodeAt(0).toString(16)}`
}

export class HexBuffer {
  private readonly _buffer: string[] = []

  public addString(str: string): void {
    this.addStringNoNullTerminator(str)
    this.addNullTerminator()
  }

  // as opposed to addChar(s) it can handle any unicode char instead of blindly converting to ascii, thus loosing data.
  public addStringNoNullTerminator(str: string): void {
    // Write each char to the buffer
    // "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2"
    // | "ucs-2" | "base64" | "latin1" | "binary" | "hex"
    const buf = Buffer.from(str, 'utf-8')

    for (const byte of buf) {
      this._buffer.push(`0x${byte.toString(16) ?? '\0'}`)
    }
  }

  public addNewLine(): void {
    this._buffer.push('0x0d') // carriage return
    this._buffer.push('0x0a') // line feed
  }

  public addChar(char: string): void {
    this._buffer.push(charToHex(char))
  }

  public addChars(chars: string): void {
    chars.split('').forEach((char) => {
      this.addChar(char)
    })
  }

  public addInt (int: number, isShort = false): void {
    this._buffer.push(... int2Hex(int, isShort, false))
  }

  public addUInt(int: number, isShort = false): void {
    this._buffer.push(...int2Hex(int, isShort, true))
  }

  public addShort(short: number): void {
    this.addInt(short, true)
  }

  public addFloat(float: number): void {
    const buf = Buffer.alloc(4)

    // ieee754.write(buffer, value, buffer offset, little-endian, mantissa length, bytes);
    ieee754.write(buf as Uint8Array, float, 0, true, 23, 4)

    buf.forEach(byte => this._buffer.push(`0x${byte.toString(16)}`))
  }

  public addByte(byte: number): void {
    this._buffer.push(`0x${byte.toString(16)}`)
  }

  public addNullTerminator(): void {
    this._buffer.push('0x0')
  }

  public getBuffer(): Buffer {
    return Buffer.from(this._buffer as unknown as WithImplicitCoercion<string>, 'hex')
  }
}