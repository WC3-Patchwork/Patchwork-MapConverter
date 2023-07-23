'use strict'
import { Argument, program } from 'commander'
import { NAME, DESCRIPTION, VERSION } from './metadata'
import { type ILogObj, type Logger } from 'tslog'
import { LoggerFactory, LOG_DEBUG } from './logging/LoggerFactory'
import War2JsonService from './converter/War2JsonService'
import Json2WarService from './converter/Json2WarService'
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('source-map-support').install()

let log: Logger<ILogObj>

program
  .name(NAME)
  .version(VERSION)
  .description(DESCRIPTION)
  .option('-d, --debug', 'output extra debugging')
  .hook('preAction', (thisCommand, actionCommand) => {
    if (thisCommand.opts().debug === true) { LoggerFactory.setLogLevel(LOG_DEBUG) }
    log = LoggerFactory.createLogger('main')
    log.debug(`About to call action handler for subcommand ${actionCommand.name()}`)
    log.debug(`arguments: ${actionCommand.args.join(', ')}`)
    log.debug(`options: ${JSON.stringify(actionCommand.opts())}`)
  })

program
  .command('war2json')
  .description('convert Warcraft III binaries to JSON')
  .addArgument(new Argument('<input>', 'input directory path').argRequired())
  .addArgument(new Argument('<output>', 'output directory path').argRequired())
  .action(async (input: string, output: string) => {
    try {
      await War2JsonService.convert(input, output)
    } catch (exception) {
      log.fatal(exception)
    }
  })

program
  .command('json2war')
  .description('convert JSON to Warcraft III binaries')
  .addArgument(new Argument('<input>', 'input directory path').argRequired())
  .addArgument(new Argument('<output>', 'output directory path').argRequired())
  .action((input: string, output: string) => {
    try {
      Json2WarService.convert(input, output)
    } catch (exception) {
      log.fatal(exception)
    }
  })

program.parse()
