import { LoggerFactory } from '../../logging/LoggerFactory'
import { type FormatConverter } from './FormatConverter'
import toml from 'smol-toml'

const log = LoggerFactory.createLogger('TOMLConverter')

export const TOMLConverter: FormatConverter = {
  parse (str: string): object {
    const result = toml.parse(str) as { data: unknown | undefined }
    if (result.data as boolean) {
      return result.data as object
    } else {
      return result
    }
  },

  stringify (obj: object): string {
    if (Array.isArray(obj)) {
      return toml.stringify({ data: obj })
    } else {
      return toml.stringify(obj)
    }
  }
}
