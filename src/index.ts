'use strict'
import { Argument, program } from 'commander'
import { NAME, DESCRIPTION, VERSION } from './metadata'
import { type ILogObj, type Logger } from 'tslog'
import { LoggerFactory, LOG_DEBUG } from './logging/LoggerFactory'
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
  .command('w2j')
  .description('convert Warcraft III binaries to JSON')
  .addArgument(new Argument('<input>', 'input directory path').argRequired())
  .addArgument(new Argument('<output>', 'output directory path').argRequired())
  .action((input, output) => {
    log.info(input, output)
  })

program
  .command('j2w')
  .description('convert JSON to Warcraft III binaries')
  .addArgument(new Argument('<input>', 'input directory path').argRequired())
  .addArgument(new Argument('<output>', 'output directory path').argRequired())
  .action((input, output) => {
    log.info(input, output)
  })

program.parse()
