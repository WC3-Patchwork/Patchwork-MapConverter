import { copyFile, mkdir } from 'fs/promises'
import { LoggerFactory } from '../logging/LoggerFactory'
import path from 'path'
import { AsyncTaskContextWrapper } from '../logging/AsyncTaskContextWrapper'

const log = LoggerFactory.createLogger('FileCopier')

export async function copyFileWithDirCreation(input: string, output: string): Promise<undefined> {
  await AsyncTaskContextWrapper(async () => {
    log.info('Copying', input)
    await mkdir(path.dirname(output), { recursive: true })
    await copyFile(input, output)
    log.info('Copied into', output)
  })
}