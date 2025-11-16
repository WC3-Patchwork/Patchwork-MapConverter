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
import { type StatementType } from './data/statement/StatementType'
import { type NestingStatement } from './data/statement/NestingStatement'
import { ParameterTypeEnumConverter } from './util/ParameterTypeEnumConverter'
import { type Parameter } from './data/parameter/Parameter'
import { ParameterType } from './data/parameter/ParameterType'
import { HexBuffer } from '../wc3maptranslator/HexBuffer'
import { W3Buffer } from '../wc3maptranslator/W3Buffer'
import { type ScriptedTrigger } from './data/content/ScriptedTrigger'
import { type integer } from '../wc3maptranslator/CommonInterfaces'
import { LoggerFactory } from '../logging/LoggerFactory'
import { type MapHeader } from './data/MapHeader'

const log = LoggerFactory.createLogger('TriggersTranslator')

interface TriggerTranslatorOutput {
  roots: TriggerContainer[]
  scriptReferences: Array<ScriptContent | null>
}

function countContentTypes (roots: TriggerContainer[]): Map<ContentType, number> {
  const triggerStack: TriggerContent[] = [...roots]
  const result = new Map<ContentType, number>()

  result.set(ContentType.HEADER, 0)
  result.set(ContentType.LIBRARY, 0)
  result.set(ContentType.CATEGORY, 0)
  result.set(ContentType.TRIGGER, 0)
  result.set(ContentType.COMMENT, 0)
  result.set(ContentType.CUSTOM_SCRIPT, 0)
  result.set(ContentType.VARIABLE, 0)

  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue
    const count = result.get(currentTrigger.contentType)
    if (count == null) {
      result.set(currentTrigger.contentType, 1)
    } else {
      result.set(currentTrigger.contentType, count + 1)
    }
    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
      case ContentType.LIBRARY:
      case ContentType.CATEGORY:
        triggerStack.push(...(currentTrigger as TriggerContainer).children)
    }
  }

  return result
}

function getAllOfContentType (roots: TriggerContainer[], elementReference: Map<TriggerContent, number>, type: ContentType): Map<TriggerContent, number> {
  const triggerStack: TriggerContent[] = [...roots]
  const parentStack: TriggerContainer[] = []
  const result = new Map<TriggerContent, number>()
  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue

    let parent = parentStack.pop()
    let parentId: number | undefined
    while (parent != null) {
      if (parent.children.findIndex((value) => value === currentTrigger) > -1) break // this is the parent
      parent = parentStack.pop() // go down the stack
    }
    if (parent == null) {
      parentId = -1
    } else {
      parentStack.push(parent)
      parentId = elementReference.get(parent)
      if (parentId == null) {
        throw new Error('Parent ' + parent.name + ' has no ID??') // something wrong with tree traversal? :thinking:
      }
    }
    if ((currentTrigger as TriggerContainer).children != null) {
      parentStack.push(currentTrigger as TriggerContainer)
    }

    if (currentTrigger.contentType === type) {
      result.set(currentTrigger, parentId)
    }

    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
      case ContentType.LIBRARY:
      case ContentType.CATEGORY:
        triggerStack.push(...(currentTrigger as TriggerContainer).children)
    }
  }

  return result
}

export function jsonToWar (json: TriggerTranslatorOutput, formatVersion: integer, formatSubversion: integer): Buffer {
  const output = new HexBuffer()

  output.addChars('WTG!') // File header
  output.addByte(0x04)
  output.addByte(0x00)
  output.addByte(0x00)
  output.addByte(0x80) // Format version
  output.addInt(7) // TFT Game Version

  const contentTypeCounts = countContentTypes(json.roots)
  let totalElements = 0
  for (const count of contentTypeCounts.values()) {
    totalElements = totalElements + count
  }
  const writeContentCount = function (contentType: ContentType): void {
    output.addInt(contentTypeCounts.get(contentType) as number)
    output.addInt(0) // deleted count
  }
  writeContentCount(ContentType.HEADER)
  writeContentCount(ContentType.LIBRARY)
  writeContentCount(ContentType.CATEGORY)
  writeContentCount(ContentType.TRIGGER)
  writeContentCount(ContentType.COMMENT)
  writeContentCount(ContentType.CUSTOM_SCRIPT)
  writeContentCount(ContentType.VARIABLE)

  output.addInt(0) // unknown
  output.addInt(0) // unknown
  output.addInt(2) // 1 for RoC?, 2 for TFT?

  const elementReference = new Map<TriggerContent, number>()

  let headerCount = 0
  let libraryCount = 0
  let categoryCount = 0
  let triggerCount = 0
  let commentCount = 0
  let customScriptCount = 0
  let variableCount = 0

  const triggerStack: TriggerContent[] = [...json.roots]

  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue
    let elementId: number

    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
        elementId = 0x00000000 + headerCount++
        triggerStack.push(...(currentTrigger as TriggerContainer).children)
        break
      case ContentType.LIBRARY:
        elementId = 0x01000000 + libraryCount++
        triggerStack.push(...(currentTrigger as TriggerContainer).children)
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
  }

  const variables = getAllOfContentType(json.roots, elementReference, ContentType.VARIABLE) as Map<GlobalVariable, number>
  output.addInt(variables.size)

  for (const [variable, parentId] of variables.entries()) {
    output.addString(variable.name)
    output.addString(variable.type)
    output.addInt(1) // unknown, always 1?
    output.addInt(variable.isArray ? 1 : 0)
    output.addInt(variable.arrayLength)
    output.addInt(variable.isInitialized ? 1 : 0)
    output.addString(variable.initialValue)
    const elementId = elementReference.get(variable)
    if (elementId == null) {
      throw new Error(`Variable ${variable.name} missing ID`)
    }
    output.addInt(elementId)
    output.addInt(parentId) // parent
  }

  triggerStack.push(...json.roots)
  const parentStack: TriggerContainer[] = []
  output.addInt(totalElements)
  while (triggerStack.length > 0) {
    const currentTrigger = triggerStack.pop()
    if (currentTrigger == null) continue
    const elementId = elementReference.get(currentTrigger)
    if (elementId == null) {
      throw new Error(`TriggerContent ${currentTrigger.name} missing ID`)
    }
    output.addInt(ContentTypeEnumConverter.toIdentifier(currentTrigger.contentType))

    let parent = parentStack.pop()
    let parentId: number | undefined
    while (parent != null) {
      if (parent.children.findIndex((value) => value === currentTrigger) > -1) break // this is the parent
      parent = parentStack.pop() // go down the stack
    }
    if (parent == null) {
      parentId = -1
    } else {
      parentStack.push(parent)
      parentId = elementReference.get(parent)
      if (parentId == null) {
        throw new Error('Parent ' + parent.name + ' has no ID??') // something wrong with tree traversal? :thinking:
      }
    }
    if ((currentTrigger as TriggerContainer).children != null) {
      parentStack.push(currentTrigger as TriggerContainer)
    }

    let ecaCount: number
    switch (currentTrigger.contentType) {
      case ContentType.HEADER:
      case ContentType.LIBRARY:
      case ContentType.CATEGORY:
        output.addInt(elementId)
        output.addString(currentTrigger.name)
        output.addInt(0) // not a comment
        output.addInt((currentTrigger as TriggerContainer).isExpanded ? 1 : 0) // not expanded
        output.addInt(parentId)
        triggerStack.push(...(currentTrigger as TriggerContainer).children)
        break

      case ContentType.TRIGGER:
      case ContentType.TRIGGER_SCRIPTED:
      case ContentType.COMMENT:
      case ContentType.CUSTOM_SCRIPT:
        output.addString(currentTrigger.name)
        if (currentTrigger.contentType === ContentType.COMMENT) {
          output.addString((currentTrigger as TriggerComment).comment)
        } else {
          output.addString((currentTrigger as GUITrigger).description)
        }
        output.addInt(currentTrigger.contentType === ContentType.COMMENT ? 1 : 0)
        output.addInt(elementId)
        if (currentTrigger.contentType === ContentType.CUSTOM_SCRIPT) {
          output.addInt((currentTrigger as CustomScript).isEnabled ? 1 : 0)
          output.addInt(1) // is custom script
          output.addInt(0) // initially off
          output.addInt(0) // doesn't run on map init
          output.addInt(parentId)
          output.addInt(0) // ECA count 0
        } else if (currentTrigger.contentType === ContentType.COMMENT) {
          output.addInt(0) // not enabled
          output.addInt(0) // is custom script
          output.addInt(0) // initially off
          output.addInt(0) // doesn't run on map init
          output.addInt(parentId)
          output.addInt(0) // ECA count 0
        } else if (currentTrigger.contentType === ContentType.TRIGGER) {
          ecaCount = (currentTrigger as GUITrigger).events.length +
              (currentTrigger as GUITrigger).conditions.length +
              (currentTrigger as GUITrigger).actions.length
          output.addInt((currentTrigger as GUITrigger).isEnabled ? 1 : 0)
          output.addInt(0) // is custom script
          output.addInt((currentTrigger as GUITrigger).initiallyOff ? 1 : 0)
          output.addInt((currentTrigger as GUITrigger).runOnMapInit ? 1 : 0)
          output.addInt(parentId)
          output.addInt(ecaCount)

          const writeStatements = (parent: GUITrigger | Statement, ECAs: Statement[], group: number): void => {
            for (const eca of ECAs) {
              output.addInt(StatementTypeEnumConverter.toIdentifier(eca.type))

              if (group !== -1) {
                output.addInt(group)
              }

              output.addString(eca.name)
              output.addInt(eca.isEnabled ? 1 : 0)
              const writeParams = (parent: Statement | Parameter, parameters: Parameter[]): void => {
                for (const param of parameters) {
                  output.addInt(ParameterTypeEnumConverter.toIdentifier(param.type))
                  output.addString(param.value)
                  if (param.statement != null) {
                    output.addInt(1) // has sub params
                    output.addInt(StatementTypeEnumConverter.toIdentifier(param.statement.type))
                    output.addString(param.statement.name)
                    output.addInt(1) // begin function
                    writeParams(param, param.statement.parameters)
                    output.addInt(0) // unknown, end function maybe?
                  } else {
                    output.addInt(0) // no sub params
                  }

                  if (param.arrayIndex != null) {
                    output.addInt(1) // is array
                    writeParams(param, [param.arrayIndex])
                  } else {
                    output.addInt(0) // is not array
                  }
                }
              }

              writeParams(eca, eca.parameters)
              if ((eca as NestingStatement).statements != null) {
                const nestingStatement = (eca as NestingStatement)
                let ecaCount = 0
                for (const nestedStatements of Object.values(nestingStatement.statements)) {
                  if (nestedStatements != null) {
                    ecaCount += nestedStatements.length
                  }
                }

                output.addInt(ecaCount)
                for (const [group, nestedStatements] of Object.entries(nestingStatement.statements)) {
                  if (nestedStatements != null) {
                    writeStatements(eca, nestedStatements, Number(group))
                  }
                }
              } else {
                output.addInt(0) // ecaCount
              }
            }
          }
          writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).actions, -1)
          writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).events, -1)
          writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).conditions, -1)
        } else if (currentTrigger.contentType === ContentType.TRIGGER_SCRIPTED) {
          output.addInt((currentTrigger as ScriptedTrigger).isEnabled ? 1 : 0)
          output.addInt(1) // is custom script
          output.addInt(0) // initially off
          output.addInt((currentTrigger as ScriptedTrigger).runOnMapInit ? 1 : 0)
          output.addInt(parentId)
          output.addInt(0)
        }
        break

      case ContentType.VARIABLE:
        output.addInt(elementId)
        output.addString((currentTrigger as GlobalVariable).name)
        output.addInt(parentId)
        break
    }
  }

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): TriggerTranslatorOutput {
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
    const customScripts: Array<ScriptContent | null> = []
    const allGlobalVariables: Record<number, GlobalVariable> = {}
    const loadGlobals = function (): void {
      const variableFormatVersion = input.readInt() // [0, 2]
      const existingVariablesCount = input.readInt()
      for (let i = 0; i < existingVariablesCount; i++) {
        const name = input.readString()
        const type = input.readString()
        const userDefined = !!input.readInt() // always 1?
        const isArray = input.readInt() === 1
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

    const loadContainer = function (type: ContentType): TriggerContainer {
      const elementId = input.readInt()
      const name = input.readString()
      if (formatVersion > 6) {
        const isComment = !!input.readInt() // pretty sure containers cannot be comments...
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
        children: []
      } satisfies TriggerContainer
      containers[elementId] = container

      return container
    }

    const loadTrigger = function (index: integer, contentType: ContentType): void {
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

        let triggerContent: TriggerContent
        switch (contentType) {
          case ContentType.TRIGGER:
            triggerContent = {
              name,
              contentType,
              description,
              isEnabled,
              initiallyOff,
              runOnMapInit,
              events: [],
              conditions: [],
              actions: []
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
          loadTriggerFunction(functionType)
        }
      }
    }

    const loadTriggerFunction = function (functionType: StatementType): void {
      const name = input.readString()
      let isEnabled: boolean
      if (formatVersion > 2) {
        isEnabled = !!input.readInt()
      } else {
        isEnabled = true
      }
      const paramCount = TriggerDataRegistry.getParameterCount(functionType, name)
      if (paramCount == null) {
        throw new Error(`Missing parameter count for type ${functionType} - function ${name} in triggerdata.txt`)
      }
      for (let i = 0; i < paramCount; i++) {
        loadTriggerFunctionParameter()
      }
      if (formatVersion > 5) {
        const triggerFunctionCount = input.readInt()
        for (let i = 0; i < triggerFunctionCount; i++) {
          const functionType = StatementTypeEnumConverter.toEnum(input.readInt())
          const groupIndex = input.readInt() // if-then-else
          loadTriggerFunction(functionType)
        }
      }
    }

    const loadTriggerFunctionParameter = function (): void {
      const paramType = ParameterTypeEnumConverter.toEnum(input.readInt())
      const value = input.readString()
      const hasSubParams = !!input.readInt()
      if (hasSubParams) {
        const functionType = StatementTypeEnumConverter.toEnum(input.readInt())
        loadTriggerFunction(functionType)
      }
      const isArray = !!input.readInt()
      if (isArray) {
        loadTriggerFunctionParameter()
      }
    }

    const loadTriggerVariable = function (): void {
      const elementId = input.readInt()
      const name = input.readString() // excess data
      const parentContainerId = input.readInt()

      elementRelations.set(elementId, parentContainerId)
    }

    if (formatVersion < 2147483648) {
      const header = {
        name: 'header',
        description: '',
        contentType: ContentType.HEADER,
        isExpanded: true,
        script: '',
        children: []
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

      // old  past this point
      const totalElements = input.readInt()
      for (let i = 0; i < totalElements; i++) {
        const type = ContentTypeEnumConverter.toEnum(input.readInt())

        let elementId: number
        let name: string
        let description: string
        const isComment = false
        const isExpanded = false
        const isEnabled = false
        const isCustomScript = false
        const initiallyOff = false
        const runOnMapInit = false
        const ecaCount = 0
        let parentElementId: number
        let trigger: GUITrigger

        let container: unknown

        switch (type) {
          case ContentType.HEADER:
          case ContentType.LIBRARY:
          case ContentType.CATEGORY:
            break

          case ContentType.TRIGGER:
          case ContentType.COMMENT:
          case ContentType.CUSTOM_SCRIPT:

            break

          case ContentType.VARIABLE:
            break
        }
      }

      const roots: TriggerContainer[] = []
      const missingElements: Array<{ data?: TriggerContainer | TriggerContent, elementId?: number, parentId?: number, foundParent: boolean, foundElement: boolean }> = []
      // Generate data tree structure
      for (const [elementId, parentId] of elementRelations.entries()) {
        if (parentId === -1) {
          if (containers[elementId] != null) {
            roots.push(containers[elementId])
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
              foundParent: parent != null,
              elementId,
              parentId,
              data: parent != null ? parent : element
            })
            continue
          }

          parent.children.push(element)
        }
      }

      return { roots, scriptReferences: customScripts }
    }
  } catch (e) {
    return { roots: [], scriptReferences: [] }
    // errors: [
    //   {
    //     message: ` Error at offset: ${(input as unknown as { _offset: number })._offset}`
    //   },
    //   {
    //     message: e as string
    //   }
    // ]
  }
}

export type { TriggerTranslatorOutput }

/* old read method
const readStatements = (content: GUITrigger | Statement, functionCount: number, isChild: boolean): void => {
  for (let j = 0; j < functionCount; j++) {
    const functionType = StatementTypeEnumConverter.toEnum(input.readInt())

    let group = -1
    if (isChild) {
      group = input.readInt()
    }

    const name = input.readString()
    const isEnabled = input.readInt() === 1

    const parameterCount = TriggerDataRegistry.getParameterCount(functionType, name)
    const readParams = (parent: Statement | Parameter, paramCount: number, arrayIndex: boolean): void => {
      for (let k = 0; k < paramCount; k++) {
        const paramType = ParameterTypeEnumConverter.toEnum(input.readInt())
        const value = input.readString()
        const hasSubParameters = !(input.readInt() === 0)

        const parameter: Parameter = {
          type: paramType,
          value,
          statement: undefined,
          arrayIndex: undefined
        } satisfies Parameter

        if (hasSubParameters) {
          parameter.statement = {
            type: StatementTypeEnumConverter.toEnum(input.readInt()),
            isEnabled: true,
            name: input.readString(),
            parameters: [] as Parameter[]
          } satisfies Statement
          const beginParams = input.readInt() !== 0
          const subParamCount = TriggerDataRegistry.getParameterCount(parameter.statement.type, parameter.statement.name)
          readParams(parameter.statement, subParamCount, false)
        }

        if (gameVersion === 4 && paramType === ParameterType.FUNCTION) {
          input.readInt()
        } else if (gameVersion === 7 && hasSubParameters) {
          input.readInt()
        }

        let isArray: boolean
        if (gameVersion !== 4 || paramType !== ParameterType.FUNCTION) {
          isArray = input.readInt() === 1
        } else {
          isArray = false
        }
        if (isArray) {
          readParams(parameter, 1, true)
        }

        if (arrayIndex) {
          (parent as Parameter).arrayIndex = parameter
        } else if ((parent as Parameter).statement != null) {
          ((parent as Parameter).statement as Statement).parameters.push(parameter)
        } else {
          (parent as Statement).parameters.push(parameter)
        }
      }
    }
    const statement: Statement = {
      name,
      type: functionType,
      isEnabled,
      parameters: []
    }
    if (parameterCount == null) {
      throw new Error('Missing parameter count for function ' + name)
    }
    readParams(statement, parameterCount, false)

    if (gameVersion === 7) {
      const nestedEcaCount = input.readInt()
      readStatements(statement, nestedEcaCount, true)
    }

    if ((content as GUITrigger).events != null) { // is GUITrigger
      switch (functionType) {
        case StatementType.EVENT:
          (content as GUITrigger).events.push(statement)
          break
        case StatementType.CONDITION:
          (content as GUITrigger).conditions.push(statement)
          break
        case StatementType.ACTION:
          (content as GUITrigger).actions.push(statement)
          break
      }
    } else {
      if ((content as NestingStatement).statements == null) {
        (content as NestingStatement).statements = []
      }
      if ((content as NestingStatement).statements[group] != null) {
        (content as NestingStatement).statements[group].push(statement)
      } else {
        ((content as NestingStatement).statements[group]) = [statement]
      }
    }
  }
}
readStatements(trigger, ecaCount, false)

*/
