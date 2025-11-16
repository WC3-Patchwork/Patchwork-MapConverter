import { LoggerFactory } from '../../logging/LoggerFactory'
import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { AssetType, type Asset } from '../data/Asset'

const log = LoggerFactory.createLogger('AssetsTranslator')

export function jsonToWar (imports: Asset[], formatVersion: number): Buffer {
  if (formatVersion > 1 || formatVersion < 0) {
    throw new Error(`Unknown imports list file format version=${formatVersion}, expected 0 or 1`)
  }

  const output = new HexBuffer()
  output.addInt(formatVersion)
  output.addInt(imports.length)
  imports?.forEach((importedFile) => {
    /**
     * 0x10 -> unknown (always true since 1.30, probably)
     * 0x08 -> listed in MPQ listfile? Likely not since in reforged the difference between standard and custom is 0x15 and 0x1D
     * 0x04 -> isCustom (preferred bitflag)
     * 0x02 -> unknown (always false)
     * 0x01 -> isCustom
     *
     * The above is my interpretation of debug symbols, but in reality, these flags are a mess in the editor,
     * due to the devs changing the saved flag values with certain patches without actually bothering to update the format version,
     * therefore, patchwork will play it safe only set the first bit and forget the rest, since they mean nothing outside of the editor's
     * inner machniations which are difficult to understand -.-
     *
     * Other settings in Asset Manager just add/remove prefixes to the existing filepath like _hd/ or _teen/ or _locale/,
     * they have no impact on this bitmap (except for forcing custom asset type because of non-standard filepath)
     */
    output.addByte(importedFile.type === AssetType.Custom ? 0x01 : 0x00)

    // Temporary: always start the file path with war3mapImported\ until other file support is added
    if (!importedFile.path.startsWith('war3mapImported\\') && importedFile.type === AssetType.Standard) {
      importedFile.path = `war3mapImported\\${importedFile.path}`
    }
    output.addString(importedFile.path)
  })

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): Asset[] {
  const input = new W3Buffer(buffer)
  const formatVersion = input.readInt()
  if (formatVersion > 1 || formatVersion < 0) {
    log.warn(`Unknown asset file format version=${formatVersion}, expected 0 or 1, will attempt reading...`)
  }

  const importCount = input.readInt()
  const result: Asset[] = []
  for (let i = 0; i < importCount; i++) {
    result[i] = {
      type: input.readByte() & 0x01 ? AssetType.Custom : AssetType.Standard,
      path: input.readString() // e.g. "war3mapImported\mysound.wav"
    }
  }

  return result
}
