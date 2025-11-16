import { ContentType } from '../data/content/TriggerContent'

const dictionary = new Map<number, ContentType>()
const reverseDictionary = new Map<ContentType, number>()

dictionary.set(1, ContentType.HEADER)
dictionary.set(2, ContentType.LIBRARY)
dictionary.set(4, ContentType.CATEGORY)
dictionary.set(8, ContentType.TRIGGER)
dictionary.set(16, ContentType.COMMENT)
dictionary.set(32, ContentType.CUSTOM_SCRIPT)
dictionary.set(64, ContentType.VARIABLE)

reverseDictionary.set(ContentType.HEADER, 1)
reverseDictionary.set(ContentType.LIBRARY, 2)
reverseDictionary.set(ContentType.CATEGORY, 4)
reverseDictionary.set(ContentType.TRIGGER, 8)
reverseDictionary.set(ContentType.TRIGGER_SCRIPTED, 8) // special type for Patchwork
reverseDictionary.set(ContentType.COMMENT, 16)
reverseDictionary.set(ContentType.CUSTOM_SCRIPT, 32)
reverseDictionary.set(ContentType.VARIABLE, 64)

const ContentTypeEnumConverter = {
  toEnum: (identifier: number): ContentType => {
    if (dictionary.has(identifier)) {
      return dictionary.get(identifier)!
    } else {
      throw new Error('Unknown ContentType for identifier: ' + String(identifier))
    }
  },

  toIdentifier: (type: ContentType): number => {
    if (reverseDictionary.has(type)) {
      return reverseDictionary.get(type)!
    } else {
      throw new Error('Unknown identifier for contentType: ' + String(type))
    }
  }
}

export { ContentTypeEnumConverter }
