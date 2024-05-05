import KaitaiStream from "kaitai-struct";

export class WritableKaitaiStream extends KaitaiStream {
    public constructor(byteOffset: number | undefined) {
        super(new ArrayBuffer(64), byteOffset)
        this.maxSize = 64;
    }

    private maxSize: number;

    private upsizeIfNeeded(additionalBytes: number) {
        while (this.pos + additionalBytes > this.maxSize) {
            this.maxSize *= 2
        }
        this.buffer.resize(this.maxSize);
    }

    // ------------------------------------------------------------------------
    // Signed
    // ------------------------------------------------------------------------

    /**
     Write an 8-bit signed int to the stream.
    @return {number} The read number.
    */
    public writeS1(S1: number) {
        this.upsizeIfNeeded(1);
        this.dataView.setInt8(this.pos++, S1)
    };

    // ........................................................................
    // Big-endian
    // ........................................................................

    /**
     Reads a 16-bit big-endian signed int from the stream.
    @return {number} The read number.
    */
    public writeS2be(S2be: number) {
        this.upsizeIfNeeded(2);
        this.dataView.setInt16(this.pos += 2, S2be)
    };

    /**
     Reads a 32-bit big-endian signed int from the stream.
    @return {number} The read number.
    */
    public writeS4be(S4be: number) {
        this.upsizeIfNeeded(4);
        this.dataView.setInt32(this.pos += 4, S4be);
    };

    /**
     Reads a 64-bit big-endian unsigned int from the stream. Note that
    JavaScript does not support 64-bit integers natively, so it will
    automatically upgrade internal representation to use IEEE 754
    double precision float.
    @return {number} The read number.
    */
    public writeS8be(S8be: number) {
        throw "Not supported!"
    };

    // ........................................................................
    // Little-endian
    // ........................................................................

    /**
     Reads a 16-bit little-endian signed int from the stream.
    @return {number} The read number.
    */
    public writeS2le(S2le: number) {
        this.ensureBytesLeft(2);
        this.dataView.setInt16(this.pos += 2, S2le, true);
    };

    /**
     Reads a 32-bit little-endian signed int from the stream.
    @return {number} The read number.
    */
    public writeS4le(S4le: number) {
        this.ensureBytesLeft(4);
        this.dataView.setInt16(this.pos += 4, S4le, true);
    };

    /**
     Reads a 64-bit little-endian unsigned int from the stream. Note that
    JavaScript does not support 64-bit integers natively, so it will
    automatically upgrade internal representation to use IEEE 754
    double precision float.
    @return {number} The read number.
    */
    public writeS8le(S8le: number) {
        throw "Not supported"
    };

    // ------------------------------------------------------------------------
    // Unsigned
    // ------------------------------------------------------------------------

    /**
     Reads an 8-bit unsigned int from the stream.
    @return {number} The read number.
    */
    public writeU1(U1: number) {
        this.ensureBytesLeft(1);
        this.dataView.setUint8(this.pos += 1, U1);
    };

    // ........................................................................
    // Big-endian
    // ........................................................................

    /**
     Reads a 16-bit big-endian unsigned int from the stream.
    @return {number} The read number.
    */
    public writeU2be(U2be: number) {
        this.ensureBytesLeft(2);
        this.dataView.setUint16(this.pos += 2, U2be);
    };

    /**
     Reads a 32-bit big-endian unsigned int from the stream.
    @return {number} The read number.
    */
    public writeU4be(U4be: number) {
        this.ensureBytesLeft(4);
        this.dataView.setUint32(this.pos += 4, U4be);
    };

    /**
     Reads a 64-bit big-endian unsigned int from the stream. Note that
    JavaScript does not support 64-bit integers natively, so it will
    automatically upgrade internal representation to use IEEE 754
    double precision float.
    @return {number} The read number.
    */
    public writeU8be(U8be: number) {
        throw "Not supported";
    };

    // ........................................................................
    // Little-endian
    // ........................................................................

    /**
     Reads a 16-bit little-endian unsigned int from the stream.
    @return {number} The read number.
    */
    public writeU2le(U2le: number) {
        this.ensureBytesLeft(2);
        this.dataView.setUint16(this.pos += 2, U2le, true);
    };

    /**
     Reads a 32-bit little-endian unsigned int from the stream.
    @return {number} The read number.
    */
    public writeU4le(U4le: number) {
        this.ensureBytesLeft(4);
        this.dataView.setUint16(this.pos += 4, U4le, true);
    };

    /**
     Reads a 64-bit little-endian unsigned int from the stream. Note that
    JavaScript does not support 64-bit integers natively, so it will
    automatically upgrade internal representation to use IEEE 754
    double precision float.
    @return {number} The read number.
    */
    public writeU8le(U8le: number) {
        throw "Not supported";
    };

    // ========================================================================
    // Floating point numbers
    // ========================================================================

    // ------------------------------------------------------------------------
    // Big endian
    // ------------------------------------------------------------------------

    public writeF4be(F4be: number) {
        this.ensureBytesLeft(4);
        this.dataView.setFloat32(this.pos += 4, F4be);
    };

    public writeF8be(F8be: number) {
        this.ensureBytesLeft(8);
        this.dataView.setFloat64(this.pos += 8, F8be);
    };

    // ------------------------------------------------------------------------
    // Little endian
    // ------------------------------------------------------------------------

    public writeF4le(F4le: number) {
        this.ensureBytesLeft(4);
        this.dataView.setFloat32(this.pos += 4, F4le, true);
    };

    public writeF8le(F8le: number) {
        this.ensureBytesLeft(8);
        this.dataView.setFloat64(this.pos += 8, F8le, true);
    };


    /*
    bitsLeft = 3
        \  \  bitsNeeded = 10 -> bytesNeeded = 2
         \  \ /         \
    |01101xxx|xxxxxxxx|xx......|
           \             /\     \
            \__ n = 13 _/  \     \
                        new bitsLeft = 6
    */
    public writeBitsIntBe(n: number, IntBe: number) {
        // JS only supports bit operations on 32 bits
        if (n > 32) {
            throw new RangeError("writeBitsIntBe: the maximum supported bit length is 32 (tried to read " + n + " bits)");
        }
        let res = 0;
        const overWriteFirstByte = this.bitsLeft > 0

        const bitsNeeded = n - this.bitsLeft;
        this.bitsLeft = -bitsNeeded & 7; // `-bitsNeeded mod 8`

        if (bitsNeeded > 0) {
            // 1 bit  => 1 byte
            // 8 bits => 1 byte
            // 9 bits => 2 bytes
            var bytesNeeded = ((bitsNeeded - 1) >> 3) + 1; // `ceil(bitsNeeded / 8)` (NB: `x >> 3` is `floor(x / 8)`)
            var buf = this.readBytes(bytesNeeded);
            for (let i = 0; i < bytesNeeded; i++) {
                res = res << 8 | buf[i];
            }

            var newBits = res;
            res = res >>> this.bitsLeft | this.bits << bitsNeeded; // `x << 32` is defined as `x << 0` in JS, but only `0 << 32`
            // can occur here (`n = 32` and `bitsLeft = 0`, this implies
            // `bits = 0` unless changed externally)
            this.bits = newBits; // will be masked at the end of the function
        } else {
            res = this.bits >>> -bitsNeeded; // shift unneeded bits out
        }

        var mask = (1 << this.bitsLeft) - 1; // `bitsLeft` is in range 0..7, so `(1 << 32)` does not have to be considered
        this.bits &= mask;

        // always return an unsigned 32-bit integer
        return res >>> 0;
    };

    /*
        n = 13       bitsNeeded = 10
                        /       \
    bitsLeft = 3  ______       __
        \  \      /      \      \ \
        |xxx01101|xxxxxxxx|......xx|
                        \    /
                        new bitsLeft = 6

            bitsLeft = 7
                \      \
        |01101100|..xxxxx1|........|
                    \___/
                    n = 5
    */
    public readBitsIntLe(n: number): number { };

    // ========================================================================
    // Byte arrays
    // ========================================================================

    public writeBytes(bytes: number[]) {
        this.upsizeIfNeeded(bytes.length);
        for (const byte of bytes) {
            this.dataView.setUint8(this.byteOffset + this.pos++, byte)
        }
    };

    public writeString(str: string, encoding: BufferEncoding | undefined) {
        encoding = encoding != null ? encoding : 'utf-8';
        const buf = Buffer.from(str, encoding);

        this.upsizeIfNeeded(buf.byteLength + 1);
        for (let i = 0; i < buf.length; i++) {
            this.dataView.setUint8(this.byteOffset + this.pos++, buf[i]);
        }
        this.dataView.setUint8(this.byteOffset + this.pos++, 0);
    };

}