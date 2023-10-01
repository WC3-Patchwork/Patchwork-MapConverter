/**
 * @type byte - 8 bits, also a char
 */
export type byte = number

/**
 * @type short - 2 bytes of data used for a non-decimal number.
 */
export type short = number

/**
 * @type integer - superset of number which have no decimals. 4 bytes of data
 */
export type integer = number

/**
 * @type real - Little Endian representation of decimal numbers. 4 bytes of data
 */
export type real = number
