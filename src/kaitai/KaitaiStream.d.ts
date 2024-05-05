declare module "kaitai-struct" {
    export default class KaitaiStream {
        /**
         Dependency configuration data. Holds urls for (optional) dynamic loading
        of code dependencies from a remote server. For use by (static) processing functions.

        Caller should the supported keys to the asset urls as needed.
        NOTE: `depUrls` is a static property of KaitaiStream (the factory),like the various
                processing functions. It is NOT part of the prototype of instances.
        @type {Object}
        */
        static depUrls: unknown

        /**
         Virtual byte length of the KaitaiStream backing buffer.
        Updated to be max of original buffer size and last written size.
        If dynamicSize is false is set to buffer size.
        @type {number}
        */
        private _byteLength: number

        protected pos: number;
        protected bits: number;
        protected bitsLeft: number;

        /**
         Set/get the byteOffset of the KaitaiStream object.
        The setter updates the DataView to point to the new byteOffset.
        @type {number}
        */
        public set byteOffset(val: number): number
        public get byteOffset(): number

        /**
         Set/get the backing ArrayBuffer of the KaitaiStream object.
        The setter updates the DataView to point to the new buffer.
        @type {ArrayBuffer}
        */
        public set buffer(val: ArrayBuffer): ArrayBuffer
        public get buffer(): ArrayBuffer

        /**
         Set/get the backing DataView of the KaitaiStream object.
        The setter updates the buffer and byteOffset to point to the DataView values.
        @type {DataView}
        */
        public set dataView(val: DataView): DataView
        public get dataView(): DataView

        /**
         Internal function to trim the KaitaiStream buffer when required.
        Used for stripping out the extra bytes from the backing buffer when
        the virtual byteLength is smaller than the buffer byteLength (happens after
        growing the buffer with writes and not filling the extra space completely).

        @return {null}
        */
        private _trimAllocfunction(): null

        /**
          KaitaiStream is an implementation of Kaitai Struct API for JavaScript.
          Based on DataStream - https://github.com/kig/DataStream.js
        
          @param {ArrayBuffer} arrayBuffer ArrayBuffer to read from.
          @param {?Number} byteOffset Offset from arrayBuffer beginning for the KaitaiStream.
          */
        public constructor(arrayBuffer: ArrayBuffer, byteOffset: number|undefined)

        // ========================================================================
        // Stream positioning
        // ========================================================================

        /**
         Returns true if the KaitaiStream seek pointer is at the end of buffer and
        there's no more data to read.

        @return {boolean} True if the seek pointer is at the end of the buffer.
        */
        public isEof(): boolean

        /**
         Sets the KaitaiStream read/write position to given position.
        Clamps between 0 and KaitaiStream length.

        @param {number} pos Position to seek to.
        @return {null}
        */
        public seek(pos: number): null

        /**
          Returns the byte length of the KaitaiStream object.
         @type {number}
         */
        public get size(): number

        // ========================================================================
        // Integer numbers
        // ========================================================================

        // ------------------------------------------------------------------------
        // Signed
        // ------------------------------------------------------------------------

        /**
         Reads an 8-bit signed int from the stream.
        @return {number} The read number.
        */
        public readS1(): number { };

        // ........................................................................
        // Big-endian
        // ........................................................................

        /**
         Reads a 16-bit big-endian signed int from the stream.
        @return {number} The read number.
        */
        public readS2be(): number { };

        /**
         Reads a 32-bit big-endian signed int from the stream.
        @return {number} The read number.
        */
        public readS4be(): number { };

        /**
         Reads a 64-bit big-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return {number} The read number.
        */
        public readS8be(): number { };

        // ........................................................................
        // Little-endian
        // ........................................................................

        /**
         Reads a 16-bit little-endian signed int from the stream.
        @return {number} The read number.
        */
        public readS2le(): number { };

        /**
         Reads a 32-bit little-endian signed int from the stream.
        @return {number} The read number.
        */
        public readS4le(): number { };

        /**
         Reads a 64-bit little-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return {number} The read number.
        */
        public readS8le(): number { };

        // ------------------------------------------------------------------------
        // Unsigned
        // ------------------------------------------------------------------------

        /**
         Reads an 8-bit unsigned int from the stream.
        @return {number} The read number.
        */
        public readU1(): number { };

        // ........................................................................
        // Big-endian
        // ........................................................................

        /**
         Reads a 16-bit big-endian unsigned int from the stream.
        @return {number} The read number.
        */
        public readU2be(): number { };

        /**
         Reads a 32-bit big-endian unsigned int from the stream.
        @return {number} The read number.
        */
        public readU4be(): number { };

        /**
         Reads a 64-bit big-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return {number} The read number.
        */
        public readU8be(): number { };

        // ........................................................................
        // Little-endian
        // ........................................................................

        /**
         Reads a 16-bit little-endian unsigned int from the stream.
        @return {number} The read number.
        */
        public readU2le(): number { };

        /**
         Reads a 32-bit little-endian unsigned int from the stream.
        @return {number} The read number.
        */
        public readU4le(): number { };

        /**
         Reads a 64-bit little-endian unsigned int from the stream. Note that
        JavaScript does not support 64-bit integers natively, so it will
        automatically upgrade internal representation to use IEEE 754
        double precision float.
        @return {number} The read number.
        */
        public readU8le(): number { };

        // ========================================================================
        // Floating point numbers
        // ========================================================================

        // ------------------------------------------------------------------------
        // Big endian
        // ------------------------------------------------------------------------

        public readF4be(): number { };

        public readF8be(): number { };

        // ------------------------------------------------------------------------
        // Little endian
        // ------------------------------------------------------------------------

        public readF4le(): number { };

        public readF8le(): number { };

        // ------------------------------------------------------------------------
        // Unaligned bit values
        // ------------------------------------------------------------------------

        public alignToByte();

        /*
        bitsLeft = 3
            \  \  bitsNeeded = 10 -> bytesNeeded = 2
            \  \ /         \
        |01101xxx|xxxxxxxx|xx......|
                \             /\     \
                \__ n = 13 _/  \     \
                            new bitsLeft = 6
        */
        public readBitsIntBe(n: number): integer { };

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

        /**
         Native endianness. Either KaitaiStream.BIG_ENDIAN or KaitaiStream.LITTLE_ENDIAN
        depending on the platform endianness.

        @type {boolean}
        */
        public static endianness: boolean = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

        // ========================================================================
        // Byte arrays
        // ========================================================================

        public readBytes(len: number): Uint8Array { };

        public readBytesFull(): Uint8Array { };

        public readBytesTerm(terminator: number, include: boolean, consume: boolean, eosError: boolean): Uint8Array { };

        public static bytesStripRight(data: Uint8Array, padByte: number): Uint8Array { };

        public static bytesTerminate(data: Uint8Array, term: number, include: boolean): Uint8Array { };

        public static bytesToStr = function (arr: Uint8Array, encoding: string?): string { };

        // ========================================================================
        // Byte array processing
        // ========================================================================

        public static processXorOne(data: Uint8Array, key: number): Uint8Array { };

        public static processXorMany = function (data: Uint8Array, key: number): Uint8Array { };

        public static processRotateLeft = function (data: Uint8Array, amount: number, groupSize: number): Uint8Array { };

        public static processZlib = function (buf: KaitaiStream): unknown { };

        // ========================================================================
        // Misc runtime operations
        // ========================================================================

        public static mod(a: number, b: number): number { };

        public static arrayMin(arr: []): number { };

        public static arrayMax(arr: []): number { };

        public static byteArrayCompare(a: Uint8Array, b: Uint8Array): number { };


        /**
         Ensures that we have an least `length` bytes left in the stream.
        If that's not true, throws an EOFError.

        @param {number} length Number of bytes to require
        */
        public ensureBytesLeft(length: number) { };

        /**
         Maps a Uint8Array into the KaitaiStream buffer.

        Nice for quickly reading in data.

        @param {number} length Number of elements to map.
        @return {Object} Uint8Array to the KaitaiStream backing buffer.
        */
        public mapUint8Array(length: number): Uint8Array { };

        /**
         Creates an array from an array of character codes.
        Uses String.fromCharCode in chunks for memory efficiency and then concatenates
        the resulting string chunks.

        @param {array|Uint8Array} array Array of character codes.
        @return {string} String created from the character codes.
        **/
        public static createStringFromArray(array: [] | Uint8Array): string { };
    }


    // ========================================================================
    // Internal implementation details
    // ========================================================================

    var EOFError = KaitaiStream.EOFError = function (bytesReq, bytesAvail) {
        this.name = "EOFError";
        this.message = "requested " + bytesReq + " bytes, but only " + bytesAvail + " bytes available";
        this.bytesReq = bytesReq;
        this.bytesAvail = bytesAvail;
        this.stack = (new Error()).stack;
    };

    EOFError.prototype = Object.create(Error.prototype);
    EOFError.prototype.constructor = EOFError;

    // Unused since Kaitai Struct Compiler v0.9+ - compatibility with older versions
    var UnexpectedDataError = KaitaiStream.UnexpectedDataError = function (expected, actual) {
        this.name = "UnexpectedDataError";
        this.message = "expected [" + expected + "], but got [" + actual + "]";
        this.expected = expected;
        this.actual = actual;
        this.stack = (new Error()).stack;
    };

    UnexpectedDataError.prototype = Object.create(Error.prototype);
    UnexpectedDataError.prototype.constructor = UnexpectedDataError;

    var UndecidedEndiannessError = KaitaiStream.UndecidedEndiannessError = function () {
        this.name = "UndecidedEndiannessError";
        this.stack = (new Error()).stack;
    };

    UndecidedEndiannessError.prototype = Object.create(Error.prototype);
    UndecidedEndiannessError.prototype.constructor = UndecidedEndiannessError;

    var ValidationNotEqualError = KaitaiStream.ValidationNotEqualError = function (expected, actual) {
        this.name = "ValidationNotEqualError";
        this.message = "not equal, expected [" + expected + "], but got [" + actual + "]";
        this.expected = expected;
        this.actual = actual;
        this.stack = (new Error()).stack;
    };

    ValidationNotEqualError.prototype = Object.create(Error.prototype);
    ValidationNotEqualError.prototype.constructor = ValidationNotEqualError;

    var ValidationLessThanError = KaitaiStream.ValidationLessThanError = function (min, actual) {
        this.name = "ValidationLessThanError";
        this.message = "not in range, min [" + min + "], but got [" + actual + "]";
        this.min = min;
        this.actual = actual;
        this.stack = (new Error()).stack;
    };

    ValidationLessThanError.prototype = Object.create(Error.prototype);
    ValidationLessThanError.prototype.constructor = ValidationLessThanError;

    var ValidationGreaterThanError = KaitaiStream.ValidationGreaterThanError = function (max, actual) {
        this.name = "ValidationGreaterThanError";
        this.message = "not in range, max [" + max + "], but got [" + actual + "]";
        this.max = max;
        this.actual = actual;
        this.stack = (new Error()).stack;
    };

    ValidationGreaterThanError.prototype = Object.create(Error.prototype);
    ValidationGreaterThanError.prototype.constructor = ValidationGreaterThanError;

    var ValidationNotAnyOfError = KaitaiStream.ValidationNotAnyOfError = function (actual, io, srcPath) {
        this.name = "ValidationNotAnyOfError";
        this.message = "not any of the list, got [" + actual + "]";
        this.actual = actual;
        this.stack = (new Error()).stack;
    };

    ValidationNotAnyOfError.prototype = Object.create(Error.prototype);
    ValidationNotAnyOfError.prototype.constructor = ValidationNotAnyOfError;

    var ValidationExprError = KaitaiStream.ValidationExprError = function (actual, io, srcPath) {
        this.name = "ValidationExprError";
        this.message = "not matching the expression, got [" + actual + "]";
        this.actual = actual;
        this.stack = (new Error()).stack;
    };

    ValidationExprError.prototype = Object.create(Error.prototype);
    ValidationExprError.prototype.constructor = ValidationExprError;

};











