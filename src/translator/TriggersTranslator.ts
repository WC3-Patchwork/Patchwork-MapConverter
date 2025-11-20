import { TriggerDataRegistry } from '../enhancements/TriggerDataRegistry'
import { type TriggerContainer } from './data/TriggerContainer'
import { ContentType, type TriggerContent } from './data/content/TriggerContent'
import { ContentTypeEnumConverter } from './util/ContentTypeEnumConverter'
import { type ScriptContent } from './data/properties/ScriptContent'
import { type CustomScript } from './data/content/CustomScript'
import { type GlobalVariable } from './data/content/GlobalVariable'
import { type GUITrigger } from './data/content/GUITrigger'
import { type TriggerComment } from './data/content/TriggerComment'
import { type Statement } from './data/statement/Statement'
import { StatementTypeEnumConverter } from './util/StatementTypeEnumConverter'
import { StatementType } from './data/statement/StatementType'
import { ParameterTypeEnumConverter } from './util/ParameterTypeEnumConverter'
import { type Parameter } from './data/parameter/Parameter'
import { HexBuffer } from '../wc3maptranslator/HexBuffer'
import { W3Buffer } from '../wc3maptranslator/W3Buffer'
import { type ScriptedTrigger } from './data/content/ScriptedTrigger'
import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { LoggerFactory } from '../logging/LoggerFactory'
import { type MapHeader } from './data/MapHeader'
import { type TriggerItemBase } from './data/content/TriggerItemBase'
import { type BaseTrigger } from './data/content/BaseTrigger'
import { TriggerDefaults } from './default/TriggerDefaults'

const log = LoggerFactory.createLogger('TriggersTranslator')

export interface TriggerTranslatorOutput {
  root: TriggerContainer
  scriptReferences: (ScriptContent | null)[]
}

export function jsonToWar(json: TriggerTranslatorOutput, formatVersion: integer, variableFormatVersion: integer, formatSubversion?: integer): Buffer {
  if (formatVersion < 0 || formatVersion > 0x80000004) {
    throw new Error(`Unknown map scripts format version=${formatVersion}, expected value from range [0, 0x80000004]`)
  }

  if (variableFormatVersion < 0 || variableFormatVersion > 2) {
    throw new Error(`Unknown map triggers->variable format version=${variableFormatVersion}, expected value [0, 2]`)
  }

  const output = new HexBuffer()
  output.addChars('WTG!')
  output.addUInt(formatVersion)
  if (formatVersion > 0x7FFFFFFF) {
    if (!formatSubversion || formatSubversion < 0 || formatSubversion > 7) {
      throw new Error(`Unknown map triggers format subversion=${formatSubversion ?? 'undefined'}, expected value from range [0, 7]`)
    }
    output.addUInt(formatSubversion)
  }
  const finalFormatSubversion = formatSubversion ?? 0x7FFFFFFF

  const parentReference = new Map<TriggerContent, integer>()
  const elementReference = new Map<TriggerContent, integer>()

  let headerCount = 0
  let libraryCount = 0
  let categoryCount = 0
  let triggerCount = 0
  let commentCount = 0
  let customScriptCount = 0
  let variableCount = 0

  const triggerStack: TriggerContent[] = [json.root]
  const triggersByContentType = new Map<ContentType, TriggerContent[]>()
  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue
    let elementId: integer

    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
        elementId = 0x00000000 + headerCount++
        triggerStack.push(...(currentTrigger as TriggerContainer).children)
        for (const childTrigger of (currentTrigger as TriggerContainer).children) {
          parentReference.set(childTrigger, elementId)
        }
        break
      case ContentType.LIBRARY:
        elementId = 0x01000000 + libraryCount++
        triggerStack.push(...(currentTrigger as TriggerContainer).children)
        for (const childTrigger of (currentTrigger as TriggerContainer).children) {
          parentReference.set(childTrigger, elementId)
        }
        break
      case ContentType.CATEGORY:
        elementId = 0x02000000 + categoryCount++
        triggerStack.push(...(currentTrigger as TriggerContainer).children)

        break
      case ContentType.TRIGGER:
      case ContentType.TRIGGER_SCRIPTED:
        elementId = 0x03000000 + triggerCount++
        break
      case ContentType.COMMENT:
        elementId = 0x04000000 + commentCount++
        break
      case ContentType.CUSTOM_SCRIPT:
        elementId = 0x05000000 + customScriptCount++
        break
      case ContentType.VARIABLE:
        elementId = 0x06000000 + variableCount++
        break
      default:
        continue
    }
    elementReference.set(currentTrigger, elementId)
    let contentType = currentTrigger.contentType
    if (contentType === ContentType.TRIGGER_SCRIPTED) {
      // Must persist order of scripts, therefore these 2 must not be processed seperately
      // Otherwise there will be a mismatch of script contents from .wct and .wtg script elements
      contentType = ContentType.CUSTOM_SCRIPT
    }
    if (triggersByContentType.has(contentType)) {
      triggersByContentType.get(contentType)?.push(currentTrigger)
    } else {
      triggersByContentType.set(contentType, [currentTrigger])
    }
  }

  const saveGlobals = function(variables: GlobalVariable[], parentReference: Map<TriggerContent, integer>): void {
    output.addInt(variableFormatVersion)
    output.addInt(variables.length)
    for (const variable of variables) {
      output.addString(variable.name)
      output.addString(variable.type)
      output.addInt(+variable.userDefined)
      output.addInt(+variable.isArray)
      if (variableFormatVersion >= 2) {
        output.addInt(variable.arrayLength)
      }
      if (variableFormatVersion !== 0) {
        output.addInt(+variable.isInitialized)
      }
      output.addString(variable.initialValue)

      if (formatVersion >= 2147483648) {
        const elementId = elementReference.get(variable)
        if (elementId == null) {
          throw new Error(`Variable ${variable.name} missing ID`)
        }
        output.addInt(elementId)
        output.addInt(parentReference.get(variable)!)
      }
    }
  }

  const saveContainer = function(elementId: integer, container: TriggerContainer, parentContainerId: integer): void {
    output.addInt(elementId)
    output.addString(container.name)
    if (formatVersion > 6) {
      output.addInt(+(container.contentType === ContentType.COMMENT)) // should always be false
    }

    if (finalFormatSubversion >= 0x80000000) {
      output.addInt(+container.isExpanded)
      output.addInt(parentContainerId)
    }
  }

  const saveTrigger = function(elementId: integer, trigger: TriggerContent, parentContainerId: integer): void {
    const triggerName = trigger.name
    let triggerDescription: string
    let isComment: boolean
    let isEnabled: boolean
    let isCustomScript: boolean
    let initiallyOff: boolean
    let runOnMapInit: boolean
    let triggerFunctionCount: integer
    switch (trigger.contentType) {
      case ContentType.HEADER:
      case ContentType.LIBRARY:
      case ContentType.CATEGORY:
        throw new Error('Cannot save container as a trigger?')
      case ContentType.TRIGGER:
        triggerDescription = (trigger as TriggerItemBase).description ?? TriggerDefaults.description
        isComment = false
        isEnabled = (trigger as GUITrigger)?.isEnabled ?? TriggerDefaults.isEnabled
        isCustomScript = false
        initiallyOff = (trigger as GUITrigger)?.initiallyOff ?? TriggerDefaults.initiallyOff
        runOnMapInit = (trigger as BaseTrigger)?.runOnMapInit ?? TriggerDefaults.runOnMapInit
        triggerFunctionCount = (function(trigger: GUITrigger): integer {
          return (trigger.events ?? TriggerDefaults.events).length +
          (trigger.conditions ?? TriggerDefaults.conditions).length +
          (trigger.actions ?? TriggerDefaults.actions).length
        })(trigger as GUITrigger)
        break
      case ContentType.TRIGGER_SCRIPTED:
        triggerDescription = (trigger as TriggerItemBase).description ?? TriggerDefaults.description
        isComment = false
        isEnabled = (trigger as ScriptedTrigger)?.isEnabled ?? TriggerDefaults.isEnabled
        isCustomScript = true
        initiallyOff = TriggerDefaults.initiallyOff
        runOnMapInit = (trigger as BaseTrigger)?.runOnMapInit ?? TriggerDefaults.runOnMapInit
        triggerFunctionCount = 0
        break
      case ContentType.CUSTOM_SCRIPT:
        triggerDescription = (trigger as TriggerItemBase).description ?? TriggerDefaults.description
        isComment = false
        isEnabled = (trigger as ScriptedTrigger)?.isEnabled ?? TriggerDefaults.isEnabled
        isCustomScript = true
        initiallyOff = false
        runOnMapInit = false
        triggerFunctionCount = 0
        break
      case ContentType.COMMENT:
        triggerDescription = (trigger as TriggerComment).comment ?? TriggerDefaults.description
        isComment = true
        isEnabled = true
        isCustomScript = false
        initiallyOff = false
        runOnMapInit = false
        triggerFunctionCount = 0
        break
      case ContentType.VARIABLE:
      default:
        throw new Error('Cannot save variable as a trigger?')
    }

    // Output starts here
    output.addString(triggerName)
    output.addString(triggerDescription)
    if (formatVersion >= 5) {
      output.addInt(+isComment)
    }

    if (formatVersion < 5 || finalFormatSubversion > 0x7FFFFFFF) {
      if (finalFormatSubversion > 0x80000000) {
        output.addInt(elementId)
      }
      output.addInt(+(isEnabled))
      output.addInt(+(isCustomScript))

      if (formatVersion > 1) {
        output.addInt(+initiallyOff)
      }
      if (formatVersion > 3) {
        output.addInt(+runOnMapInit)
      }
      output.addInt(parentContainerId)
      output.addInt(triggerFunctionCount)
      if (triggerFunctionCount > 0) {
        saveTriggerFunctions(trigger as GUITrigger)
      }
    }
  }

  const saveTriggerFunctions = function(trigger: GUITrigger): void {
    for (const event of trigger.events) {
      output.addInt(StatementTypeEnumConverter.toIdentifier(event.type))
      saveTriggerFunction(event)
    }
    for (const condition of trigger.conditions) {
      output.addInt(StatementTypeEnumConverter.toIdentifier(condition.type))
      saveTriggerFunction(condition)
    }
    for (const action of trigger.actions) {
      output.addInt(StatementTypeEnumConverter.toIdentifier(action.type))
      saveTriggerFunction(action)
    }
  }

  const saveTriggerFunction = function(triggerFunction: Statement): void {
    output.addString(triggerFunction.name)
    if (formatVersion > 2) {
      output.addInt(+triggerFunction.isEnabled)
    }
    const paramCount = TriggerDataRegistry.getParameterCount(triggerFunction.type, triggerFunction.name)
    const triggerParams = triggerFunction?.parameters ?? TriggerDefaults.parameters
    if (paramCount == null) {
      throw new Error(`Missing parameter count for type ${triggerFunction.type} - function ${triggerFunction.name} in triggerdata.txt`)
    } else if (paramCount !== triggerParams.length) {
      throw new Error(`Parameter count does not match for type ${triggerFunction.type} - function ${triggerFunction.name}, expected ${paramCount}, found ${triggerParams.length}`)
    }
    for (const triggerParam of triggerParams) {
      saveTriggerFunctionParameter(triggerParam)
    }

    if (formatVersion > 5) {
      const childTriggerFunctions = triggerFunction?.statements ?? TriggerDefaults.statements
      for (const [groupIndex, groupFunctions] of Object.entries(childTriggerFunctions)) {
        for (const childTriggerFunction of groupFunctions) {
          output.addInt(StatementTypeEnumConverter.toIdentifier(childTriggerFunction.type))
          output.addInt(groupIndex as unknown as integer)
          saveTriggerFunction(childTriggerFunction)
        }
      }
    }
  }

  const saveTriggerFunctionParameter = function(param: Parameter): void {
    output.addInt(ParameterTypeEnumConverter.toIdentifier(param.type))
    output.addString(param.value)
    output.addInt(+(param.statement != null))
    if (param.statement != null) {
      output.addInt(StatementTypeEnumConverter.toIdentifier(param.statement.type))
      saveTriggerFunction(param.statement)
    }
    output.addInt(+(param.arrayIndex != null))
    if (param.arrayIndex != null) {
      saveTriggerFunctionParameter(param.arrayIndex)
    }
  }

  const saveTriggerVariable = function(elementId: integer, variable: GlobalVariable, parentContainerId: integer): void {
    output.addInt(elementId)
    output.addString(variable.name)
    output.addInt(parentContainerId)
  }

  let totalElements = 0
  for (const elements of triggersByContentType.values()) {
    totalElements = totalElements + elements.length
  }

  if (formatVersion < 2147483648) {
    output.addInt((triggersByContentType.get(ContentType.CATEGORY) as []).length)
    for (const category of triggersByContentType.get(ContentType.CATEGORY) as TriggerContainer[]) {
      saveContainer(elementReference.get(category)!, category, parentReference.get(category)!)
    }
    saveGlobals(triggersByContentType.get(ContentType.VARIABLE) as GlobalVariable[], parentReference)

    const triggerContentCount =
      (triggersByContentType.get(ContentType.COMMENT) as []).length +
      (triggersByContentType.get(ContentType.CUSTOM_SCRIPT) as []).length +
      (triggersByContentType.get(ContentType.TRIGGER) as []).length

    output.addInt(triggerContentCount)
    for (const comment of triggersByContentType.get(ContentType.COMMENT) as TriggerComment[]) {
      saveTrigger(elementReference.get(comment)!, comment, parentReference.get(comment)!)
    }
    for (const trigger of triggersByContentType.get(ContentType.TRIGGER) as GUITrigger[]) {
      saveTrigger(elementReference.get(trigger)!, trigger, parentReference.get(trigger)!)
    }
    for (const script of triggersByContentType.get(ContentType.CUSTOM_SCRIPT)!) {
      saveTrigger(elementReference.get(script)!, script, parentReference.get(script)!)
    }
  } else {
    output.addInt((triggersByContentType.get(ContentType.HEADER) as []).length)
    output.addInt(0) // deleted count
    output.addInt((triggersByContentType.get(ContentType.LIBRARY) as []).length)
    output.addInt(0) // deleted count
    output.addInt((triggersByContentType.get(ContentType.CATEGORY) as []).length)
    output.addInt(0) // deleted count
    output.addInt((triggersByContentType.get(ContentType.TRIGGER) as []).length)
    output.addInt(0) // deleted count
    output.addInt((triggersByContentType.get(ContentType.COMMENT) as []).length)
    output.addInt(0) // deleted count
    output.addInt((triggersByContentType.get(ContentType.CUSTOM_SCRIPT) as []).length)
    output.addInt(0) // deleted count
    output.addInt((triggersByContentType.get(ContentType.VARIABLE) as []).length)
    output.addInt(0) // deleted count
    output.addInt(0) // Unknown content type, they just take up space, dunno what they were
    output.addInt(0) // deleted count

    saveGlobals(triggersByContentType.get(ContentType.VARIABLE) as GlobalVariable[], parentReference)
    output.addInt(totalElements)
    for (const header of triggersByContentType.get(ContentType.HEADER) ?? [{
      isExpanded : TriggerDefaults.isExpanded,
      children   : TriggerDefaults.children,
      name       : '',
      contentType: ContentType.HEADER,
      script     : '',
      description: TriggerDefaults.description
    } satisfies MapHeader]) {
      saveContainer(elementReference.get(header) ?? 0, header as TriggerContainer, 0)
    }
    for (const library of triggersByContentType.get(ContentType.LIBRARY) as TriggerContainer[]) {
      saveContainer(elementReference.get(library)!, library, parentReference.get(library)!)
    }
    for (const container of triggersByContentType.get(ContentType.CATEGORY) as TriggerContainer[]) {
      saveContainer(elementReference.get(container)!, container, parentReference.get(container)!)
    }

    for (const trigger of triggersByContentType.get(ContentType.TRIGGER) as GUITrigger[]) {
      saveTrigger(elementReference.get(trigger)!, trigger, parentReference.get(trigger)!)
    }
    for (const comment of triggersByContentType.get(ContentType.COMMENT) as TriggerComment[]) {
      saveTrigger(elementReference.get(comment)!, comment, parentReference.get(comment)!)
    }
    for (const customScript of triggersByContentType.get(ContentType.CUSTOM_SCRIPT)!) {
      saveTrigger(elementReference.get(customScript)!, customScript, parentReference.get(customScript)!)
    }
    for (const variable of triggersByContentType.get(ContentType.VARIABLE) as GlobalVariable[]) {
      saveTriggerVariable(elementReference.get(variable)!, variable, parentReference.get(variable)!)
    }
  }

  return output.getBuffer()
}

export function warToJson(buffer: Buffer): [TriggerTranslatorOutput, integer, integer] {
  const input = new W3Buffer(buffer)

  try {
    const fileId = input.readChars(4) // WTG!
    if (fileId !== 'WTG!') {
      log.warn(`Mismatched file format magic number, found '${fileId}', expected 'WTG!', will attempt parsing...`)
    }

    const formatVersion = input.readUint() // 04 00 00 80
    if (formatVersion < 0 || formatVersion > 2147483652) {
      log.warn(`Unknown terrain file format version '${formatVersion}', expected value [3, 2147483652], will attempt parsing...`)
    }

    let formatSubversion: integer
    if (formatVersion > 2147483647) {
      formatSubversion = input.readInt() // 4 = Roc, 7 = TFT
    } else {
      formatSubversion = 0x7FFFFFFF
    }

    const elementRelations = new Map<number, number>()
    const containers: Record<number, TriggerContainer> = {}
    const content: Record<number, TriggerContent> = {}
    const customScripts: (ScriptContent | null)[] = []
    const allGlobalVariables: Record<number, GlobalVariable> = {}
    const loadGlobals = function(): void {
      const variableFormatVersion = input.readInt() // [0, 2]
      const existingVariablesCount = input.readInt()
      for (let i = 0; i < existingVariablesCount; i++) {
        const name = input.readString()
        const type = input.readString()
        const userDefined = !!input.readInt() // always 1?
        const isArray = !!input.readInt()
        let arrayLength: integer
        if (variableFormatVersion >= 2) {
          arrayLength = input.readInt()
        } else {
          arrayLength = 1
        }
        let isInitialized = false
        if (variableFormatVersion !== 0) {
          isInitialized = !!input.readInt()
        }

        const initialValue = input.readString()

        if (variableFormatVersion === 0) {
          isInitialized = initialValue.length > 0
        }

        const globalVariable: GlobalVariable = {
          name,
          contentType: ContentType.VARIABLE,
          type,
          userDefined,
          isArray,
          arrayLength,
          isInitialized,
          initialValue
        }

        if (formatVersion >= 2147483648) {
          const variableId = input.readInt() // last byte 06?
          allGlobalVariables[variableId] = globalVariable
          content[variableId] = globalVariable
          elementRelations.set(variableId, input.readInt())
        } else {
          allGlobalVariables[i] = globalVariable
          content[i] = globalVariable // TODO: required something?
        }
      }
    }

    const loadContainer = function(type: ContentType): TriggerContainer {
      const elementId = input.readInt()
      const name = input.readString()
      if (formatVersion > 6) {
        input.readInt() //isComment: boolean - pretty sure this will always be false.
      }

      let isExpanded: boolean
      if (formatSubversion >= 0x80000000) {
        isExpanded = !!input.readInt()
        const parentContainerId = input.readInt()
        elementRelations.set(elementId, parentContainerId)
      } else {
        isExpanded = false
      }

      const container = {
        name,
        isExpanded,
        contentType: type,
        children   : []
      } satisfies TriggerContainer
      containers[elementId] = container

      return container
    }

    const loadTrigger = function(index: integer, contentType: ContentType): void {
      const name = input.readString()
      const description = input.readString()

      let isComment: boolean
      if (formatVersion >= 5) {
        isComment = !!input.readInt()
      } else {
        isComment = false
      }

      if (formatVersion < 5 || formatSubversion > 0x7FFFFFFF) {
        let elementId: integer // Double check this
        if (formatSubversion >= 0x80000000) {
          elementId = input.readInt()
        } else {
          elementId = index
        }
        const isEnabled = !!input.readInt()
        const isCustomScript = !!input.readInt()

        let initiallyOff: boolean
        if (formatVersion > 1) {
          initiallyOff = !!input.readInt()
        } else {
          initiallyOff = false
        }
        let runOnMapInit: boolean
        if (formatVersion > 3) {
          runOnMapInit = !!input.readInt()
        } else {
          runOnMapInit = false
        }
        const parentContainerId = input.readInt()
        elementRelations.set(elementId, parentContainerId)

        const triggerFunctionCount = input.readInt()

        if (contentType === ContentType.TRIGGER && isCustomScript) {
          contentType = ContentType.TRIGGER_SCRIPTED
        } else if (contentType === ContentType.TRIGGER && isComment) {
          contentType = ContentType.COMMENT
        }

        let triggerContent: TriggerContent | null = null
        switch (contentType) {
          case ContentType.TRIGGER:
            triggerContent = {
              name,
              contentType,
              description,
              isEnabled,
              initiallyOff,
              runOnMapInit,
              events    : [],
              conditions: [],
              actions   : []
            } satisfies GUITrigger as TriggerContent
            content[elementId] = triggerContent
            customScripts.push(null)
            break
          case ContentType.TRIGGER_SCRIPTED:
            triggerContent = {
              name,
              contentType,
              description,
              isEnabled,
              runOnMapInit,
              script: ''
            } satisfies ScriptedTrigger as TriggerContent
            content[elementId] = triggerContent
            customScripts.push(triggerContent as ScriptContent)
            break
          case ContentType.COMMENT:
            content[elementId] = {
              name,
              contentType,
              comment: description
            } satisfies TriggerComment as TriggerContent
            break
          case ContentType.CUSTOM_SCRIPT:
            triggerContent = {
              name,
              contentType,
              description,
              isEnabled,
              script: ''
            } satisfies CustomScript as TriggerContent
            content[elementId] = triggerContent
            customScripts.push(triggerContent as ScriptContent)
            break
        }

        for (let i = 0; i < triggerFunctionCount; i++) {
          const functionType = StatementTypeEnumConverter.toEnum(input.readInt())
          const triggerFunction = loadTriggerFunction(functionType)
          if (triggerContent != null && triggerContent.contentType === ContentType.TRIGGER) {
            const trigger = triggerContent as GUITrigger
            switch (triggerFunction.type) {
              case StatementType.EVENT:
                trigger.events.push(triggerFunction)
                break
              case StatementType.CONDITION:
                trigger.conditions.push(triggerFunction)
                break
              case StatementType.ACTION:
                trigger.actions.push(triggerFunction)
                break
              case StatementType.CALL:
                log.warn(`Sussy statement call when ECA expected - trigger: ${triggerContent.name} - function: ${triggerFunction.name}`)
                // sounds illegal - ignore?
                break
            }
          }
        }
      }
    }

    const loadTriggerFunction = function(type: StatementType): Statement {
      const name = input.readString()
      let isEnabled: boolean
      if (formatVersion > 2) {
        isEnabled = !!input.readInt()
      } else {
        isEnabled = true
      }
      const paramCount = TriggerDataRegistry.getParameterCount(type, name)
      if (paramCount == null) {
        throw new Error(`Missing parameter count for type ${type} - function ${name} in triggerdata.txt`)
      }

      const triggerFunction = {
        name,
        type,
        isEnabled,
        parameters: [] as Parameter[],
        statements: {} as Record<integer, Statement[]>
      } satisfies Statement

      for (let i = 0; i < paramCount; i++) {
        triggerFunction.parameters[i] = loadTriggerFunctionParameter()
      }
      if (formatVersion > 5) {
        const triggerFunctionCount = input.readInt()
        for (let i = 0; i < triggerFunctionCount; i++) {
          const functionType = StatementTypeEnumConverter.toEnum(input.readInt())
          const groupIndex = input.readInt() // if-then-else groups
          let statements: Statement[]
          if (triggerFunction.statements[groupIndex] == null) {
            statements = triggerFunction.statements[groupIndex] = [] as Statement[]
          } else {
            statements = triggerFunction.statements[groupIndex]
          }

          statements.push(loadTriggerFunction(functionType))
        }
      }
      return triggerFunction
    }

    const loadTriggerFunctionParameter = function(): Parameter {
      const type = ParameterTypeEnumConverter.toEnum(input.readInt())
      const value = input.readString()
      const hasSubParams = !!input.readInt()
      let statement: Statement | undefined
      if (hasSubParams) {
        const functionType = StatementTypeEnumConverter.toEnum(input.readInt())
        statement = loadTriggerFunction(functionType)
      }
      const isArray = !!input.readInt()
      let arrayIndex: Parameter | undefined
      if (isArray) {
        arrayIndex = loadTriggerFunctionParameter()
      }
      return {
        type,
        value,
        statement,
        arrayIndex
      } satisfies Parameter
    }

    const loadTriggerVariable = function(): void {
      const elementId = input.readInt()
      input.readString() // excess data - name
      const parentContainerId = input.readInt()

      elementRelations.set(elementId, parentContainerId)
    }

    if (formatVersion < 2147483648) {
      const header = {
        name       : 'header',
        description: '',
        contentType: ContentType.HEADER,
        isExpanded : true,
        script     : '',
        children   : []
      } satisfies MapHeader
      customScripts.push(header as ScriptContent)
      const triggerCategoryCount = input.readInt()
      for (let i = 0; i < triggerCategoryCount; i++) {
        loadContainer(ContentType.CATEGORY)
      }
      loadGlobals()
      const triggerCount = input.readInt()
      for (let i = 0; i < triggerCount; i++) {
        loadTrigger(i, ContentType.TRIGGER)
      }
    } else {
      // counts: headers. libraries, categories, triggers, comments, custom scripts, variables, unknown element
      for (let i = 0; i < 8; i++) {
        const elementCount = input.readInt()
        for (let j = 0; j < elementCount; j++) {
          input.readInt() // deleted element id
        }
      }
      loadGlobals()
      const elementCount = input.readInt()
      for (let i = 0; i < elementCount; i++) {
        let element: TriggerContent
        const type = ContentTypeEnumConverter.toEnum(input.readInt())
        switch (type) {
          case ContentType.HEADER:
          case ContentType.LIBRARY:
          case ContentType.CATEGORY:
            element = loadContainer(type)
            if (type === ContentType.HEADER) {
              customScripts.push(element as ScriptContent)
            }
            break
          case ContentType.TRIGGER:
          case ContentType.COMMENT:
          case ContentType.CUSTOM_SCRIPT:
            loadTrigger(i, type)
            break
          case ContentType.VARIABLE:
            loadTriggerVariable()
            break
        }
      }
    }

    let root: TriggerContainer | null = null
    const missingElements: { data?: TriggerContainer | TriggerContent, elementId?: number, parentId?: number, foundParent: boolean, foundElement: boolean }[] = []
    // Generate data tree structure
    for (const [elementId, parentId] of elementRelations.entries()) {
      if (parentId === -1) {
        if (containers[elementId] != null) {
          root = containers[elementId]
        }
      } else {
        let parent: TriggerContainer | undefined
        if (containers[parentId] != null) {
          parent = containers[parentId]
        }

        let element: TriggerContainer | TriggerContent | undefined
        if (containers[elementId] != null) {
          element = containers[elementId]
        } else if (content[elementId] != null) {
          element = content[elementId]
        }

        if (parent == null || element == null) {
          missingElements.push({
            foundElement: element != null,
            foundParent : parent != null,
            elementId,
            parentId,
            data        : parent ?? element
          })
          continue
        }

        parent.children.push(element)
      }
    }

    return [{
      root: root ?? {
        isExpanded : false,
        children   : [],
        name       : '',
        contentType: ContentType.HEADER
      } satisfies TriggerContainer,
      scriptReferences: customScripts
    }, formatVersion, formatSubversion]
  } catch(e) {
    log.error(`Error at offset: ${(input as unknown as { _offset: number })._offset}`)
    throw e
  }
}