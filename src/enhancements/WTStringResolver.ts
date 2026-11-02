import { ContentType, TriggerContent } from "../translator/data/content/TriggerContent"
import { CustomScriptsTranslatorOutput } from "../translator/CustomScriptsTranslator"
import { TriggerTranslatorOutput } from "../translator/TriggersTranslator"
import { Info, ModificationType, ObjectData, ObjectModificationTable } from "../wc3maptranslator/data"
import TreeIterator from "../util/TreeIterator"
import { GetTriggerContainerChildren } from "../translator/data/TriggerContainer"
import { CustomScript, GUITrigger, Parameter, ScriptedTrigger, Statement } from "../translator"
import { FourCC, integer } from "../wc3maptranslator/CommonInterfaces"
import { WriteAndCreatePath } from "../util/WriteAndCreatePath"
import { FormatConverter, FormatConverters } from "../converter"
import { EnhancementManager } from "."
import { LoggerFactory } from "../logging/LoggerFactory"
import PromiseSupplier from "../util/PromiseSupplier"

const log = LoggerFactory.createLogger('WTStringCompiler')

let outputFile: string
let stringsDictionary: Record<integer, string>
const stringsCounters: Record<string, integer> = {}
const [dictionaryLoadedPromise, dictionaryLoad, dictionaryLoadFailed] = PromiseSupplier<void>();
let dictionaryLoaded = false

const keyPrefix = "TRIGSTR_"
const keyPrefixSize = keyPrefix.length
const matchKeyPrefix = /TRIGSTR_(?<stringId>\d+)/gd

function getUnreferencedStrings(): Record<string, string> {
  return Object.entries(stringsDictionary)
    .filter(it => (stringsCounters[it[0]] ?? 0) == 0)
    .reduce((acc, value) => {
      acc[value[0]] = value[1];
      return acc
    }, {} as Record<string, string>)
}

function dereferenceStringRaw(stringKey: integer): string | undefined {
  const result = stringsDictionary[stringKey]
  if (result != null) {
    if (stringsCounters[stringKey]) {
      stringsCounters[stringKey] = stringsCounters[stringKey] as integer + 1;
    } else {
      stringsCounters[stringKey] = 1
    }
  }
  return result
}

function dereferenceString(stringKey: string | undefined): string | undefined {
  if (stringKey == null || stringKey == '' || !stringKey.startsWith(keyPrefix)) return
  return dereferenceStringRaw(Number.parseInt(stringKey.slice(keyPrefixSize)))
}

function processParameter(parameter: Parameter) {
  if (parameter.statement) {
    processECA(parameter.statement)
  }
  if (parameter.arrayIndex) {
    processParameter(parameter.arrayIndex)
  }
  parameter.value = dereferenceString(parameter.value) ?? parameter.value
}

function processECA(eca: Statement) {
  if (eca.statements) {
    for (const ecaGroupId in eca.statements) {
      eca.statements[ecaGroupId]?.forEach(processECA)
    }
  }
  eca.parameters?.forEach(processParameter)
}

function replacer(substring: string, stringId: string): string {
  return dereferenceStringRaw(Number.parseInt(stringId)) ?? substring
}

function processScript(script: string): string {
  return script.replaceAll(matchKeyPrefix, replacer)
}

function processObjectModificationTable(table: Record<FourCC, ObjectData>) {
  for (const objectId in table) {
    const mods = table[objectId]
    if (!mods?.modifications) {
      continue
    }
    for (const fieldId in mods?.modifications) {
      const fieldMod = mods?.modifications[fieldId]
      if (fieldMod?.type == ModificationType.STRING) {
        for (const keyLevel in fieldMod.values) {
          const resolvedValue = dereferenceString(fieldMod.values[keyLevel] as string | undefined)
          if (resolvedValue != null) {
            fieldMod.values[keyLevel] = resolvedValue
          }
        }
      }
    }
  }
}

const WTStringResolver = {
  addStringSource: function (leftoverOutputPath: string, strings: Record<string, string>) {
    outputFile = leftoverOutputPath
    stringsDictionary = strings
    dictionaryLoaded = true
    dictionaryLoad()
  },

  dereferenceObjectStrings: async function (objects: ObjectModificationTable): Promise<ObjectModificationTable> {
    await dictionaryLoadedPromise
    processObjectModificationTable(objects.original)
    if (objects.custom) {
      processObjectModificationTable(objects.custom)
    }
    return objects
  },

  dereferenceTriggerStrings: async function (triggers: TriggerTranslatorOutput): Promise<TriggerTranslatorOutput> {
    await dictionaryLoadedPromise
    for (const [parents, content] of TreeIterator<TriggerContent>(triggers.root, GetTriggerContainerChildren)) {
      switch (content.contentType) {
        case ContentType.HEADER:
        case ContentType.LIBRARY:
        case ContentType.CATEGORY:
          break;
        case ContentType.TRIGGER:
          const guiTrigger = content as GUITrigger
          guiTrigger.events.forEach(processECA)
          guiTrigger.conditions.forEach(processECA)
          guiTrigger.actions.forEach(processECA)
          break;
        case ContentType.TRIGGER_SCRIPTED:
          (content as ScriptedTrigger).script = processScript((content as ScriptedTrigger).script)
        case ContentType.COMMENT:
          break;
        case ContentType.CUSTOM_SCRIPT:
          (content as CustomScript).script = processScript((content as CustomScript).script)
        case ContentType.VARIABLE:
          break;
      }
    }

    return triggers
  },

  dereferenceScriptStrings: async function (scriptFileOutput: CustomScriptsTranslatorOutput): Promise<CustomScriptsTranslatorOutput> {
    await dictionaryLoadedPromise
    scriptFileOutput.scripts.forEach(processScript)

    return scriptFileOutput
  },

  dereferenceInfoStrings: async function (info: Info): Promise<Info> {
    await dictionaryLoadedPromise
    info.loadingScreen.text = dereferenceString(info.loadingScreen.text) ?? info.loadingScreen.text
    info.loadingScreen.title = dereferenceString(info.loadingScreen.title) ?? info.loadingScreen.title
    info.loadingScreen.subtitle = dereferenceString(info.loadingScreen.subtitle) ?? info.loadingScreen.subtitle
    info.prologue.text = dereferenceString(info.prologue.text) ?? info.prologue.text
    info.prologue.title = dereferenceString(info.prologue.title) ?? info.prologue.title
    info.prologue.subtitle = dereferenceString(info.prologue.subtitle) ?? info.prologue.subtitle
    info.map.author = dereferenceString(info.map.author) ?? info.map.author
    info.map.description = dereferenceString(info.map.description) ?? info.map.description
    info.map.name = dereferenceString(info.map.name) ?? info.map.name
    info.map.recommendedPlayers = dereferenceString(info.map.recommendedPlayers) ?? info.map.recommendedPlayers
    info.players?.forEach(it => it.name = dereferenceString(it.name) ?? it.name)
    return info
  },

  exportLeftoverStrings: async function () {
    if (!dictionaryLoaded) {
      dictionaryLoadFailed('Dictionary not loaded')
    }
    const leftoverStrings = getUnreferencedStrings()
    const leftoverStringCount = Object.entries(leftoverStrings).length
    if (leftoverStringCount > 0) {
      await WriteAndCreatePath(outputFile, (FormatConverters[EnhancementManager.mapDataExtension] as FormatConverter).stringify(leftoverStrings))
      log.info(`Exported ${leftoverStringCount} leftover strings into ${outputFile}...`)
    }
  }
}

export { WTStringResolver }