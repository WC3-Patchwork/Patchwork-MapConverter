#!/usr/bin/env node

'use strict'
import { Argument, Option, program } from 'commander'
import { NAME, DESCRIPTION, VERSION } from './metadata'
import { type ILogObj, type Logger } from 'tslog'
import { LoggerFactory, LOG_DEBUG } from './logging/LoggerFactory'
import War2JsonService from './converter/War2JsonService'
import Json2WarService from './converter/Json2WarService'
import EnhancementManager from './enhancements/EnhancementManager'
import { TriggerDataRegistry } from './enhancements/TriggerDataRegistry'
import { FileBlacklist } from './enhancements/FileBlacklist'
import path from 'path'
import fs from 'fs'
import { SupplementTranslatorRecord } from './converter/TranslatorRecord'
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('source-map-support').install()

let log: Logger<ILogObj>

program
  .name(NAME)
  .version(VERSION)
  .description(DESCRIPTION)
  .option('-d, --debug', 'output extra debugging')
  .option('-si, --smart-imports', 'unpack/compile imports using/into .imp file as reference, ignores .json version if enabled')
  .addOption(new Option('-imp, --imports-folder-name <importsFolderName>', 'map project imports folder name for smart-imports').default(EnhancementManager.importFolder))
  .addOption(new Option('-td, --trigger-data <triggerData>', 'TriggerData.txt file location for reading triggers file.').default(path.join('./', EnhancementManager.triggerDataPath)))
  .addOption(new Option('--ignore <blacklist>', 'Specify a blacklist location for which files to ignore').default(path.join('./', EnhancementManager.ignoreFilelist)))
  .addOption(new Option('-mde, --map-data-extension <extension>', 'File extension given/read (depending on operation) for map data files (w3u, w3d, etc..)').default(EnhancementManager.mapDataExtension))
  .option('-p, --prettify', 'Output textual format should be prettified if format converter supports it.')
  .option('-ct, --compose-triggers', 'unpack/compile triggers into/from binary/fs+json representation, following options apply only if this is enabled:')
  .addOption(new Option('-sf, --sourceFolder <sourceFolder>', 'Triggers\' source folder to export to/read from trigger related files').default(EnhancementManager.sourceFolder))
  .addOption(new Option('-cse, --custom-script-extension <extension>', 'What file extension will be given to all custom scripts').default(EnhancementManager.scriptExtension))
  .addOption(new Option('-dis, --disabled-extension <extension>', 'What suffix will file\'s extension get when custom script is disabled').default(EnhancementManager.disabledExtension))
  .addOption(new Option('-ge, --gui-extension <extension>', 'What file extension will be given to GUI elements (Triggers and Variables)').default(EnhancementManager.guiExtension))
  .addOption(new Option('-cie, --container-info-extension <extension', 'What file extension will be given to trigger category/library/header for metadata').default(EnhancementManager.containerInfoExtension))
  .addOption(new Option('-ce, --comment-extension <extension>', 'What file extension will be given to comments').default(EnhancementManager.commentExtension))
  .addOption(new Option('-mh, --map-header <filename>', 'What\'s the map header\'s filename').default(EnhancementManager.mapHeaderFilename))
  .hook('preAction', (thisCommand, actionCommand) => {
    log = LoggerFactory.createLogger('main')
    const options = thisCommand.opts()

    log.debug('command:', actionCommand.name())
    log.debug('arguments:', actionCommand.args.join(', '))
    log.debug('options:', JSON.stringify(thisCommand.opts()))

    if (options.debug === true) LoggerFactory.setLogLevel(LOG_DEBUG)
    if (options.smartImports === true) EnhancementManager.smartImport = true
    if (options.composeTriggers === true) EnhancementManager.composeTriggers = true

    if (/\\|\//.test(options.importsFolderName as string)) {
      throw new Error(`Invalid importsFolderName '${options.importsFolderName as string}' must not be a path!`)
    } else {
      EnhancementManager.importFolder = options.importsFolderName as string
    }

    if (/\\|\//.test(options.sourceFolder as string)) {
      throw new Error(`Invalid sourceFolder '${options.sourceFolder as string}' must not be a path!`)
    } else {
      EnhancementManager.sourceFolder = options.sourceFolder as string
    }

    FileBlacklist.readBlacklist(options.ignore as string)

    if (/\\|\//.test(options.sourceFolder as string)) {
      throw new Error(`Invalid importsFolderName '${options.importsFolderName as string}' must not be a path!`)
    } else {
      EnhancementManager.importFolder = options.importsFolderName as string
    }

    if ((options.customScriptExtension as string).startsWith('.')) EnhancementManager.scriptExtension = options.customScriptExtension as string
    if ((options.disabledExtension as string).startsWith('.')) EnhancementManager.disabledExtension = options.disabledExtension as string
    if ((options.guiExtension as string).startsWith('.')) EnhancementManager.guiExtension = options.guiExtension as string
    if ((options.containerInfoExtension as string).startsWith('.')) EnhancementManager.containerInfoExtension = options.containerInfoExtension as string
    if ((options.commentExtension as string).startsWith('.')) EnhancementManager.commentExtension = options.commentExtension as string
    if ((options.mapDataExtension as string).startsWith('.')) EnhancementManager.mapDataExtension = options.mapDataExtension as string

    if (options.prettify === true) EnhancementManager.prettify = true

    if (/\\|\//.test(options.mapHeader as string)) {
      throw new Error(`Invalid mapHeader '${options.mapHeader as string}' must not be a path!`)
    } else {
      EnhancementManager.mapHeaderFilename = options.mapHeader as string
    }
    if (options.triggerData != null && fs.existsSync(options.triggerData as string)) {
      TriggerDataRegistry.loadTriggerData(options.triggerData as string)
    }
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
  .action(async (input: string, output: string) => {
    try {
      SupplementTranslatorRecord(EnhancementManager.mapDataExtension)
      await Json2WarService.convert(input, output)
    } catch (exception) {
      log.fatal(exception)
    }
  })

program.parse()
