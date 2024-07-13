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
import { type NestingStatement } from './data/statement/NestingStatement'
import { ParameterTypeEnumConverter } from './util/ParameterTypeEnumConverter'
import { type Parameter } from './data/parameter/Parameter'
import { ParameterType } from './data/parameter/ParameterType'
import { type WarResult, type JsonResult } from '../wc3maptranslator/CommonInterfaces'
import { HexBuffer } from '../wc3maptranslator/HexBuffer'
import { W3Buffer } from '../wc3maptranslator/W3Buffer'
import { type Translator } from '../wc3maptranslator/translators'

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

export class TriggersTranslator implements Translator<TriggerTranslatorOutput> {
  private static instance: TriggersTranslator | null = null

  private constructor () { }

  public static getInstance (): TriggersTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (triggers: TriggerTranslatorOutput): WarResult {
    return this.getInstance().jsonToWar(triggers)
  }

  public static warToJson (buffer: Buffer): JsonResult<TriggerTranslatorOutput> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar (json: TriggerTranslatorOutput): WarResult {
    const outBufferToWar = new HexBuffer()

    outBufferToWar.addChars('WTG!') // File header
    outBufferToWar.addByte(0x04)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x80) // Format version
    outBufferToWar.addInt(7) // TFT Game Version

    const contentTypeCounts = countContentTypes(json.roots)
    let totalElements = 0
    for (const count of contentTypeCounts.values()) {
      totalElements = totalElements + count
    }
    const writeContentCount = function (contentType: ContentType): void {
      outBufferToWar.addInt(contentTypeCounts.get(contentType) as number)
      outBufferToWar.addInt(0) // deleted count
    }
    writeContentCount(ContentType.HEADER)
    writeContentCount(ContentType.LIBRARY)
    writeContentCount(ContentType.CATEGORY)
    writeContentCount(ContentType.TRIGGER)
    writeContentCount(ContentType.COMMENT)
    writeContentCount(ContentType.CUSTOM_SCRIPT)
    writeContentCount(ContentType.VARIABLE)

    outBufferToWar.addInt(0) // unknown
    outBufferToWar.addInt(0) // unknown
    outBufferToWar.addInt(2) // 1 for RoC?, 2 for TFT?

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
    outBufferToWar.addInt(variables.size)

    for (const [variable, parentId] of variables.entries()) {
      outBufferToWar.addString(variable.name)
      outBufferToWar.addString(variable.type)
      outBufferToWar.addInt(1) // unknown, always 1?
      outBufferToWar.addInt(variable.isArray ? 1 : 0)
      outBufferToWar.addInt(variable.arrayLength)
      outBufferToWar.addInt(variable.isInitialized ? 1 : 0)
      outBufferToWar.addString(variable.initialValue)
      const elementId = elementReference.get(variable)
      if (elementId == null) {
        throw new Error(`Variable ${variable.name} missing ID`)
      }
      outBufferToWar.addInt(elementId)
      outBufferToWar.addInt(parentId) // parent
    }

    triggerStack.push(...json.roots)
    const parentStack: TriggerContainer[] = []
    outBufferToWar.addInt(totalElements)
    while (triggerStack.length > 0) {
      const currentTrigger = triggerStack.pop()
      if (currentTrigger == null) continue
      const elementId = elementReference.get(currentTrigger)
      if (elementId == null) {
        throw new Error(`TriggerContent ${currentTrigger.name} missing ID`)
      }
      outBufferToWar.addInt(ContentTypeEnumConverter.toIdentifier(currentTrigger.contentType))

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
          outBufferToWar.addInt(elementId)
          outBufferToWar.addString(currentTrigger.name)
          outBufferToWar.addInt(0) // not a comment
          outBufferToWar.addInt((currentTrigger as TriggerContainer).isExpanded ? 1 : 0) // not expanded
          outBufferToWar.addInt(parentId)
          triggerStack.push(...(currentTrigger as TriggerContainer).children)
          break

        case ContentType.TRIGGER:
        case ContentType.TRIGGER_SCRIPTED:
        case ContentType.COMMENT:
        case ContentType.CUSTOM_SCRIPT:
          outBufferToWar.addString(currentTrigger.name)
          if (currentTrigger.contentType === ContentType.COMMENT) {
            outBufferToWar.addString((currentTrigger as TriggerComment).comment)
          } else {
            outBufferToWar.addString((currentTrigger as GUITrigger).description)
          }
          outBufferToWar.addInt(currentTrigger.contentType === ContentType.COMMENT ? 1 : 0)
          outBufferToWar.addInt(elementId)
          if (currentTrigger.contentType === ContentType.CUSTOM_SCRIPT) {
            outBufferToWar.addInt((currentTrigger as CustomScript).isEnabled ? 1 : 0)
            outBufferToWar.addInt(1) // is custom script
            outBufferToWar.addInt(0) // initially off
            outBufferToWar.addInt(0) // doesn't run on map init
            outBufferToWar.addInt(parentId)
            outBufferToWar.addInt(0) // ECA count 0
          } else if (currentTrigger.contentType === ContentType.COMMENT) {
            outBufferToWar.addInt(0) // not enabled
            outBufferToWar.addInt(0) // is custom script
            outBufferToWar.addInt(0) // initially off
            outBufferToWar.addInt(0) // doesn't run on map init
            outBufferToWar.addInt(parentId)
            outBufferToWar.addInt(0) // ECA count 0
          } else if (currentTrigger.contentType === ContentType.TRIGGER) {
            ecaCount = (currentTrigger as GUITrigger).events.length +
              (currentTrigger as GUITrigger).conditions.length +
              (currentTrigger as GUITrigger).actions.length
            outBufferToWar.addInt((currentTrigger as GUITrigger).isEnabled ? 1 : 0) // not enabled
            outBufferToWar.addInt(0) // is custom script
            outBufferToWar.addInt((currentTrigger as GUITrigger).initiallyOff ? 1 : 0) // initially off
            outBufferToWar.addInt((currentTrigger as GUITrigger).runOnMapInit ? 0 : 1) // run on map init
            outBufferToWar.addInt(parentId)
            outBufferToWar.addInt(ecaCount)

            const writeStatements = (parent: GUITrigger | Statement, ECAs: Statement[], group: number): void => {
              for (const eca of ECAs) {
                outBufferToWar.addInt(StatementTypeEnumConverter.toIdentifier(eca.type))

                if (group !== -1) {
                  outBufferToWar.addInt(group)
                }

                outBufferToWar.addString(eca.name)
                outBufferToWar.addInt(eca.isEnabled ? 1 : 0)
                const writeParams = (parent: Statement | Parameter, parameters: Parameter[]): void => {
                  for (const param of parameters) {
                    outBufferToWar.addInt(ParameterTypeEnumConverter.toIdentifier(param.type))
                    outBufferToWar.addString(param.value)
                    if (param.statement != null) {
                      outBufferToWar.addInt(1) // has sub params
                      outBufferToWar.addInt(StatementTypeEnumConverter.toIdentifier(param.statement.type))
                      outBufferToWar.addString(param.statement.name)
                      outBufferToWar.addInt(1) // begin function
                      writeParams(param, param.statement.parameters)
                      outBufferToWar.addInt(0) // unknown, end function maybe?
                    } else {
                      outBufferToWar.addInt(0) // no sub params
                    }

                    if (param.arrayIndex != null) {
                      outBufferToWar.addInt(1) // is array
                      writeParams(param, [param.arrayIndex])
                    } else {
                      outBufferToWar.addInt(0) // is not array
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

                  outBufferToWar.addInt(ecaCount)
                  for (const [group, nestedStatements] of Object.entries(nestingStatement.statements)) {
                    if (nestedStatements != null) {
                      writeStatements(eca, nestedStatements, Number(group))
                    }
                  }
                } else {
                  outBufferToWar.addInt(0) // ecaCount
                }
              }
            }
            writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).actions, -1)
            writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).events, -1)
            writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).conditions, -1)
          } else if (currentTrigger.contentType === ContentType.TRIGGER_SCRIPTED) {
            outBufferToWar.addInt((currentTrigger as GUITrigger).isEnabled ? 1 : 0) // not enabled
            outBufferToWar.addInt(1) // is custom script
            outBufferToWar.addInt((currentTrigger as GUITrigger).initiallyOff ? 1 : 0) // initially off
            outBufferToWar.addInt((currentTrigger as GUITrigger).runOnMapInit ? 0 : 1) // run on map init
            outBufferToWar.addInt(parentId)
            outBufferToWar.addInt(0)
          }
          break

        case ContentType.VARIABLE:
          outBufferToWar.addInt(elementId)
          outBufferToWar.addString((currentTrigger as GlobalVariable).name)
          outBufferToWar.addInt(parentId)
          break
      }
    }

    return { buffer: outBufferToWar.getBuffer(), errors: [] }
  }

  public warToJson (buffer: Buffer): JsonResult<TriggerTranslatorOutput> {
    const outBufferToJSON = new W3Buffer(buffer)

    try {
      const fileId = outBufferToJSON.readChars(4) // WTG!
      const formatVersion = outBufferToJSON.readInt() // 04 00 00 80
      const gameVersion = outBufferToJSON.readInt() // 4 = Roc, 7 = TFT

      const headerCount = outBufferToJSON.readInt() // always 1..?
      const deletedHeaderCount = outBufferToJSON.readInt() //  Includes both existing and deleted headers. (Map script headers?)
      for (let i = 0; i < deletedHeaderCount; i++) {
        const headerId = outBufferToJSON.readInt() // always 0..?
      }

      const libraryCount = outBufferToJSON.readInt()
      const deletedLibraryCount = outBufferToJSON.readInt()
      for (let i = 0; i < deletedHeaderCount; i++) {
        const libraryId = outBufferToJSON.readInt()
      }

      const triggerCategoryCount = outBufferToJSON.readInt()
      const deletedCategoryCount = outBufferToJSON.readInt()
      for (let i = 0; i < deletedCategoryCount; i++) { // trigger categories
        const categoryId = outBufferToJSON.readInt()
      }

      const triggerCount = outBufferToJSON.readInt()
      const deletedTriggerCount = outBufferToJSON.readInt()
      for (let i = 0; i < deletedTriggerCount; i++) {
        const triggerId = outBufferToJSON.readInt()
      }

      const triggerCommentCount = outBufferToJSON.readInt()
      const deletedTriggerCommentCount = outBufferToJSON.readInt()
      for (let i = 0; i < deletedTriggerCommentCount; i++) {
        const triggerCommentId = outBufferToJSON.readInt()
      }

      const customScriptCount = outBufferToJSON.readInt()
      const deletedCustomScriptCount = outBufferToJSON.readInt()
      for (let i = 0; i < deletedCustomScriptCount; i++) {
        const customScriptId = outBufferToJSON.readInt()
      }

      const variableCount = outBufferToJSON.readInt()
      const deletedVariableCount = outBufferToJSON.readInt()
      for (let i = 0; i < deletedVariableCount; i++) {
        const variableId = outBufferToJSON.readInt()
      }

      outBufferToJSON.readInt() // unknown
      outBufferToJSON.readInt() // unknown
      const triggerDefinitionVersion = outBufferToJSON.readInt() // 1 for RoC?, 2 for TFT?

      const elementRelations = new Map<number, number>()
      const containers: Record<number, TriggerContainer> = {}
      const content: Record<number, TriggerContent> = {}
      const customScripts: Array<ScriptContent | null> = []
      const allGlobalVariables: Record<number, GlobalVariable> = {}
      const existingVariablesCount = outBufferToJSON.readInt()
      for (let i = 0; i < existingVariablesCount; i++) {
        const globalVariable: GlobalVariable = {
          name: '',
          contentType: ContentType.VARIABLE,
          type: '',
          isArray: false,
          arrayLength: 0,
          isInitialized: false,
          initialValue: ''
        }
        globalVariable.name = outBufferToJSON.readString()
        globalVariable.type = outBufferToJSON.readString()
        outBufferToJSON.readInt() // unknown, always 1?
        globalVariable.isArray = outBufferToJSON.readInt() === 1
        if (gameVersion === 7) {
          globalVariable.arrayLength = outBufferToJSON.readInt()
        }
        globalVariable.isInitialized = outBufferToJSON.readInt() === 1
        globalVariable.initialValue = outBufferToJSON.readString()
        const variableId = outBufferToJSON.readInt() // last byte 06?

        allGlobalVariables[variableId] = globalVariable
        content[variableId] = globalVariable
        elementRelations.set(variableId, outBufferToJSON.readInt())
      }

      const totalElements = outBufferToJSON.readInt()
      for (let i = 0; i < totalElements; i++) {
        const type = ContentTypeEnumConverter.toEnum(outBufferToJSON.readInt())

        let elementId: number
        let name: string
        let description: string
        let isComment = false
        let isExpanded = false
        let isEnabled = false
        let isCustomScript = false
        let initiallyOff = false
        let runOnMapInit = false
        let ecaCount = 0
        let parentElementId: number
        let trigger: GUITrigger

        let container: unknown

        switch (type) {
          case ContentType.HEADER:
          case ContentType.LIBRARY:
          case ContentType.CATEGORY:

            elementId = outBufferToJSON.readInt()
            name = outBufferToJSON.readString()
            if (gameVersion === 7) {
              isComment = outBufferToJSON.readInt() === 1
            }
            isExpanded = outBufferToJSON.readInt() === 1
            parentElementId = outBufferToJSON.readInt()

            elementRelations.set(elementId, parentElementId)
            container = {
              name,
              isExpanded,
              contentType: type,
              children: []
            }
            containers[elementId] = container as TriggerContainer

            if (type === ContentType.HEADER) {
              customScripts.push(container as ScriptContent)
            }
            break

          case ContentType.TRIGGER:
          case ContentType.COMMENT:
          case ContentType.CUSTOM_SCRIPT:
            name = outBufferToJSON.readString()

            description = outBufferToJSON.readString()
            if (gameVersion === 7) {
              isComment = outBufferToJSON.readInt() === 1
            }
            elementId = outBufferToJSON.readInt()
            isEnabled = outBufferToJSON.readInt() === 1
            isCustomScript = outBufferToJSON.readInt() === 1
            initiallyOff = outBufferToJSON.readInt() === 1
            runOnMapInit = outBufferToJSON.readInt() === 0
            parentElementId = outBufferToJSON.readInt()
            elementRelations.set(elementId, parentElementId)
            ecaCount = outBufferToJSON.readInt()

            if (type === ContentType.TRIGGER) {
              if (isCustomScript) {
                const script = {
                  name,
                  contentType: ContentType.TRIGGER_SCRIPTED,
                  description,
                  isEnabled,
                  script: ''
                }
                content[elementId] = script
                customScripts.push(script)
              } else {
                trigger = {
                  name,
                  contentType: ContentType.TRIGGER,
                  description,
                  isEnabled,
                  initiallyOff,
                  runOnMapInit,
                  events: [],
                  conditions: [],
                  actions: []
                }
                const readStatements = (content: GUITrigger | Statement, functionCount: number, isChild: boolean): void => {
                  for (let j = 0; j < functionCount; j++) {
                    const functionType = StatementTypeEnumConverter.toEnum(outBufferToJSON.readInt())

                    let group = -1
                    if (isChild) {
                      group = outBufferToJSON.readInt()
                    }
                    const name = outBufferToJSON.readString()
                    const isEnabled = outBufferToJSON.readInt() === 1

                    const parameterCount = TriggerDataRegistry.getParameterCount(functionType, name)
                    const readParams = (parent: Statement | Parameter, paramCount: number, arrayIndex: boolean): void => {
                      for (let k = 0; k < paramCount; k++) {
                        const paramType = ParameterTypeEnumConverter.toEnum(outBufferToJSON.readInt())
                        const value = outBufferToJSON.readString()
                        const hasSubParameters = !(outBufferToJSON.readInt() === 0)

                        const parameter: Parameter = {
                          type: paramType,
                          value,
                          statement: undefined,
                          arrayIndex: undefined
                        }

                        if (hasSubParameters) {
                          parameter.statement = {
                            type: StatementTypeEnumConverter.toEnum(outBufferToJSON.readInt()),
                            isEnabled: true,
                            name: outBufferToJSON.readString(),
                            parameters: [] as Parameter[]
                          } satisfies Statement
                          const beginParams = outBufferToJSON.readInt() !== 0
                          const subParamCount = TriggerDataRegistry.getParameterCount(parameter.statement.type, parameter.statement.name)
                          if (subParamCount == null) {
                            throw new Error('Missing parameter count for function ' + parameter.statement.name)
                          }

                          readParams(parameter.statement, subParamCount, false)
                        }

                        if (gameVersion === 4 && paramType === ParameterType.FUNCTION) {
                          outBufferToJSON.readInt()
                        } else if (gameVersion === 7 && hasSubParameters) {
                          outBufferToJSON.readInt()
                        }

                        let isArray: boolean
                        if (gameVersion !== 4 || paramType !== ParameterType.FUNCTION) {
                          isArray = outBufferToJSON.readInt() === 1
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
                      const nestedEcaCount = outBufferToJSON.readInt()
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
                content[elementId] = trigger
                customScripts.push(null)
              }
            } else if (type === ContentType.COMMENT) {
              content[elementId] = {
                name,
                contentType: ContentType.COMMENT,
                comment: description
              } satisfies TriggerComment as TriggerContent
            } else if (type === ContentType.CUSTOM_SCRIPT) {
              const script = {
                name,
                contentType: ContentType.CUSTOM_SCRIPT,
                description,
                isEnabled,
                script: ''
              }
              content[elementId] = script
              customScripts.push(script)
            }
            break

          case ContentType.VARIABLE:
            elementId = outBufferToJSON.readInt()
            name = outBufferToJSON.readString() // excess data?
            parentElementId = outBufferToJSON.readInt()

            elementRelations.set(elementId, parentElementId)
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

      return {
        json: {
          roots,
          scriptReferences: customScripts
        },
        errors: []
      }
    } catch (e) {
      return {
        json: {
          roots: [],
          scriptReferences: []
        },
        errors: [
          {
            message: ` Error at offset: ${(outBufferToJSON as unknown as { _offset: number })._offset}`
          },
          {
            message: e as string
          }
        ]
      }
    }
  }
}

export type { TriggerTranslatorOutput }
