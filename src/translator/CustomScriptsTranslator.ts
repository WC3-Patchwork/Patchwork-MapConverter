import { LoggerFactory } from '../logging/LoggerFactory'
import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { HexBuffer } from '../wc3maptranslator/HexBuffer'
import { W3Buffer } from '../wc3maptranslator/W3Buffer'

const log = LoggerFactory.createLogger('CustomScriptsTranslator')

export function jsonToWar (json: { headerComment: string, scripts: string[] }, formatVersion: integer, formatSubversion?: integer): Buffer {
  if (formatVersion < 0 || formatVersion > 0x80000004) {
    throw new Error(`Unknown map scripts format version=${formatVersion}, expected value from range [0, 0x80000004]`)
  }

  const output = new HexBuffer()
  output.addUInt(formatVersion)
  if (formatVersion > 0x7FFFFFFF) {
    if (!formatSubversion || formatSubversion < 0 || formatSubversion > 1) {
      throw new Error(`Unknown map scripts format subversion=${formatSubversion ?? 'undefined'}, expected value from range [0, 1]`)
    }
    output.addUInt(formatSubversion)
  }
  formatSubversion = formatSubversion ?? 0x7FFFFFFF

  const saveCustomScript = function (text: string): void {
    if (text.length > 0) {
      const buf = Buffer.from(text, 'utf-8')
      output.addInt(buf.length + 1) // + nul char
      for (let i = 0; i < buf.length; i++) {
        output.addByte(buf[i])
      }
      output.addByte(0) // nul char
    } else {
      output.addInt(0)
    }
  }

  if (formatVersion > 0 && formatSubversion > 0) {
    output.addString(json.headerComment)
    saveCustomScript(json.scripts[0] ?? '')
  }

  if (formatVersion < 0x80000003) {
    if (formatVersion < 0x80000000) {
      output.addInt(json.scripts.length)
      for (let i = 1; i < json.scripts.length; i++) {
        saveCustomScript(json.scripts[i])
      }
    } else {
      throw new Error('This particular case of outputting for formatVersion [0x80000001, 0x80000003] has not been solved.')
      // what to do with this??
      // const triggerCustomScriptCount = input.readInt()
      // for (let i = 0; i < triggerCustomScriptCount; i++) {
      //   scripts.push(loadCustomScript())
      // }
      // const customScriptCount = input.readInt()
      // for (let i = 0; i < customScriptCount; i++) {
      //   scripts.push(loadCustomScript())
      // }
      if (formatVersion < 0x80000002) {
        output.addInt(0) // no unknown elements with scripts, whatever those are..
      }
    }
  } else {
    // skip header
    for (let i = 1; i < json.scripts.length; i++) {
      saveCustomScript(json.scripts[i])
    }
  }

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): { headerComment: string, scripts: string[] } {
  const input = new W3Buffer(buffer)
  const formatVersion = input.readUint()
  let formatSubversion: integer
  if (formatVersion > 0x7FFFFFFF) {
    formatSubversion = input.readUint()
  } else {
    formatSubversion = 0x7FFFFFFF
  }

  if (formatVersion < 0 || formatVersion > 0x80000004) {
    log.warn(`Unknown map scripts format version ${formatVersion} will attempt at reading...`)
  }
  if (formatSubversion !== 0x7FFFFFFF && formatSubversion > 1) {
    log.warn(`Unknown map scripts format sub-version ${formatSubversion} will attempt at reading...`)
  }

  const loadCustomScript = function (): string {
    const unknownScriptLength = input.readInt()
    if (unknownScriptLength > 0) {
      return input.readString()
    } else {
      return ''
    }
  }

  const scripts: string[] = []
  let headerComment: string
  if (formatVersion > 0 && formatSubversion > 0) {
    headerComment = input.readString()
    scripts.push(loadCustomScript())
  } else {
    headerComment = ''
    scripts.push('')
  }

  if (formatVersion < 0x80000003) {
    if (formatVersion < 0x80000000) {
      const customScriptCount = input.readInt()
      for (let i = 0; i < customScriptCount; i++) {
        scripts.push(loadCustomScript())
      }
    } else {
      const triggerCustomScriptCount = input.readInt()
      for (let i = 0; i < triggerCustomScriptCount; i++) {
        scripts.push(loadCustomScript())
      }
      const customScriptCount = input.readInt()
      for (let i = 0; i < customScriptCount; i++) {
        scripts.push(loadCustomScript())
      }
      if (formatVersion < 0x80000002) {
        const unknownScriptCount = input.readInt()
        for (let i = 0; i < unknownScriptCount; i++) {
          loadCustomScript() // ignore
        }
      }
    }
  } else {
    try {
      do {
        loadCustomScript()
      } while (true)
    } catch (e) {
    // catch EOF
    }
  }

  return { headerComment, scripts }
}
