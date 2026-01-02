import path from 'path'
import { LoggerFactory } from '../logging/LoggerFactory'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import { copyFileWithDirCreation } from './FileCopier'
import { readFile } from 'fs/promises'
import EnhancementManager from '../enhancements/EnhancementManager'
import ImportComposer from '../enhancements/ImportComposer'
import { type TriggerContainer } from '../translator/data/TriggerContainer'
import { ContentType, type TriggerContent } from '../translator/data/content/TriggerContent'
import { type ScriptContent } from '../translator/data/properties/ScriptContent'
import { type MapHeader } from '../translator/data/MapHeader'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import { FileBlacklist } from '../enhancements/FileBlacklist'
import { TriggerComposer } from '../enhancements/TriggerComposer'
import { Camera, Info, ObjectModificationTable, ObjectType, Region, Sound, Terrain, Unit, type Asset } from '../wc3maptranslator/data'
import { AssetsTranslator, CamerasTranslator, DoodadsTranslator, InfoTranslator, ObjectsTranslator, RegionsTranslator, SoundsTranslator, StringsTranslator, TerrainTranslator, UnitsTranslator } from '../wc3maptranslator/translators'
import { FormatConverters } from './formats/FormatConverters'
import { translators } from '../translator'
import { type TriggerTranslatorOutput } from '../translator/TriggersTranslator'
import { type TargetProfile } from './Profile'
import TreeIterator from '../util/TreeIterator'
import { AsyncTaskContextWrapper } from '../logging/AsyncTaskContextWrapper'
import { TerrainChunkifier } from '../enhancements/TerrainChunkifier'
import { DoodadsTranslatorOutput } from '../wc3maptranslator/translators/DoodadsTranslator'
import { CustomScriptsTranslatorOutput } from '../translator/CustomScriptsTranslator'
import PromiseSupplier from '../util/PromiseSupplier'
const log = LoggerFactory.createLogger('Json2War')

async function parseFileNoAsyncContext<T>(input: string): Promise<T> {
  log.info('Parsing', input)
  const data = FormatConverters[EnhancementManager.mapDataExtension].parse(await readFile(input, { encoding: 'utf8' })) as object
  log.info('Finished parsing', input)
  return data as T
}

async function parseFile<T>(input: string): Promise<T> {
  return AsyncTaskContextWrapper(async () => {
    return parseFileNoAsyncContext(input)
  })
}

async function processDataNoAsyncContext<T>(data: T, output: string, translator: ((json: T) => Buffer)): Promise<void> {
  return WriteAndCreatePath(output, translator(data), { encoding: 'utf8' })
}

async function processData<T>(data: T, output: string, translator: ((json: T) => Buffer)): Promise<void> {
  return AsyncTaskContextWrapper(async () => {
    log.info('Writing file', output)
    await processDataNoAsyncContext(data, output, translator)
    log.info(`Writing file ${output} complete`)
  })
}

async function processFile<T>(input: string, output: string, translator: ((json: T) => Buffer)): Promise<void> {
  await AsyncTaskContextWrapper(async () => {
    log.info('Processing', input)
    const json = await parseFileNoAsyncContext<T>(input)
    await processDataNoAsyncContext(json, output, translator)
    log.info('Finished processing', output)
  })
}

async function exportImportsFile(data: Asset[], output: string, profile: TargetProfile): Promise<void> {
  await AsyncTaskContextWrapper(async () => {
    log.info('Exporting generated war3map.imp file.')
    const buffer = AssetsTranslator.jsonToWar(data, profile.impFormatVersion)
    await WriteAndCreatePath(output, buffer)
    log.info('Finished exporting', output)
  })
}

function getAllContentForScriptFile(root: TriggerContainer): TriggerContent[] {
  const triggerStack: TriggerContent[] = [root]
  const result: TriggerContent[] = []
  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue
    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
        result.push(currentTrigger)
      // eslint-disable-next-line no-fallthrough
      case ContentType.LIBRARY:
      case ContentType.CATEGORY:
        triggerStack.push(...(currentTrigger as TriggerContainer).children.reverse())
        break
      case ContentType.CUSTOM_SCRIPT:
      case ContentType.TRIGGER:
      case ContentType.TRIGGER_SCRIPTED:
        result.push(currentTrigger)
        break
    }
  }

  return result
}

async function exportTriggers(triggersJson: MapHeader, output: string, profile: TargetProfile): Promise<void> {
  await AsyncTaskContextWrapper(async () => {
    const tasks: Promise<unknown>[] = []
    const triggerAndScript: TriggerTranslatorOutput = {
      root            : triggersJson,
      scriptReferences: getAllContentForScriptFile(triggersJson) as ScriptContent[]
    }

    const triggerBuffer = translators.TriggersTranslator.jsonToWar(triggerAndScript, profile.wtgFormatVersion, profile.wtgVariableFormatVersion, profile.wtgFormatSubversion)
    tasks.push(WriteAndCreatePath(path.join(output, 'war3map.wtg'), triggerBuffer)
      .then(() => log.info('Finished exporting triggers.')))

    const scriptArg: { headerComment: string, scripts: string[] } = { headerComment: '', scripts: [] }
    for (const trigger of triggerAndScript.scriptReferences) {
      if (trigger != null) {
        if ((trigger as MapHeader).children != null) { // Found header
          scriptArg.headerComment = trigger.description
        }
        scriptArg.scripts.push(trigger.script)
      } else {
        scriptArg.scripts.push('')
      }
    }

    const scriptBuffer = translators.CustomScriptsTranslator.jsonToWar(scriptArg, profile.wctFormatVersion, profile.wctFormatSubversion)
    tasks.push(WriteAndCreatePath(path.join(output, 'war3map.wct'), scriptBuffer)
      .then(() => log.info('Finished exporting custom scripts.')))

    await Promise.all(tasks)
  })
}

export const Json2WarService = {
  async convert(inputPath: string, outputPath: string, profile: TargetProfile): Promise<void> {
    log.info(`Converting Warcraft III json data in '${inputPath}' and outputting to '${outputPath}'`)

    const promises: Promise<unknown>[] = []
    let importDirectoryTree: DirectoryTree<Record<string, unknown>> | null = null

    for (const [, file] of TreeIterator<DirectoryTree>(directoryTree(inputPath, { attributes: ['type', 'extension'] }), (parent: directoryTree.DirectoryTree<Record<string, string>>) => {
      if (FileBlacklist.isDirectoryTreeBlacklisted(parent)) return
      if (EnhancementManager.smartImport && parent.path.endsWith(EnhancementManager.importFolder)) {
        importDirectoryTree = parent
        return // skip imports
      }

      if (EnhancementManager.composeTriggers && parent.path.endsWith(EnhancementManager.sourceFolder)) {
        log.debug('ComposeTriggers requested')
        promises.push((async (): Promise<void> => {
          const triggerJson = await TriggerComposer.composeTriggerJson(parent) as MapHeader
          await exportTriggers(triggerJson, outputPath, profile)
        })())
        return // skip triggers
      }

      if (EnhancementManager.chunkifyMapData && parent.path.endsWith(EnhancementManager.chunkifiedTerrainFolder)) {
        log.debug('ChunkifyMapData requested')
        promises.push((async (): Promise<void> => {
          const [terrain, doodads, specialDoodads, units, regions, cameras] = await TerrainChunkifier.composeTerrain(parent)
          const mapDataPromises: Promise<unknown>[] = []
          mapDataPromises.push(processData(terrain, path.join(outputPath, 'war3map.w3e'),
            terrain => TerrainTranslator.jsonToWar(terrain, profile.w3eFormatVersion)))
          mapDataPromises.push(processData({ doodads, specialDoodads }, path.join(outputPath, 'war3map.doo'),
            ({ doodads, specialDoodads }) => DoodadsTranslator.jsonToWar({ doodads, specialDoodads }, profile.dooFormatVersion, profile.dooFormatSubversion, profile.specialDooFormatVersion, profile.editorVersion)))
          mapDataPromises.push(processData(units, path.join(outputPath, 'war3mapUnits.doo'),
            units => UnitsTranslator.jsonToWar(units, profile.unitsDooFormatVersion, profile.unitsDooFormatSubversion, profile.editorVersion)))
          mapDataPromises.push(processData(regions, path.join(outputPath, 'war3map.w3r'),
            regions => RegionsTranslator.jsonToWar(regions, profile.w3rFormatVersion)))
          mapDataPromises.push(processData(cameras, path.join(outputPath, 'war3map.w3c'),
            cameras => CamerasTranslator.jsonToWar(cameras, profile.w3cFormatVersion, profile.editorVersion)))
          await Promise.all(mapDataPromises)
        })())
        return // skip map chunks
      }
      return parent.children
    })) {
      if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue
      if (file.type === 'directory') continue

      // TODO: when chunkify and both normal files detected, merge?
      const filename = file.name
      const outputFile = path.join(outputPath, path.relative(inputPath, file.path))
      const translatedOutputFile = outputFile.substring(0, outputFile.lastIndexOf('.')) // remove final extension
      if (filename.endsWith(`.w3e${EnhancementManager.mapDataExtension}`)) {
        if (EnhancementManager.chunkifyMapData) {
          log.warn(`Detected war3map.w3e${EnhancementManager.mapDataExtension} but Chunkify Map Data option is requested, will ignore this file.`)
        } else {
          promises.push(processFile<Terrain>(file.path, translatedOutputFile,
            terrain => TerrainTranslator.jsonToWar(terrain, profile.w3eFormatVersion))
          )
        }
      } else if (filename.endsWith(`Units.doo${EnhancementManager.mapDataExtension}`)) {
        if (EnhancementManager.chunkifyMapData) {
          log.warn(`Detected war3mapUnits.doo${EnhancementManager.mapDataExtension} but Chunkify Map Data option is requested, will ignore this file.`)
        } else {
          promises.push(processFile<Unit[]>(file.path, translatedOutputFile,
            units => UnitsTranslator.jsonToWar(units, profile.unitsDooFormatVersion, profile.unitsDooFormatSubversion, profile.editorVersion))
          )
        }
      } else if (filename.endsWith(`.doo${EnhancementManager.mapDataExtension}`)) {
        if (EnhancementManager.chunkifyMapData) {
          log.warn(`Detected war3map.doo${EnhancementManager.mapDataExtension} but Chunkify Map Data option is requested, will ignore this file.`)
        } else {
          promises.push(processFile<DoodadsTranslatorOutput>(file.path, translatedOutputFile,
            doodads => DoodadsTranslator.jsonToWar(doodads, profile.dooFormatVersion, profile.dooFormatSubversion, profile.specialDooFormatVersion, profile.editorVersion)
          ))
        }
      } else if (filename.endsWith(`.w3r${EnhancementManager.mapDataExtension}`)) {
        if (EnhancementManager.chunkifyMapData) {
          log.warn(`Detected war3map.w3r${EnhancementManager.mapDataExtension} but Chunkify Map Data option is requested, will ignore this file.`)
        } else {
          promises.push(processFile<Region[]>(file.path, translatedOutputFile,
            regions => RegionsTranslator.jsonToWar(regions, profile.w3rFormatVersion)
          ))
        }
      } else if (filename.endsWith(`.w3c${EnhancementManager.mapDataExtension}`)) {
        if (EnhancementManager.chunkifyMapData) {
          log.warn(`Detected war3map.w3c${EnhancementManager.mapDataExtension} but Chunkify Map Data option is requested, will ignore this file.`)
        } else {
          promises.push(processFile<Camera[]>(file.path, translatedOutputFile,
            cameras => CamerasTranslator.jsonToWar(cameras, profile.w3cFormatVersion, profile.editorVersion)
          ))
        }
      } else if (filename.endsWith(`.w3s${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<Sound[]>(file.path, translatedOutputFile,
          sounds => SoundsTranslator.jsonToWar(sounds, profile.w3sFormatVersion)
        ))
      } else if (filename.endsWith(`.w3u${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<ObjectModificationTable>(file.path, translatedOutputFile,
          objects => ObjectsTranslator.jsonToWar(objects, ObjectType.Units, profile.objectFormatVersion)
        ))
      } else if (filename.endsWith(`.w3t${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<ObjectModificationTable>(file.path, translatedOutputFile,
          objects => ObjectsTranslator.jsonToWar(objects, ObjectType.Items, profile.objectFormatVersion)
        ))
      } else if (filename.endsWith(`.w3a${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<ObjectModificationTable>(file.path, translatedOutputFile,
          objects => ObjectsTranslator.jsonToWar(objects, ObjectType.Abilities, profile.objectFormatVersion)
        ))
      } else if (filename.endsWith(`.w3b${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<ObjectModificationTable>(file.path, translatedOutputFile,
          objects => ObjectsTranslator.jsonToWar(objects, ObjectType.Destructables, profile.objectFormatVersion)
        ))
      } else if (filename.endsWith(`.w3d${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<ObjectModificationTable>(file.path, translatedOutputFile,
          objects => ObjectsTranslator.jsonToWar(objects, ObjectType.Doodads, profile.objectFormatVersion)
        ))
      } else if (filename.endsWith(`.w3q${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<ObjectModificationTable>(file.path, translatedOutputFile,
          objects => ObjectsTranslator.jsonToWar(objects, ObjectType.Upgrades, profile.objectFormatVersion)
        ))
      } else if (filename.endsWith(`.w3h${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<ObjectModificationTable>(file.path, translatedOutputFile,
          objects => ObjectsTranslator.jsonToWar(objects, ObjectType.Buffs, profile.objectFormatVersion)
        ))
      } else if (filename.endsWith(`.wts${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<Record<string, string>>(file.path, translatedOutputFile,
          StringsTranslator.jsonToWar
        ))
      } else if (filename == (`${EnhancementManager.triggersFilename}${EnhancementManager.mapDataExtension}`)) {
        if (EnhancementManager.composeTriggers) {
          log.warn(`Found triggers${EnhancementManager.mapDataExtension}, but Compose Triggers is enabled, skipping...`)
        } else {
          const [triggersPromise, triggersResolve, triggersReject] = PromiseSupplier<void>()
          promises.push(triggersPromise)
          promises.push(parseFile<MapHeader>(file.path)
            .then(triggers => exportTriggers(triggers, outputPath, profile)
              .then(triggersResolve)
              .catch(triggersReject)
            ).catch(triggersReject))
        }
        promises.push(processFile<CustomScriptsTranslatorOutput>(file.path, translatedOutputFile,
          scripts => translators.CustomScriptsTranslator.jsonToWar(scripts, profile.wctFormatVersion)
        ))
      } else if (filename.endsWith(`.w3i${EnhancementManager.mapDataExtension}`)) {
        promises.push(processFile<Info>(file.path, translatedOutputFile,
          info => InfoTranslator.jsonToWar(info, profile.w3iFormatVersion)
        ))
      } else if (filename.endsWith('.imp')) {
        if (EnhancementManager.smartImport) {
          log.warn(`Detected war3map.imp${EnhancementManager.mapDataExtension} but Smart Import option is requested, will ignore this file.`)
        } else {
          promises.push(processFile<Asset[]>(file.path, translatedOutputFile,
            assets => AssetsTranslator.jsonToWar(assets, profile.impFormatVersion)
          ))
        }
      } else {
        promises.push(copyFileWithDirCreation(file.path, outputFile))
      }
    }

    if (EnhancementManager.smartImport) {
      log.debug('SmartImports requested')
      const importFileOutputPath = path.join(outputPath, 'war3map.imp')
      if (importDirectoryTree != null) {
        const importedFiles = ImportComposer.composeImportRegistry(importDirectoryTree)
        promises.push(exportImportsFile(importedFiles, importFileOutputPath, profile))

        for (const [, file] of TreeIterator<DirectoryTree>(directoryTree(importDirectoryTree, { attributes: ['type', 'extension'] }), (parent: directoryTree.DirectoryTree<Record<string, string>>) => {
          if (FileBlacklist.isDirectoryTreeBlacklisted(parent)) return
          return parent.children
        })) {
          if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue
          if (file.type === 'directory') continue
          const outputFile = path.join(outputPath, path.relative((importDirectoryTree as DirectoryTree<Record<string, string>>).path, file.path))
          promises.push(copyFileWithDirCreation(file.path, outputFile))
        }
      } else {
        promises.push(exportImportsFile([], importFileOutputPath, profile))
      }
    }

    await Promise.all(promises)
  }
}