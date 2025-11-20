import { LoggerFactory } from '../logging/LoggerFactory'
import { readFile } from 'fs/promises'
import directoryTree, { type DirectoryTree } from 'directory-tree'
import path from 'path'
import { copyFileWithDirCreation } from './FileCopier'
import EnhancementManager from '../enhancements/EnhancementManager'
import { WriteAndCreatePath }from '../util/WriteAndCreatePath'
import { FileBlacklist } from '../enhancements/FileBlacklist'
import { type Asset, ObjectType, Terrain, Unit, Camera, Region } from '../wc3maptranslator/data'
import { FormatConverters } from './formats/FormatConverters'
import { MapHeader, translators } from '../translator'
import { AssetsTranslator, CamerasTranslator, DoodadsTranslator, InfoTranslator, ObjectsTranslator, RegionsTranslator, SoundsTranslator, StringsTranslator, TerrainTranslator, UnitsTranslator } from '../wc3maptranslator/translators'
import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { type TargetProfile } from './Profile'
import TreeIterator from '../util/TreeIterator'
import { TriggerTranslatorOutput } from '../translator/TriggersTranslator'
import { CustomScriptsTranslatorOutput } from '../translator/CustomScriptsTranslator'
import { DoodadsTranslatorOutput } from '../wc3maptranslator/translators/DoodadsTranslator'
import PromiseSupplier from '../util/PromiseSupplier'
import { TerrainChunkifier } from '../enhancements/TerrainChunkifier'
import { TriggerComposer } from '../enhancements'

const log = LoggerFactory.createLogger('War2Json')

const recordedProfile: TargetProfile = {
  w3eFormatVersion        : 0,
  unitsDooFormatVersion   : 0,
  unitsDooFormatSubversion: 0,
  dooFormatVersion        : 0,
  dooFormatSubversion     : undefined,
  specialDooFormatVersion : undefined,
  w3rFormatVersion        : 0,
  w3cFormatVersion        : 0,
  w3sFormatVersion        : 0,
  objectFormatVersion     : 0,
  editorVersion           : 0,
  impFormatVersion        : 0,
  wtgFormatVersion        : 0,
  wtgFormatSubversion     : 0,
  wctFormatVersion        : 0,
  w3iFormatVersion        : 0
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
  return async(buffer: Buffer) => {
    const [objects, formatVersion] = ObjectsTranslator.warToJson(buffer, objectType)
    // save highest version object format version
    recordedProfile.objectFormatVersion = recordedProfile.objectFormatVersion < formatVersion ? formatVersion : recordedProfile.objectFormatVersion
    return objects
  }
}

export const War2JsonService = {
  convert: async function(inputPath: string, outputPath: string, profile?: TargetProfile) {
    log.info('Converting Warcraft III binaries in', inputPath, 'and outputting to', outputPath)

    let foundInfo = false
    let editorVersionSupplier: Promise<integer>
    let editorVersionResolver: ((version: integer) => void) | undefined
    let editorVersionReject: ((reason?: unknown) => void) | undefined
    if (profile) {
      editorVersionSupplier = new Promise<integer>((resolve) => { resolve(profile.editorVersion) })
    } else {
      editorVersionSupplier = new Promise<integer>((resolve, reject) => {
        editorVersionResolver = resolve
        editorVersionReject = reject
      })
    }

    let foundTerrain = false
    const [terrainFilePromise, terrainFileResolve, terrainFileReject] = PromiseSupplier<Terrain>()

    let foundUnits = false
    const [unitsFilePromise, unitsFileResolve, unitsFileReject] = PromiseSupplier<Unit[]>()

    let foundDoodads = false
    const [doodadsFilePromise, doodadsFileResolve, doodadsFileReject] = PromiseSupplier<DoodadsTranslatorOutput>()

    let foundRegions = false
    const [regionsFilePromise, regionsFileResolve, regionsFileReject] = PromiseSupplier<Region[]>()

    let foundCameras = false
    const [camerasFilePromise, camerasFileResolve, camerasFileReject] = PromiseSupplier<Camera[]>()

    let foundImports = false
    const [importFilePromise, importFileResolve, importFileReject] = PromiseSupplier<Asset[]>()

    let foundTriggers = false
    const [triggerFilePromise, triggerFileResolve, triggerFileReject] = PromiseSupplier<TriggerTranslatorOutput>()

    let foundCustomScripts = false
    const [customScriptFilePromise, customScriptFileResolve, customScriptFileReject] = PromiseSupplier<CustomScriptsTranslatorOutput>()

    const promises: Promise<unknown>[] = []

    for (const [, file] of TreeIterator<DirectoryTree>(directoryTree(inputPath, { attributes: ['type', 'extension'] }), (parent: directoryTree.DirectoryTree<Record<string, string>>) => {
      if (!FileBlacklist.isDirectoryTreeBlacklisted(parent)) {
        return parent.children
      }
    })) {
      if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue
      const filename = file.name
      const outputFile = path.join(outputPath, path.relative(inputPath, file.path))
      if (filename.endsWith('.w3e')) {
        foundTerrain = true
        const handler = async(buffer: Buffer) => {
          const [terrain, formatVersion] = TerrainTranslator.warToJson(buffer)
          recordedProfile.w3eFormatVersion = formatVersion
          terrainFileResolve(terrain)
          return terrain
        }
        if (EnhancementManager.chunkifyMapData){
          promises.push(parseFile(file.path, handler))
        } else {
          promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, handler))
        }
      } else if (filename.endsWith('Units.doo')) {
        foundUnits = true
        const handler = async(buffer: Buffer) => {
          const [units, formatVersion, formatSubversion] = UnitsTranslator.warToJson(buffer, await editorVersionSupplier)
          recordedProfile.unitsDooFormatVersion = formatVersion
          recordedProfile.unitsDooFormatSubversion = formatSubversion
          unitsFileResolve(units)
          return units
        }
        if (EnhancementManager.chunkifyMapData){
          promises.push(parseFile(file.path, handler))
        } else {
          promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, handler))
        }
      } else if (filename.endsWith('.doo')) {
        foundDoodads = true
        const handler = async(buffer: Buffer) => {
          const [doodads, formatVersion, formatSubversion, specialDooFormatVersion] = DoodadsTranslator.warToJson(buffer, await editorVersionSupplier)
          recordedProfile.dooFormatVersion = formatVersion
          recordedProfile.dooFormatSubversion = formatSubversion
          recordedProfile.specialDooFormatVersion = specialDooFormatVersion
          doodadsFileResolve(doodads)
          return doodads
        }
        if (EnhancementManager.chunkifyMapData){
          promises.push(parseFile(file.path, handler))
        } else {
          promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, handler))
        }
      } else if (filename.endsWith('.w3r')) {
        foundRegions = true
        const handler = async(buffer: Buffer) => {
          const [rects, formatVersion] = RegionsTranslator.warToJson(buffer)
          recordedProfile.w3rFormatVersion = formatVersion
          regionsFileResolve(rects)
          return rects
        }
        if (EnhancementManager.chunkifyMapData){
          promises.push(parseFile(file.path, handler))
        } else {
          promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, handler))
        }
      } else if (filename.endsWith('.w3c')) {
        foundCameras = true
        const handler = async(buffer: Buffer) => {
          const [cameras, formatVersion] = CamerasTranslator.warToJson(buffer, await editorVersionSupplier)
          recordedProfile.w3cFormatVersion = formatVersion
          camerasFileResolve(cameras)
          return cameras
        }
        if (EnhancementManager.chunkifyMapData){
          promises.push(parseFile(file.path, handler))
        } else {
          promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, handler))
        }
      } else if (filename.endsWith('.w3s')) {
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, async(buffer) => {
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
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, async(buffer: Buffer) => StringsTranslator.warToJson(buffer)))
      } else if (filename.endsWith('.wtg')) {
        foundTriggers = true
        promises.push(parseFile(file.path, async(buffer: Buffer) => {
          const [triggers, formatVersion, formatSubversion] = translators.TriggersTranslator.warToJson(buffer)
          recordedProfile.wtgFormatVersion = formatVersion
          recordedProfile.wtgFormatSubversion = formatSubversion
          triggerFileResolve(triggers)
          return triggers
        }))
      } else if (filename.endsWith('.wct')) {
        foundCustomScripts = true
        promises.push(parseFile(file.path, async(buffer: Buffer) => {
          const [output, formatVersion] = translators.CustomScriptsTranslator.warToJson(buffer)
          recordedProfile.wctFormatVersion = formatVersion
          customScriptFileResolve(output)
          return output
        }))
      } else if (filename.endsWith('.w3i')) {
        foundInfo = true
        promises.push(processFile(file.path, outputFile + EnhancementManager.mapDataExtension, async(buffer: Buffer) => {
          const [info, formatVersion, editorVersion] = InfoTranslator.warToJson(buffer)
          recordedProfile.w3iFormatVersion = formatVersion
          recordedProfile.editorVersion = editorVersion
          editorVersionResolver?.(editorVersion)
          return info
        }))
      } else if (filename.endsWith('.imp')) {
        foundImports = true
        promises.push(parseFile(file.path, async(buffer) => {
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

    const [triggerPromise, triggerResolve, triggerReject] = PromiseSupplier<void>()
    void Promise.allSettled([triggerFilePromise, customScriptFilePromise]).then(async([triggers, customScripts]) => {
      if (triggers.status === 'fulfilled'){
        const triggerJson = triggers.value
        if (customScripts.status === 'fulfilled'){
          const csResult = customScripts.value
          // Combine custom scripts into trigger JSON
          for (let i = 0; i < triggerJson.scriptReferences.length; i++) {
            const scriptRef = triggerJson.scriptReferences[i]
            if (scriptRef != null) {
              scriptRef.script = csResult.scripts[i]
            }
          }

          (triggerJson.root as MapHeader).description = csResult.headerComment
        }

        if (EnhancementManager.composeTriggers) {
          await TriggerComposer.explodeTriggersJsonIntoSource(outputPath, (await triggerFilePromise).root)
            .then(triggerResolve, triggerReject)
        } else {
          await WriteAndCreatePath(path.join(outputPath, `triggers${EnhancementManager.mapDataExtension}`), FormatConverters[EnhancementManager.mapDataExtension].stringify(triggerJson), { encoding: 'utf8' })
            .then(triggerResolve, triggerReject)
        }
      } else {
        if (customScripts.status === 'fulfilled'){
          await WriteAndCreatePath(path.join(`customScripts${EnhancementManager.mapDataExtension}`), FormatConverters[EnhancementManager.mapDataExtension].stringify(customScripts.value), { encoding: 'utf8' })
            .then(triggerResolve, triggerReject)
        } else {
          triggerResolve()
        }
      }
    })
    promises.push(triggerPromise)

    if (EnhancementManager.chunkifyMapData){
      const [promise, resolve, reject] = PromiseSupplier<void>()
      void Promise.allSettled([terrainFilePromise, unitsFilePromise,doodadsFilePromise,regionsFilePromise,camerasFilePromise]).then(async([terrain, units, doodads, regions, cameras]) => {
        if (terrain.status === 'rejected'){
          return reject('Cannot chunkify if terrain is missing.')
        }
        const unitsVal = units.status === 'fulfilled' ? units.value : []
        const doodadsVal = doodads.status === 'fulfilled' ? doodads.value : ({ doodads: [], specialDoodads: [] } as DoodadsTranslatorOutput)
        const regionsVal = regions.status === 'fulfilled' ? regions.value : []
        const camerasVal = cameras.status === 'fulfilled' ? cameras.value : []
        await TerrainChunkifier.chunkifyTerrain(terrain.value, doodadsVal.doodads, doodadsVal.specialDoodads ?? [], unitsVal, regionsVal, camerasVal, EnhancementManager.chunkSize).then(resolve,reject)
      })
      promises.push(promise)
    }

    if (!foundInfo) {
      editorVersionReject?.('Editor version not supplied, nor is war3map.w3i file found.')
    }

    if (!foundTerrain){
      terrainFileReject('Terrain file not found.')
    }

    if (!foundUnits){
      unitsFileReject('Units file not found.')
    }

    if (!foundDoodads){
      doodadsFileReject('Doodads file not found.')
    }

    if (!foundRegions){
      regionsFileReject('Regions file not found.')
    }

    if (!foundCameras){
      camerasFileReject('Cameras file not found.')
    }

    if (!foundImports) {
      importFileReject('Assets file list not found.')
    }

    if (!foundTriggers) {
      triggerFileReject('Trigger file not found.')
    }

    if (!foundCustomScripts){
      customScriptFileReject('Custom scripts file not found.')
    }

    return await Promise.all(promises)
  }
}