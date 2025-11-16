import yaml from 'yaml'
import { type FormatConverter } from './FormatConverter'

export const YAMLConverter: FormatConverter = {
  parse (str: string): unknown {
    return yaml.parse(str, {})
  },

  stringify (obj: unknown): string {
    return yaml.stringify(obj, {})
  }
}
