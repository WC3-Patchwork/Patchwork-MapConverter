import { type Translator } from 'wc3maptranslator'
import { type WarResult, type JsonResult } from 'wc3maptranslator/lib/CommonInterfaces'
import { W3Buffer } from 'wc3maptranslator/lib/W3Buffer'
import { HexBuffer } from 'wc3maptranslator/lib/HexBuffer'

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
    for (let i = 0; i < json.headerComments.length; i++) {
      outBufferToWar.addString(json.headerComments[i])
    }

    for (let i = 0; i < json.scripts.length; i++) {
      const script = json.scripts[i]

      if (script == null || script.length === 0) {
        outBufferToWar.addInt(0)
      } else {
        const buf = Buffer.from(script, 'utf-8')
        outBufferToWar.addInt(buf.length + 1) // + nul char
        for (let i = 0; i < buf.length; i++) {
          outBufferToWar.addByte(buf[i])
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
