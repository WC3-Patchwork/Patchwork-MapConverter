import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type WarResult, type JsonResult } from '../CommonInterfaces'
import { type Translator } from './Translator'
import { ImportType, type Import } from '../data/Import'

const typeEnum = {
  0: ImportType.Standard,
  5: ImportType.Standard,
  8: ImportType.Standard, // * preferred
  10: ImportType.Custom,
  13: ImportType.Custom // * preferred
}

export class ImportsTranslator implements Translator<Import[]> {
  private static instance: ImportsTranslator

  private constructor () {}

  public static getInstance (): ImportsTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (imports: Import[]): WarResult {
    return this.getInstance().jsonToWar(imports)
  }

  public static warToJson (buffer: Buffer): JsonResult<Import[]> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar (imports: Import[]): WarResult {
    const output = new HexBuffer()

    output.addInt(1) // file version
    output.addInt(imports.length) // number of imports
    imports?.forEach((importedFile) => {
      output.addByte(
        importedFile.type === ImportType.Custom ? 13 : 5
      )

      // Temporary: always start the file path with war3mapImported\ until other file support is added
      if (!importedFile.path.startsWith('war3mapImported\\') && importedFile.type === ImportType.Standard) {
        importedFile.path = `war3mapImported\\${importedFile.path}`
      }
      output.addString(importedFile.path)
    })

    return {
      errors: [],
      buffer: output.getBuffer()
    }
  }

  public warToJson (buffer: Buffer): JsonResult<Import[]> {
    const result: Import[] = []
    const input = new W3Buffer(buffer)

    const fileVersion = input.readInt() // File version
    const numImports = input.readInt() // # of imports

    for (let i = 0; i < numImports; i++) {
      result[i] = {
        type: typeEnum[input.readByte()] as unknown as ImportType, // 5 or 8= standard path, 10 or 13: custom path
        path: input.readString() // e.g. "war3mapImported\mysound.wav"
      }
    }

    return {
      errors: [],
      json: result
    }
  }
}
