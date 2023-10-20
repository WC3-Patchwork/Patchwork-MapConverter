import { Service } from 'typedi'
import { type VersionedBinaryToJsonConverter } from '../VersionedBinaryToJsonConverter'

@Service()
export class StringsTranslator implements VersionedBinaryToJsonConverter<Record<string, string>> {
  public canTranslate (buffer: Buffer): boolean {
    return true
  }

  public translate (buffer: Buffer): JSONTranslationResult<Record<string, string>> {
    const resultObject: JSONTranslationResult<Record<string, string>> = {
      errors: [],
      warnings: [],
      result: {}
    }

    const wts = buffer.toString().replace(/\r\n|\r|\n/g, '\n') // may contain Windows linebreaks (\r\n) or Mac linebreaks (\r), but below regex just assumes \n
    const matchStringDefinitionBlock = /STRING ([0-9]+)\n?(?:.*\n)?{\n((?:.|\n)*?)\n}/g // see: https://regexr.com/3r572

    let match: RegExpExecArray | null // stores individual matches as input is read

    while ((match = matchStringDefinitionBlock.exec(wts)) !== null) {
      const num = match[1]
      const body = match[2]
      resultObject.result[num] = body
    }

    return resultObject
  }
}
