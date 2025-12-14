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
import { type Asset } from '../wc3maptranslator/data'
import { AssetsTranslator } from '../wc3maptranslator/translators'
import { FormatConverters } from './formats/FormatConverters'
import { TranslatorManager } from './TranslatorManager'
import { translators } from '../translator'
import { type TriggerTranslatorOutput } from '../translator/TriggersTranslator'
import { type TargetProfile } from './Profile'
import TreeIterator from '../util/TreeIterator'
const log = LoggerFactory.createLogger('Json2War')

let translatorCount = 0
async function processFile(input: string, translator: ((json: object) => Buffer), output: string): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `${translator.constructor.name}-${translatorCount++}` }) // TODO: move this log
  asyncLog.info('Processing', input)
  const data = FormatConverters[EnhancementManager.mapDataExtension].parse(await readFile(input, { encoding: 'utf8' })) as object
  await WriteAndCreatePath(output, translator(data))
  asyncLog.info('Finished processing', output)
}

async function exportImportsFile(data: Asset[], output: string, profile: TargetProfile): Promise<void> {
  const asyncLog = log.getSubLogger({ name: `AssetsTranslator-${translatorCount++}` }) // TODO: move this log
  asyncLog.info('Exporting generated war3map.imp file.')
  const buffer = AssetsTranslator.jsonToWar(data, profile.impFormatVersion)
  await WriteAndCreatePath(output, buffer)
  asyncLog.info('Finished exporting', output)
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

async function exportTriggers(triggersJson: TriggerContainer, output: string, profile: TargetProfile): Promise<void> {
  const tasks: Promise<unknown>[] = []
  const triggerLog = log.getSubLogger({ name: `${translators.TriggersTranslator.constructor.name}-${translatorCount++}` }) // TODO: move this log
  const triggerAndScript: TriggerTranslatorOutput = {
    root            : triggersJson,
    scriptReferences: getAllContentForScriptFile(triggersJson) as ScriptContent[]
  }

  const triggerBuffer = translators.TriggersTranslator.jsonToWar(triggerAndScript, profile.wtgFormatVersion, profile.wtgFormatSubversion)
  tasks.push(WriteAndCreatePath(path.join(output, 'war3map.wtg'), triggerBuffer)
    .then(() => triggerLog.info('Finished exporting triggers.')))

  const scriptLog = log.getSubLogger({ name: `${translators.CustomScriptsTranslator.constructor.name}-${translatorCount++}` }) // TODO: move this log

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

  const scriptBuffer = translators.CustomScriptsTranslator.jsonToWar(scriptArg, profile.wctFormatVersion)
  tasks.push(WriteAndCreatePath(path.join(output, 'war3map.wct'), scriptBuffer)
    .then(() => scriptLog.info('Finished exporting custom scripts.')))

  await Promise.all(tasks)
}

async function processTriggers(input: string, output: string, profile: TargetProfile): Promise<void> {
  log.info('Reading triggers file')
  const buffer = FormatConverters[EnhancementManager.mapDataExtension].parse(await readFile(input, { encoding: 'utf8' })) as TriggerContainer[]
  await exportTriggers(buffer[0], output, profile)
}

export const Json2WarService = {
  async convert(inputPath: string, outputPath: string, profile: TargetProfile): Promise<void> {
    log.info(`Converting Warcraft III json data in '${inputPath}' and outputting to '${outputPath}'`)

    const promises: Promise<void>[] = []
    let importDirectoryTree: DirectoryTree<Record<string, unknown>> | null = null

    for (const [, file] of TreeIterator<DirectoryTree>(directoryTree(inputPath, { attributes: ['type', 'extension'] }), (parent: directoryTree.DirectoryTree<Record<string, string>>) => {
      if (FileBlacklist.isDirectoryTreeBlacklisted(parent)) return
      if (EnhancementManager.smartImport && file.path.endsWith(EnhancementManager.importFolder)) {
        importDirectoryTree = file
        return // skip imports
      }

      if (EnhancementManager.composeTriggers && file.path.endsWith(EnhancementManager.sourceFolder)) {
        log.debug('ComposeTriggers requested')
        promises.push((async (): Promise<void> => {
          const triggerJson = await TriggerComposer.composeTriggerJson(file)
          await exportTriggers(triggerJson, outputPath, profile)
        })())
        return // skip triggers
      }
      return parent.children
    })) {
      if (FileBlacklist.isDirectoryTreeBlacklisted(file)) continue
      if (file.type === 'directory') continue

      if (!EnhancementManager.composeTriggers && file.name.endsWith(`triggers${EnhancementManager.mapDataExtension}`)) {
        promises.push(processTriggers(file.path, outputPath, profile))
        continue
      }

      const translator = TranslatorManager.FindAppropriateTranslationMethodText2Binary(file.name, profile)
      let outputFile = path.join(outputPath, path.relative(inputPath, file.path))
      if (translator != null) {
        outputFile = outputFile.substring(0, outputFile.lastIndexOf('.')) // remove final extension

        if (!EnhancementManager.smartImport || !(file.name.endsWith('.imp'))) {
          promises.push(processFile(file.path, translator, outputFile))
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