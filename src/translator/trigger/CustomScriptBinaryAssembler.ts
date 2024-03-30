import { Service } from 'typedi'
import { type JsonToBinaryConverter } from '../JsonToBinaryConverter'
import { type HexBuffer } from '../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../BinaryTranslationResult'

@Service()
export class CustomScriptBinaryAssembler implements JsonToBinaryConverter<{ headerComments: string[], scripts: string[] }> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length >= 1 && metadata[0] === 0x04000080
  }

  // expecting first string to belong to header
  public translate (outBufferToWar: HexBuffer, data: { headerComments: string[], scripts: string[] }, ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors: Error[] = []
    const warnings: Error[] = []

    // format version
    outBufferToWar.addByte(0x04)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x80)

    outBufferToWar.addInt(data.headerComments.length)
    for (let i = 0; i < data.headerComments.length; i++) {
      outBufferToWar.addString(data.headerComments[i])
    }

    for (let i = 0; i < data.scripts.length; i++) {
      const script = data.scripts[i]

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

    return { errors, warnings }
  }
}
