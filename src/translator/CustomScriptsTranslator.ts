import { type WarResult, type JsonResult } from '../wc3maptranslator/CommonInterfaces'
import { HexBuffer } from '../wc3maptranslator/HexBuffer'
import { W3Buffer } from '../wc3maptranslator/W3Buffer'
import { type Translator } from '../wc3maptranslator/translators'

export class CustomScriptsTranslator implements Translator<{ headerComments: string[], scripts: string[] }> {
  private static instance: CustomScriptsTranslator | null = null

  private constructor () {}

  public static getInstance (): CustomScriptsTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (json: { headerComments: string[], scripts: string[] }): WarResult {
    return this.getInstance().jsonToWar(json)
  }

  public static warToJson (buffer: Buffer): JsonResult< { headerComments: string[], scripts: string[] }> {
    return this.getInstance().warToJson(buffer)
  }

  // expecting first string to belong to header
  public jsonToWar (json: { headerComments: string[], scripts: string[] }): WarResult {
    const outBufferToWar = new HexBuffer()

    // format version
    outBufferToWar.addByte(0x04)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x80)

    outBufferToWar.addInt(json.headerComments.length)
    for (const comment of json.headerComments){
      outBufferToWar.addString(comment)
    }

    for (const script of json.scripts) {
      if (script == null || script.length === 0) {
        outBufferToWar.addInt(0) // size
      } else {
        const buf = Buffer.from(script, 'utf-8')
        outBufferToWar.addInt(buf.length + 1) // + nul char
        for (const byte of buf) {
          outBufferToWar.addByte(byte)
        }
        outBufferToWar.addByte(0) // nul char
      }
    }

    return {
      buffer: outBufferToWar.getBuffer(),
      errors: []
    }
  }

  public warToJson (buffer: Buffer): JsonResult<{ headerComments: string[], scripts: string[] }> {
    const headerComments: string[] = []
    const scripts: string[] = []
    const outBufferToJSON = new W3Buffer(buffer)

    const formatVersion = outBufferToJSON.readInt() // 04 00 00 80

    const headerCommentsCount = outBufferToJSON.readInt() // 01 00 00 00 Header comments count?
    for (let i = 0; i < headerCommentsCount; i++) {
      headerComments.push(outBufferToJSON.readString())
    }

    try {
      do {
        const lengthWithNulChar = outBufferToJSON.readInt()
        if (lengthWithNulChar === 0) {
          scripts.push('')
          continue // skip
        }
        scripts.push(outBufferToJSON.readString())
      // eslint-disable-next-line no-constant-condition
      } while (true)
    } catch (e) {
      // catch EOF
    }

    return {
      json: { headerComments, scripts },
      errors: []
    }
  }
}
