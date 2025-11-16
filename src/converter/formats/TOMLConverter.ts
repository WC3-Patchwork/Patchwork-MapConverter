import { type FormatConverter } from './FormatConverter'
import toml from 'smol-toml'

export const TOMLConverter: FormatConverter = {
  parse (str: string): unknown {
    const result = toml.parse(str)
    if (result.data != null) {
      return result.data
    } else {
      return result
    }
  },

  stringify (obj: unknown): string {
    if (Array.isArray(obj)) {
      return toml.stringify({ data: obj })
    } else {
      return toml.stringify(obj)
    }
  }
}
