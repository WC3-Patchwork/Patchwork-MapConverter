#!/usr/bin/env node

'use strict'
import { Argument, Option, program } from 'commander'
import { NAME, DESCRIPTION, VERSION } from './metadata'
import { LoggerFactory, LOG_DEBUG, AppLogger } from './logging/LoggerFactory'
import path from 'path'
import fs from 'fs'

import * as Wc3MapTranslator from './wc3maptranslator'
import * as PatchworkTranslator from './translator'
import * as Converters from './converter'
import * as Enhancements from './enhancements'

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
require('source-map-support').install()

let log: AppLogger
const EnhancementManager = Enhancements.EnhancementManager

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
  .addOption(new Option('-tf, --triggers-filename', 'Filename for triggers file which contains both GUI triggers and custom scripts, Does not work with compose-triggers.').default(EnhancementManager.triggersFilename))
  .option('-ct, --compose-triggers', 'unpack/compile triggers into/from binary/fs+json representation, following options apply only if this is enabled:')
  .addOption(new Option('-sf, --sourceFolder <sourceFolder>', 'Triggers\' source folder to export to/read from trigger related files').default(EnhancementManager.sourceFolder))
  .addOption(new Option('-cse, --custom-script-extension <extension>', 'What file extension will be given to all custom scripts').default(EnhancementManager.scriptExtension))
  .addOption(new Option('-dis, --disabled-extension <extension>', 'What suffix will file\'s extension get when custom script is disabled').default(EnhancementManager.disabledExtension))
  .addOption(new Option('-ge, --gui-extension <extension>', 'What file extension will be given to GUI elements (Triggers and Variables)').default(EnhancementManager.guiExtension))
  .addOption(new Option('-cie, --container-info-extension <extension', 'What file extension will be given to trigger category/library/header for metadata').default(EnhancementManager.containerInfoExtension))
  .addOption(new Option('-ce, --comment-extension <extension>', 'What file extension will be given to comments').default(EnhancementManager.commentExtension))
  .addOption(new Option('-mh, --map-header <filename>', 'What\'s the map header\'s filename').default(EnhancementManager.mapHeaderFilename))
  .addOption(new Option('-ctf, --chunkified-terrain-folder', 'In which folder are terrain chunks gonne be exported into.').default(EnhancementManager.chunkifiedTerrainFolder))
  .option('-chunk, --chunkify', 'Aggregates terrain, preplaced objects, and regions data into multiple chunk files')
  .addOption(new Option('-cfe, --chunk-file-extension <extension>', 'What file extension will chunk files have?').default(EnhancementManager.chunkFileExtension))
  .addOption(new Option('-cs, --chunk-size <sizeX,sizeY,offsetX,offsetY>', 'How many 4x4\'s does fit under a single chunk file, offset is by how much 4x4\'s do you wanna offset the main chunk grid').argParser((value) => {
    const [sizeX, sizeY, offsetX, offsetY] = value.split(',')
    EnhancementManager.chunkSize.sizeX = Number.parseInt(sizeX)
    EnhancementManager.chunkSize.sizeY = Number.parseInt(sizeY)
    EnhancementManager.chunkSize.offsetX = Number.parseInt(offsetX)
    EnhancementManager.chunkSize.offsetY = Number.parseInt(offsetY)
    return EnhancementManager.chunkSize
  }).default(EnhancementManager.chunkSize))
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

    Enhancements.FileBlacklist.readBlacklist(options.ignore as string)

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

    if (/\\|\//.test(options.triggersFilename as string)) {
      throw new Error(`Invalid triggersFilename '${options.triggersFilename}' must not be a path!`)
    } else {
      if (options.composeTriggers) {
        log.warn(`Will ignore triggersFilename options since composeTriggers is enabled.`)
      } else {
        EnhancementManager.triggersFilename = options.triggersFilename as string
      }
    }

    if (options.chunkify === true) EnhancementManager.chunkifyMapData = true
    if (/\\|\//.test(options.chunkifiedTerrainFolder as string)) {
      throw new Error(`Invalid chunkifiedTerrainFolder '${options.chunkifiedTerrainFolder}' must not be a path!`)
    } else {
      EnhancementManager.chunkifiedTerrainFolder = options.chunkifiedTerrainFolder as string
    }
    if ((options.chunkFileExtension as string).startsWith('.')) EnhancementManager.chunkFileExtension = options.chunkFileExtension as string
    if ((options.chunkSize != null)) {
      EnhancementManager.chunkSize = options.chunkSize as Wc3MapTranslator.Data.MapSize
      if (EnhancementManager.chunkSize.sizeX <= 0) throw new Error('Chunk sizeX must be a positive integer!')
      if (EnhancementManager.chunkSize.sizeY <= 0) throw new Error('Chunk sizeY must be a positive integer!')
    }

    if (options.prettify === true) EnhancementManager.prettify = true

    if (/\\|\//.test(options.mapHeader as string)) {
      throw new Error(`Invalid mapHeader '${options.mapHeader as string}' must not be a path!`)
    } else {
      EnhancementManager.mapHeaderFilename = options.mapHeader as string
    }
    if (options.triggerData != null && fs.existsSync(options.triggerData as string)) {
      Enhancements.TriggerDataRegistry.loadTriggerData(options.triggerData as string)
    }
  })

program
  .command('war2json')
  .description('convert Warcraft III binaries to JSON')
  .option('-gtp, --generate-target-profile', 'Generate target profile json file for json2war')
  .addArgument(new Argument('<input>', 'input directory path').argRequired())
  .addArgument(new Argument('<output>', 'output directory path').argRequired())
  .addArgument(new Argument('<target>', 'target profile name or path').argOptional())
  .hook('preAction', (thisCommand, actionCommand) => {
    const options = actionCommand.opts()
    if (options.generateTargetProfile) EnhancementManager.generateTargetProfile = true
    log.info('Will generate target profile JSON file')
  })
  .action(async (input: string, output: string, target?: string) => {
    try {
      let profile: Converters.TargetProfile | undefined
      if (target) {
        profile = await Converters.ProfileLoader.LoadTargetProfile(target)
      }
      await Converters.War2JsonService.convert(input, output, profile)
      log.info('Finished converting map folder to textual representations!')
    } catch (exception) {
      log.fatal(exception)
    }
  })

program
  .command('json2war')
  .description('convert JSON to Warcraft III binaries')
  .addArgument(new Argument('<input>', 'input directory path').argRequired())
  .addArgument(new Argument('<output>', 'output directory path').argRequired())
  .addArgument(new Argument('<target>', 'target profile name or path').argRequired())
  .action(async (input: string, output: string, target: string) => {
    try {
      await Converters.Json2WarService.convert(input, output, await Converters.ProfileLoader.LoadTargetProfile(target))
      log.info('Finished converting textual representations to map folder!')
    } catch (exception) {
      log.fatal(exception)
    }
  })

program.parse()

export { Wc3MapTranslator, PatchworkTranslator, Converters, Enhancements }