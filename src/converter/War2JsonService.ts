import { LoggerFactory } from '../logging/LoggerFactory'
import { readFile, writeFile } from 'fs/promises'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import path from 'path'
import { copyFileWithDirCreation } from './FileCopier'
import EnhancementManager from '../enhancements/EnhancementManager'
import { type TriggerContainer } from '../translator/data/TriggerContainer'
import { type MapHeader } from '../translator/data/MapHeader'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import { FileBlacklist } from '../enhancements/FileBlacklist'
import { TriggerComposer } from '../enhancements/TriggerComposer'
import { type Info, type Asset, ObjectType } from '../wc3maptranslator/data'
import { FormatConverters } from './formats/FormatConverters'
import { CustomScriptsTranslator, TriggersTranslator } from '../translator'
import { AssetsTranslator, CamerasTranslator, DoodadsTranslator, InfoTranslator, ObjectsTranslator, RegionsTranslator, SoundsTranslator, StringsTranslator, TerrainTranslator, UnitsTranslator } from '../wc3maptranslator/translators'
import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { type TargetProfile } from './Profile'
import TreeIterator from '../util/TreeIterator'
import { TriggerTranslatorOutput } from '../translator/TriggersTranslator'

const log = LoggerFactory.createLogger('War2Json')

const recordedProfile: TargetProfile = {
  w3eFormatVersion: 0,
  unitsDooFormatVersion: 0,
  unitsDooFormatSubversion: 0,
  dooFormatVersion: 0,
  dooFormatSubversion: undefined,
  specialDooFormatVersion: undefined,
  w3rFormatVersion: 0,
  w3cFormatVersion: 0,
  w3sFormatVersion: 0,
  objectFormatVersion: 0,
  editorVersion: 0,
  impFormatVersion: 0,
  wtgFormatVersion: 0,
  wtgFormatSubversion: 0,
  wctFormatVersion: 0,
  w3iFormatVersion: 0
}

async function parseFile<T>(input: string, translator: ((buffer: Buffer) => Promise<T>)): Promise<T> {
  log.info('Parsing', input)
  const buffer = await readFile(input)
  const result = await translator(buffer)
  log.info('Finished parsing', input)
  return result
}

async function processFile<T>(input: string, output: string, translator: ((buffer: Buffer) => Promise<T>)): Promise<void> {
  const json = await parseFile(input, translator)
  await WriteAndCreatePath(output, FormatConverters[EnhancementManager.mapDataExtension].stringify(json), { encoding: 'utf8' })
  log.info('Finished exporting', output)
}

function objectHandlerFactory(objectType: ObjectType) {
  return async (buffer: Buffer) => {
    const [objects, formatVersion] = ObjectsTranslator.warToJson(buffer, objectType)
    // save highest version object format version
    recordedProfile.objectFormatVersion = recordedProfile.objectFormatVersion < formatVersion ? formatVersion : recordedProfile.objectFormatVersion
    return objects
  }
}

const War2JsonService = {
  convert: async function (inputPath: string, outputPath: string, profile?: TargetProfile) {
    log.info('Converting Warcraft III binaries in', inputPath, 'and outputting to', outputPath)

    let editorVersionSupplier: Promise<integer>
    let editorVersionResolver: ((version: integer) => void) | undefined
    let editorVersionRejector: ((reason?: unknown) => void) | undefined
    if (profile) {
      editorVersionSupplier = new Promise<integer>((resolve) => { resolve(profile.editorVersion) })
    } else {
      editorVersionSupplier = new Promise<integer>((resolve, reject) => {
        editorVersionResolver = resolve
        editorVersionRejector = reject
      })
    }

    let importFileResolve: (assets: Asset[])=>void
    let importFileReject: (reason: string|undefined) =>void
    const importFilePromise = new Promise<Asset[]>((resolve, reject) => {
      importFileResolve = resolve
      importFileReject = reject
    })

    let triggerFileResolve: (assets: TriggerTranslatorOutput)=>void
    let triggerFileReject: (reason: string|undefined) =>void
    const triggerFilePromise = new Promise<TriggerTranslatorOutput>((resolve, reject) => {
      triggerFileResolve = resolve
      triggerFileReject = reject
    })

    const promises: Array<Promise<unknown>> = []

    let triggerFile: string | null = null
    let customScriptFile: { input: string, output: string } | null = null
    let foundW3i = false
    let waitingForW3i = false

    for (const [parents, file] of TreeIterator<DirectoryTree>(directoryTree(inputPath, { attributes: ['type', 'extension'] }),
      (parent: directoryTree.DirectoryTree<Record<string, string>>) => {
        if (!FileBlacklist.isDirectoryTreeBlacklisted(parent)) {
          return parent.children
        }
      }
    )) {
      if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue
      const filename = file.name
      const outputFile = path.join(outputPath, path.relative(inputPath, file.path))
      if (filename.endsWith('.w3e')) {
        translator = async (buffer) => {
          const [terrain, formatVersion] = TerrainTranslator.warToJson(buffer)
          recordedProfile.w3eFormatVersion = formatVersion
          return terrain
        }
      } else if (filename.endsWith('Units.doo')) {
        waitingForW3i = true
        translator = async (buffer) => {
          const [units, formatVersion, formatSubversion] = UnitsTranslator.warToJson(buffer, await editorVersionSupplier)
          recordedProfile.unitsDooFormatVersion = formatVersion
          recordedProfile.unitsDooFormatSubversion = formatSubversion
          return units
        }
      } else if (filename.endsWith('.doo')) {
        waitingForW3i = true
        translator = async (buffer) => {
          const [doodads, formatVersion, formatSubversion, specialDooFormatVersion] = DoodadsTranslator.warToJson(buffer, await editorVersionSupplier)
          recordedProfile.dooFormatVersion = formatVersion
          recordedProfile.dooFormatSubversion = formatSubversion
          recordedProfile.specialDooFormatVersion = specialDooFormatVersion
          return doodads
        }
      } else if (filename.endsWith('.w3r')) {
        translator = async (buffer) => {
          const [terrain, formatVersion] = RegionsTranslator.warToJson(buffer)
          recordedProfile.w3rFormatVersion = formatVersion
          return terrain
        }
      } else if (filename.endsWith('.w3c')) {
        waitingForW3i = true
        translator = async (buffer) => {
          const [terrain, formatVersion] = CamerasTranslator.warToJson(buffer, await editorVersionSupplier)
          recordedProfile.w3cFormatVersion = formatVersion
          return terrain
        }
      } else if (filename.endsWith('.w3s')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, async (buffer) => {
          const [terrain, formatVersion] = SoundsTranslator.warToJson(buffer)
          recordedProfile.w3sFormatVersion = formatVersion
          return terrain
        }))
      } else if (filename.endsWith('.w3u')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, objectHandlerFactory(ObjectType.Units)))
      } else if (filename.endsWith('.w3t')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, objectHandlerFactory(ObjectType.Items)))
      } else if (filename.endsWith('.w3a')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, objectHandlerFactory(ObjectType.Abilities)))
      } else if (filename.endsWith('.w3b')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, objectHandlerFactory(ObjectType.Destructables)))
      } else if (filename.endsWith('.w3d')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, objectHandlerFactory(ObjectType.Doodads)))
      } else if (filename.endsWith('.w3q')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, objectHandlerFactory(ObjectType.Upgrades)))
      } else if (filename.endsWith('.w3h')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, objectHandlerFactory(ObjectType.Buffs)))
      } else if (filename.endsWith('.wts')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, async (buffer: Buffer) => StringsTranslator.warToJson(buffer)))
      } else if (filename.endsWith('.wtg')) {
        const handler = async (buffer: Buffer) => {
          const [triggers, formatVersion, formatSubversion] = TriggersTranslator.warToJson(buffer)
          recordedProfile.wtgFormatVersion = formatVersion
          recordedProfile.wtgFormatSubversion = formatSubversion
          // custom script here?
          triggerFileResolve(triggers)
          return triggers
        }
        if (EnhancementManager.composeTriggers) {
          promises.push(parseFile(file.path, handler))
          promises.push((async () => TriggerComposer.explodeTriggersJsonIntoSource(outputPath, (await triggerFilePromise).root))())
        } else {
          await processFile(path.join(outputPath, `triggers${EnhancementManager.mapDataExtension}`), outputFile + EnhancementManager.mapDataExtension, handler)
        }
        
        if (triggerFile != null) {
          async function () {
            const triggerJSON = await processTriggers(triggerFile, customScriptFile?.input)
            async function processTriggers(triggersFile: string, customScriptsFile?: string): Promise<TriggerContainer> {
              const asyncLog = log.getSubLogger({ name: `${TriggersTranslator.constructor.name}-${translatorCount++}` }) // TODO: move this log
            
              asyncLog.info('Reading war3map.wtg file.')
              const triggerBuffer = await readFile(triggersFile)
              const triggerJson = TriggersTranslator.warToJson(triggerBuffer)
              asyncLog.info('Read war3map.wtg file.')
            
              if (customScriptsFile != null) {
                asyncLog.info('Reading war3map.wct file.')
                const csBuffer = await readFile(customScriptsFile)
                const csResults = CustomScriptsTranslator.warToJson(csBuffer)
                asyncLog.info('Read war3map.wct file, found', csResults.scripts.length, 'custom scripts.')
            
                // Combine custom scripts into trigger JSON
                for (let i = 0; i < triggerJson.scriptReferences.length; i++) {
                  const scriptRef = triggerJson.scriptReferences[i]
                  if (scriptRef != null) {
                    scriptRef.script = csResults.scripts[i]
                  }
                }
            
                (triggerJson.root as MapHeader).description = csResults.headerComment
              }
            
              return triggerJson.root
            }
            
          }
        } else if (customScriptFile != null) {
          promises.push(copyFileWithDirCreation(customScriptFile.input, customScriptFile.output))
        }
      } else if (filename.endsWith('.wct')) {
        const outputFile = path.join(outputPath, path.relative(inputPath, file.path)) + EnhancementManager.mapDataExtension
        customScriptFile = { input: file.path, output: outputFile }
        translator = async (buffer) => {
          const [customScripts, formatVersion] = CustomScriptsTranslator.warToJson(buffer)
          recordedProfile.wctFormatVersion = formatVersion
          return customScripts
        }
      } else if (filename.endsWith('.w3i')) {
        foundW3i = true
        translator = async (buffer) => {
          const [info, formatVersion, editorVersion] = InfoTranslator.warToJson(buffer)
          recordedProfile.w3iFormatVersion = formatVersion
          recordedProfile.editorVersion = editorVersion
          editorVersionResolver?.(editorVersion)
          return info
        }
      } else if (filename.endsWith('.imp')) {
        promises.push(parseFile(file.path, async (buffer) => {
          const [assets, formatVersion] = AssetsTranslator.warToJson(buffer)
          recordedProfile.impFormatVersion = formatVersion
          log.info('Read war3map.imp, found', assets.length, 'assets')
          importFileResolve(assets)
          return assets
        }))
      } else {
        if (EnhancementManager.smartImport) {
          importFilePromise.then((assets: Asset[]) => {
            const relativeInput = path.relative(inputPath, file.path)
            let found = false
            for (const asset of assets) {
              if (path.normalize(asset.path) === path.normalize(relativeInput)) {
                found = true
                break
              }
            }
            if (found) {
              const outputFile = path.join(outputPath, EnhancementManager.importFolder, relativeInput)
              promises.push(copyFileWithDirCreation(file.path, outputFile))
            } else {
              promises.push(copyFileWithDirCreation(file.path, outputFile))
            }
          }).catch(() => {
            promises.push(copyFileWithDirCreation(file.path, outputFile))
          })
        } else {
          promises.push(copyFileWithDirCreation(file.path, outputFile))
        }
      }
    }

    if (waitingForW3i && !foundW3i) {
      editorVersionRejector?.('Editor version not supplied, nor is war3map.w3i file found.')
    }

    return await Promise.all(promises)
  }
}

export default War2JsonService
