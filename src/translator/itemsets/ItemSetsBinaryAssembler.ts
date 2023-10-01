import { Service } from 'typedi'
import { type RandomItemSet } from '../../data/editor/preplaced/RandomItemSet'
import { type HexBuffer } from '../../wc3maptranslator/HexBuffer'

@Service()
export class ItemSetsBinaryAssembler {
  public translate (outBufferToWar: HexBuffer, errors: Error[], warnings: Error[], data: RandomItemSet[]): void {
    for (const itemSet of data) {
      outBufferToWar.addInt(itemSet.items.length)
      for (const randomItem of itemSet.items) {
        outBufferToWar.addChars(randomItem.itemId.codeRep)
        outBufferToWar.addInt(randomItem.dropChance)
      }
    }
  }
}
