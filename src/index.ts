'use strict'
import { Argument, Option, program } from 'commander'
import { NAME, DESCRIPTION, VERSION } from './metadata'
import { type ILogObj, type Logger } from 'tslog'
import { LoggerFactory, LOG_DEBUG } from './logging/LoggerFactory'
import War2JsonService from './converter/War2JsonService'
import Json2WarService from './converter/Json2WarService'
import EnhancementManager from './enhancements/EnhancementManager'
import { TriggerDataRegistry } from './enhancements/TriggerDataRegistry'
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('source-map-support').install()

let log: Logger<ILogObj>

program
  .name(NAME)
  .version(VERSION)
  .description(DESCRIPTION)
  .option('-d, --debug', 'output extra debugging')
  .option('-si, --smart-imports', 'unpack/compile imports using/into .imp file as reference, ignores .json version if enabled')
  .addOption(new Option('-imp, --importsFolderName', 'map project imports folder name for smart-imports').default('imports'))
  .hook('preAction', (thisCommand, actionCommand) => {
    const options = thisCommand.opts()
    if (options.debug === true) LoggerFactory.setLogLevel(LOG_DEBUG)
    if (options.smartImports === true) EnhancementManager.smartImport = true
    if (options.importsFolderName != null) {
      if (/\\|\//.test(options.importsFolderName as string)) {
        throw new Error(`Invalid importsFolderName '${options.importsFolderName as string}' must not be a path!`)
      } else {
        EnhancementManager.importFolder = options.importsFolderName as string
      }
    }
    log = LoggerFactory.createLogger('main')
    log.debug('command:', actionCommand.name())
    log.debug('arguments:', actionCommand.args.join(', '))
    log.debug('options:', JSON.stringify(thisCommand.opts()))
  })

program
  .command('war2json')
  .description('convert Warcraft III binaries to JSON')
  .addArgument(new Argument('<input>', 'input directory path').argRequired())
  .addArgument(new Argument('<output>', 'output directory path').argRequired())
  .addArgument(new Argument('<trigger-data-filepath>', 'WE\'s trigger data ini file location required for converting WTG file.').default('triggerdata.txt').argOptional())
  .action(async (input: string, output: string, triggerDataFilepath: string) => {
    try {
      TriggerDataRegistry.loadTriggerData(triggerDataFilepath)

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
  .action(async (input: string, output: string) => {
    try {
      await Json2WarService.convert(input, output)
    } catch (exception) {
      log.fatal(exception)
    }
  })

program.parse()
