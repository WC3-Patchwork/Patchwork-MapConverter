import { WithImplicitCoercion } from "buffer"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const roundTo = require('round-to')

export class W3Buffer {
  private _offset = 0
  private readonly _buffer: Buffer

  constructor (buffer: Buffer) {
    this._buffer = buffer
  }

  public readInt (): number {
    const int: number = this._buffer.readInt32LE(this._offset)
    this._offset += 4
    return int
  }

  public readUint (): number {
    const uint: number = this._buffer.readUInt32LE(this._offset)
    this._offset += 4
    return uint
  }

  public readShort (): number {
    const int: number = this._buffer.readInt16LE(this._offset)
    this._offset += 2
    return int
  }

  public readFloat (): number {
    const float: number = this._buffer.readFloatLE(this._offset)
    this._offset += 4

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return roundTo(float, 3) as number
  }

  public readString (): string {
    const string: number[] = []

    while (this._buffer[this._offset] !== 0x00) {
      string.push(this._buffer[this._offset] ?? 0)
      this._offset += 1
    }
    this._offset += 1 // consume the \0 end-of-string delimiter

    return Buffer.from(string as unknown as WithImplicitCoercion<ArrayBuffer>).toString()
  }

  public readChars (len = 1): string {
    const string: number[] = []
    const numCharsToRead = len

    for (let i = 0; i < numCharsToRead; i++) {
      string.push(this._buffer[this._offset] ?? 0)
      this._offset += 1
    }

    return string.map((ch) => String.fromCharCode(ch)).join('')
  }

  public readByte (): number {
    const byte = this._buffer[this._offset]
    this._offset += 1
    return byte ?? 0
  }

  public isExhausted (): boolean {
    return this._offset === this._buffer.length
  }
}
