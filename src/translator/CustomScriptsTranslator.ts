import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { HexBuffer } from '../wc3maptranslator/HexBuffer'
import { W3Buffer } from '../wc3maptranslator/W3Buffer'

// expecting first string to belong to header
export function jsonToWar (json: { headerComments: string[], scripts: string[] }, formatVersion: integer): Buffer {
  const output = new HexBuffer()

  // format version
  output.addByte(0x04)
  output.addByte(0x00)
  output.addByte(0x00)
  output.addByte(0x80)
  // Note: minInt + offset?

  output.addInt(json.headerComments.length)
  for (let i = 0; i < json.headerComments.length; i++) {
    output.addString(json.headerComments[i])
  }

  for (let i = 0; i < json.scripts.length; i++) {
    const script = json.scripts[i]

    if (script == null || script.length === 0) {
      output.addInt(0) // size
    } else {
      const buf = Buffer.from(script, 'utf-8')
      output.addInt(buf.length + 1) // + nul char
      for (let i = 0; i < buf.length; i++) {
        output.addByte(buf[i])
      }
      output.addByte(0) // nul char
    }
  }

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): { headerComments: string[], scripts: string[] } {
  const headerComments: string[] = []
  const scripts: string[] = []
  const input = new W3Buffer(buffer)

  const formatVersion = input.readInt() // 04 00 00 80 - minInt + offset?

  const headerCommentsCount = input.readInt() // 01 00 00 00 Header comments count?
  for (let i = 0; i < headerCommentsCount; i++) {
    headerComments.push(input.readString())
  }

  try {
    do {
      const lengthWithNulChar = input.readInt()
      if (lengthWithNulChar === 0) {
        scripts.push('')
        continue // skip
      }
      scripts.push(input.readString())
    } while (true)
  } catch (e) {
    // catch EOF
  }

  return { headerComments, scripts }
}
