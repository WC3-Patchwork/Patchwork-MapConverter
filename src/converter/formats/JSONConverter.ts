import EnhancementManager from '../../enhancements/EnhancementManager'
import { LoggerFactory } from '../../logging/LoggerFactory'
import { type FormatConverter } from './FormatConverter'

const log = LoggerFactory.createLogger('JSONConverter')

export const JSONConverter: FormatConverter = {
  parse (str: string): object {
    return JSON.parse(str) as object
  },

  stringify (obj: object): string {
    if (EnhancementManager.prettify) {
      return JSON.stringify(obj, null, 2)
    } else {
      return JSON.stringify(obj)
    }
  }
}
