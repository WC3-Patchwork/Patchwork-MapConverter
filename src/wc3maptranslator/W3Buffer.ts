import { roundTo } from '@/util/round'

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

  public readShort (): number {
    const int: number = this._buffer.readInt16LE(this._offset)
    this._offset += 2
    return int
  }

  public readFloat (): number {
    const float: number = this._buffer.readFloatLE(this._offset)
    this._offset += 4
    return roundTo(float, 3)
  }

  public readString (): string {
    const start = this._offset;
    let len = 0;
    let ch = this._buffer.at(this._offset);

    while (ch !== undefined && ch > 0x00) {
      len += 1;
      this._offset += 1
      ch = this._buffer.at(this._offset);
    }
    this._offset += 1 // consume the \0 end-of-string delimiter

    const buf = Buffer.allocUnsafe(len+1);
    this._buffer.copy(buf, 0, start, this._offset);

    return buf.toString();
  }

  public readChars (len = 1): string {
    if (len == 1){
      const ch = this._buffer.at(this._offset);
      if (ch === undefined) return '';
      return String.fromCharCode(ch);
    }

    const buf = Buffer.allocUnsafe(len);
    const byteRead = this._buffer.copy(buf, 0, this._offset, this._offset + len);

    //TODO check if byte read less then len and do shit

    this._offset += byteRead;
    const arr: string[] = [];

    buf.forEach(ch=>
      //ch === 0x00 ? arr.push('0') :
      // Curse spell has a "Crs" field, whose 4th byte is probably a 0x0, and not a "0",
      // causing the editor to just ignore this change when converting back...
      arr.push(String.fromCharCode(ch))
    );

    return arr.join('');
  }

  public readByte (): number {
    const byte = this._buffer.readUInt8(this._offset);
    this._offset += 1
    return byte
  }

  public isExhausted (): boolean {
    return this._offset === this._buffer.length
  }
}
