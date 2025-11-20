import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { type FormatConverter } from './FormatConverter'
import EnhancementManager from '../../enhancements/EnhancementManager'

export const XMLConverter: FormatConverter = {
  parse(str: string): unknown {
    const result = new XMLParser({ }).parse(str) as Record<string, unknown>
    if (result.data) {
      return result.data
    } else {
      return result
    }
  },

  stringify(obj: unknown): string {
    return new XMLBuilder({
      format       : EnhancementManager.prettify,
      arrayNodeName: 'data'
    }).build(obj) as string
  }
}