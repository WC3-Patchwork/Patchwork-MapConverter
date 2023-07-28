import { type Translator } from 'wc3maptranslator'
import { type WarResult, type JsonResult } from 'wc3maptranslator/lib/CommonInterfaces'
import { W3Buffer } from 'wc3maptranslator/lib/W3Buffer'
import { HexBuffer } from 'wc3maptranslator/lib/HexBuffer'

export class CustomScriptsTranslator implements Translator<string[]> {
  private static instance: CustomScriptsTranslator | null = null

  private constructor () {}

  public static getInstance (): CustomScriptsTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (cameras: string[]): WarResult {
    return this.getInstance().jsonToWar(cameras)
  }

  public static warToJson (buffer: Buffer): JsonResult<string[]> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar (json: string[]): WarResult {
    const outBufferToWar = new HexBuffer()

    // format version
    outBufferToWar.addByte(0x04)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x80)

    outBufferToWar.addInt(1)

    for (const script of json) {
      outBufferToWar.addString(script)
    }

    return {
      buffer: outBufferToWar.getBuffer(),
      errors: []
    }
  }

  public warToJson (buffer: Buffer): JsonResult<string[]> {
    const scripts: string[] = []
    const outBufferToJSON = new W3Buffer(buffer)

    const formatVersion = outBufferToJSON.readInt() // 04 00 00 80
    outBufferToJSON.readInt() // 01 00 00 00

    try {
      const script = outBufferToJSON.readString()
      scripts.push(script)
    } catch (e) {
      // catch EOF
    }

    return {
      json: scripts,
      errors: []
    }
  }
}
