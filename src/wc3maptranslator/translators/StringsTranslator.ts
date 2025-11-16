import { HexBuffer } from '../HexBuffer'

export function jsonToWar (stringsJson: Record<string, string>): Buffer {
  const output = new HexBuffer()
  Object.keys(stringsJson).forEach((key) => {
    output.addChars('STRING ' + key)
    output.addNewLine()
    output.addChars('{')
    output.addNewLine()
    output.addStringNoNullTerminator(stringsJson[key] as unknown as string)
    output.addNewLine()
    output.addChars('}')
    output.addNewLine()
    output.addNewLine()
  })

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): Record<string, string> {
  const wts = buffer.toString().replace(/\r\n/g, '\n') // may contain Windows linebreaks (\r\n), but below regex just assumes \n
  const matchStringDefinitionBlock = /STRING ([0-9]+)\n?(?:.*\n)?{\n((?:.|\n)*?)\n}/g // see: https://regexr.com/3r572

  const result = {} // stores the json form of strings file
  let match: RegExpExecArray | null // stores individual matches as input is read

  while ((match = matchStringDefinitionBlock.exec(wts)) !== null) {
    const num = match[1]
    const body = match[2]
    result[num] = body
  }

  return result
}
