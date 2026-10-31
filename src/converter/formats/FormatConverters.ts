import { type FormatConverter } from './FormatConverter'
import { JSONConverter } from './JSONConverter'
import { TOMLConverter } from './TOMLConverter'
import { YAMLConverter } from './YAMLConverter'

export const FormatConverters: Record<string, FormatConverter> = {
  '.json': JSONConverter,
  '.toml': TOMLConverter,
  '.yaml': YAMLConverter
}