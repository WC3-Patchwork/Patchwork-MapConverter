import { StatementType } from '../data/statement/StatementType'

const dictionary = new Map<number, StatementType>()
const reverseDictionary = new Map<StatementType, number>()

dictionary.set(0, StatementType.EVENT)
dictionary.set(1, StatementType.CONDITION)
dictionary.set(2, StatementType.ACTION)
dictionary.set(3, StatementType.CALL)

reverseDictionary.set(StatementType.EVENT, 0)
reverseDictionary.set(StatementType.CONDITION, 1)
reverseDictionary.set(StatementType.ACTION, 2)
reverseDictionary.set(StatementType.CALL, 3)

const StatementTypeEnumConverter = {
  toEnum: (identifier: number): StatementType => {
    if (dictionary.has(identifier)) {
      return dictionary.get(identifier)!
    } else {
      throw new Error('Unknown StatementType for identifier: ' + String(identifier))
    }
  },

  toIdentifier: (type: StatementType): number => {
    if (reverseDictionary.has(type)) {
      return reverseDictionary.get(type)!
    } else {
      throw new Error('Unknown identifier for StatementType: ' + String(type))
    }
  }
}

export { StatementTypeEnumConverter }
