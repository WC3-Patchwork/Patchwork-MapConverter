import { Service } from 'typedi'
import { type JsonToBinaryConverter } from '../../JsonToBinaryConverter'
import { AssetType, type Asset } from '../../../data/editor/asset/Asset'
import { type HexBuffer } from '../../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../../BinaryTranslationResult'

@Service()
export class AssetBinaryAssembler implements JsonToBinaryConverter<Asset[]> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length > 1 && metadata[0] === 1
  }

  public translate (outBufferToWar: HexBuffer, data: Asset[], ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors = new Array<Error>()
    const warnings = new Array<Error>()

    /*
    * Header
    */
    outBufferToWar.addInt(1) // file version
    outBufferToWar.addInt(data.length) // number of imports

    /*
    * Body
    */
    data.forEach((importedFile) => {
      if (!importedFile.path.startsWith('war3mapImported\\') && importedFile.type === AssetType.STANDARD) {
        warnings.push(new Error(`Asset '${importedFile.path}' filepath doesn't start with war3mapImported but is marked as STANDARD. This is invalid and will be fixed into CUSTOM AssetType.`))

        importedFile.type = AssetType.CUSTOM
      }

      outBufferToWar.addByte(importedFile.type.ordinal)
      outBufferToWar.addString(importedFile.path)
    })

    return { errors, warnings }
  }
}
