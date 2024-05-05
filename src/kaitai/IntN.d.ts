declare module "intn" {
    export default class IntN {
        public constructor(intSize: number);

        /**
         * Represented byte values, least significant first.
         * @type {!Array.<number>}
         //? if (INTN_STANDALONE)
         * @expose
         */
        public bytes: Array<number>

        /**
            * Constructs an IntN from a 32 bit integer value.
            * @param {number} value Integer value
            * @param {boolean?} unsigned Whether unsigned or not, defaults to `false` for signed
            * @returns {!IntN}
            * @expose
            */
        public fromInt(value: number): IntN;
        public fromInt(value: number, unsigned: boolean?): IntN;
    }


}