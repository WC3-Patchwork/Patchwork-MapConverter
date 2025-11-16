import EnhancementManager from '../../enhancements/EnhancementManager'
import { type FormatConverter } from './FormatConverter'
export const JSONConverter: FormatConverter = {
  parse (str: string): unknown {
    return JSON.parse(str)
  },

  stringify (obj: unknown): string {
    if (EnhancementManager.prettify) {
      return JSON.stringify(obj, null, 2)
    } else {
      return JSON.stringify(obj)
    }
  }
}
