import { ParameterType } from '../data/parameter/ParameterType'

const dictionary = new Map<number, ParameterType>()
const reverseDictionary = new Map<ParameterType, number>()

dictionary.set(-1, ParameterType.INVALID)
dictionary.set(0, ParameterType.PRESET)
dictionary.set(1, ParameterType.VARIABLE)
dictionary.set(2, ParameterType.FUNCTION)
dictionary.set(3, ParameterType.VALUE)

reverseDictionary.set(ParameterType.INVALID, -1)
reverseDictionary.set(ParameterType.PRESET, 0)
reverseDictionary.set(ParameterType.VARIABLE, 1)
reverseDictionary.set(ParameterType.FUNCTION, 2)
reverseDictionary.set(ParameterType.VALUE, 3)

const ParameterTypeEnumConverter = {
  toEnum: (identifier: number): ParameterType => {
    if (dictionary.has(identifier)) {
      return dictionary.get(identifier)!
    } else {
      throw new Error('Unknown ParameterType for identifier: ' + String(identifier))
    }
  },

  toIdentifier: (type: ParameterType): number => {
    if (reverseDictionary.has(type)) {
      return reverseDictionary.get(type)!
    } else {
      throw new Error('Unknown identifier for ParameterType: ' + String(type))
    }
  }
}

export { ParameterTypeEnumConverter }