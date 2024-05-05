import { copyFile, mkdir } from 'fs/promises'
import path from 'path'
import { LoggerFactory } from '../logging/LoggerFactory.js'

let copyCount = 0
export async function copyFileWithDirCreation(input: string, output: string): Promise<undefined> {
  const asyncLog = LoggerFactory.createLogger(`FileCopier-${copyCount++}`)
  asyncLog.info('Copying', input)
  await mkdir(path.dirname(output), { recursive: true })
  await copyFile(input, output)
  asyncLog.info('Copied into', output)
}
