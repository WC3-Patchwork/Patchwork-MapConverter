/**
 * @type An angle is measured in degrees, 0 <= angle < 360
 */
export type angle = number

/**
 * @type a string with only 4 chars, signifies a unique identifier of objects
 */
export type FourCC = string

export type integer = number
export type vector2 = [number, number]
export type vector3 = [number, number, number]

/**
 * @type comma seperated string
 */
export type csv = string

/**
 * @type string containing only 0s and 1s
 */
export type bitstring = string

/**
 * @type #AARRGGBB format
 */
export type color = string

// TranslationError is reserved for future use in case
// additional constraints are added to translated output,
// like if WC3 has maximum string lengths, or if certain
// values must be in a specific range
export interface TranslationError {
  message: string
}