import { type FormatConverter } from './FormatConverter'
import { JSONConverter } from './JSONConverter'
import { TOMLConverter } from './TOMLConverter'
// import { XMLConverter } from './XMLConverter'
import { YAMLConverter } from './YAMLConverter'

export const FormatConverters: Record<string, FormatConverter> = {
  '.json': JSONConverter,
  '.toml': TOMLConverter,
  // '.xml': XMLConverter, // wishful thinking, this one is more complicated with the empty arrays not being stored, single-element arrays mistaken for objects, and some other random BS. Would need to write a proper specification for XML format
  '.yaml': YAMLConverter
}
