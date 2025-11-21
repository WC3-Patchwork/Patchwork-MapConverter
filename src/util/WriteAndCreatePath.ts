import { type Abortable } from 'events'
import { type ObjectEncodingOptions, type Mode, type OpenMode } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { type Stream } from 'stream'
import { LoggerFactory } from '../logging/LoggerFactory'

const log = LoggerFactory.createLogger('WriteAndCreatePath');

async function WriteAndCreatePath(
  output: string,
  data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Buffer | Stream,
  options?:
  | (ObjectEncodingOptions & {
    mode?: Mode | undefined
    flag?: OpenMode | undefined
  } & Abortable)
  | BufferEncoding
  | null
): Promise<void> {
  try {
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, data as NodeJS.ArrayBufferView, options)
  } catch(e){
    log.error(`Failed writing file ${output}`, e)
  }
}

export { WriteAndCreatePath }