'use strict'
import { program } from 'commander'
import { NAME, DESCRIPTION, VERSION } from './metadata'
import { type ILogObj, type Logger } from 'tslog'
import { LoggerFactory, LOG_DEBUG } from './logging/LoggerFactory'

let log: Logger<ILogObj>

program.name(NAME).version(VERSION).description(DESCRIPTION)

program.option('-d, --debug', 'output extra debugging')
program.hook('preAction', (thisCommand, actionCommand) => {
  if (thisCommand.opts().debug === true) {
    LoggerFactory.setLogLevel(LOG_DEBUG)
  }
  log = LoggerFactory.createLogger('main')
  log.debug(
    `About to call action handler for subcommand ${actionCommand.name()}`
  )
  log.debug(`arguments: ${actionCommand.args.join(', ')}`)
  log.debug(`options: ${JSON.stringify(actionCommand.opts())}`)
})
program.option('-w2j, --war-to-json', 'convert Warcraft III binaries to JSON')
program.option('-j2w, --json-to-war', 'convert JSON to Warcraft III binaries')

program.parse()
