import { LoggerFactory } from '../../logging/LoggerFactory'
import yaml from 'yaml'
import { type FormatConverter } from './FormatConverter'

const log = LoggerFactory.createLogger('YAMLConverter')

export const YAMLConverter: FormatConverter = {
  parse (str: string): object {
    return yaml.parse(str, {}) as object
  },

  stringify (obj: object): string {
    return yaml.stringify(obj, {})
  }
}
