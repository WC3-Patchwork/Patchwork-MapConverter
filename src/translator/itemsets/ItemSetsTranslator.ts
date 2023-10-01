import { Service } from 'typedi'
import { FourCC } from '../../data/editor/common/FourCC'
import { type RandomItem, type RandomItemSet } from '../../data/editor/preplaced/RandomItemSet'
import { type VersionedBinaryToJsonConverter } from '../VersionedBinaryToJsonConverter'
import { W3Buffer } from '../W3Buffer'

@Service()
export class ItemSetsTranslator implements VersionedBinaryToJsonConverter<RandomItemSet[]> {
  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    return w3Buffer.readInt() === -1
  }

  public translate (buffer: Buffer): JSONExportResult<RandomItemSet[]> {
    const outBufferToJSON = new W3Buffer(buffer)
    const resultObject: JSONExportResult<RandomItemSet[]> = {
      result: [],
      errors: [],
      warnings: []
    }

    const randomItemSetPtr = outBufferToJSON.readInt() // points to an item set defined in the map (rather than custom one defined below)
    const numberOfItemSets = outBufferToJSON.readInt() // this should be 0 if randomItemSetPtr is >= 0

    if (randomItemSetPtr !== -1 && numberOfItemSets > 0) {
      resultObject.warnings.push(
        new Error(`Attempting to translate with translator not intended for following data:
                randomItemSetPtr: ${randomItemSetPtr}\t\texpected: -1
                with numberOfCustomItemSets: ${numberOfItemSets} at offset ${(buffer.byteOffset - 4).toString(16)}`))
    }

    for (let j = 0; j < numberOfItemSets; j++) {
      const randomItemSet = {
        items: [] as RandomItem[]
      } satisfies RandomItemSet
      // Read the item set
      const numberOfItems = outBufferToJSON.readInt()
      for (let k = 0; k < numberOfItems; k++) {
        randomItemSet.items.push({
          itemId: FourCC.fromCode(outBufferToJSON.readChars(4)),
          dropChance: outBufferToJSON.readInt()
        })
      }
      resultObject.result.push(randomItemSet)
    }

    return resultObject
  }
}
