import { existsSync, readFileSync } from 'fs'
import { LoggerFactory } from '../logging/LoggerFactory'
import { type DirectoryTree } from 'directory-tree'

const log = LoggerFactory.createLogger('FileBlacklist')

const blacklist: RegExp[] = []

const FileBlacklist = {
  readBlacklist: function (blacklistFilePath: string): void {
    if (!existsSync(blacklistFilePath)) {
      return
    }

    log.info('Loading blacklist from', blacklistFilePath)
    const blacklistFileContent = readFileSync(blacklistFilePath, { encoding: 'utf8' })

    // eslint-disable-next-line no-control-regex
    for (const line of blacklistFileContent.split(/\u000D\u000A|[\u000A\u000B\u000C\u000D\u0085\u2028\u2029]/)) { // \R pattern
      blacklist.push(new RegExp(line))
    }
  },

  isDirectoryTreeBlacklisted: function (path: DirectoryTree): boolean {
    return this.isNameBlacklisted(`${path.path}${path.name}${path.extension != null ? path.extension : ''}`)
  },

  isNameBlacklisted: function (path: string): boolean {
    for (const regex of blacklist) {
      if (regex.test(path)) {
        return true
      }
    }
    return false
  }
}

export { FileBlacklist }
