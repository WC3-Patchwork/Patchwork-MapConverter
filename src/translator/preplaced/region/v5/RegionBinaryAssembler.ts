import { Service } from 'typedi'
import { type JsonToBinaryConverter } from '../../../JsonToBinaryConverter'
import { type HexBuffer } from '../../../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../../../BinaryTranslationResult'
import { type Region } from '../../../../data/editor/preplaced/region/Region'

@Service()
export class RegionBinaryAssembler implements JsonToBinaryConverter<Region[]> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length > 1 && metadata[0] === 5
  }

  public translate (outBufferToWar: HexBuffer, data: Region[], ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors = new Array<Error>()
    const warnings = new Array<Error>()

    /*
    * Header
    */
    outBufferToWar.addInt(5) // file version
    outBufferToWar.addInt(data.length) // number of regions

    /*
    * Body
    */
    data.forEach((region) => {
      // Position
      // Note that the .w3x guide has these coords wrong - the guide swaps bottom and right, but this is incorrect; bottom should be written before right
      outBufferToWar.addFloat(region.position.left)
      outBufferToWar.addFloat(region.position.bottom)
      outBufferToWar.addFloat(region.position.right)
      outBufferToWar.addFloat(region.position.top)

      outBufferToWar.addString(region.name)
      outBufferToWar.addInt(region.id)

      // Weather effect name - lookup necessary: char[4]
      if (region.weatherEffect != null) {
        outBufferToWar.addChars(region.weatherEffect) // Weather effect is optional - defaults to 0000 for "none"
      } else {
        // We can't put a string "0000", because ASCII 0's differ from 0x0 bytes
        outBufferToWar.addByte(0)
        outBufferToWar.addByte(0)
        outBufferToWar.addByte(0)
        outBufferToWar.addByte(0)
      }

      // Ambient sound - refer to names defined in .w3s file
      outBufferToWar.addString(region.ambientSound != null ? region.ambientSound : '') // May be empty string

      // Color of region used by editor
      // Careful! The order in .w3r is BB GG RR, whereas the JSON spec order is [RR, GG, BB]
      outBufferToWar.addByte(region.color.blue) // blue
      outBufferToWar.addByte(region.color.green) // green
      outBufferToWar.addByte(region.color.red) // red

      // End of structure - for some reason the .w3r needs this here;
      // Value is set to 0xff based on observing the .w3r file, but not sure if it could be something else
      outBufferToWar.addByte(0xff)
    })

    return {
      errors,
      warnings
    }
  }
}
