import { TriggerDataRegistry } from '../../enhancements/TriggerDataRegistry'
import { type FunctionCall } from '../../data/editor/trigger/parameter/FunctionCall'
import { type TriggerContainer } from '../../data/editor/trigger/TriggerContainer'
import { ContentType, type TriggerContent } from '../../data/editor/trigger/content/TriggerContent'
import { ContentTypeEnumConverter } from '../util/ContentTypeEnumConverter'
import { type ScriptContent } from '../../data/editor/trigger/properties/ScriptContent'
import { type CustomScript } from '../../data/editor/trigger/content/CustomScript'
import { type GlobalVariable } from '../../data/editor/trigger/content/GlobalVariable'
import { type GUITrigger } from '../../data/editor/trigger/content/GUITrigger'
import { type TriggerComment } from '../../data/editor/trigger/content/TriggerComment'
import { type ArrayVariableParameter } from '../../data/editor/trigger/parameter/ArrayVariableParameter'
import { type PresetParameter } from '../../data/editor/trigger/parameter/PresetParameter'
import { type LiteralParameter } from '../../data/editor/trigger/parameter/LiteralParameter'
import { type VariableParameter } from '../../data/editor/trigger/parameter/VariableParameter'
import { type Statement } from '../../data/editor/trigger/statement/Statement'
import { StatementTypeEnumConverter } from '../util/StatementTypeEnumConverter'
import { StatementType } from '../../data/editor/trigger/statement/StatementType'
import { type NestingStatement } from '../../data/editor/trigger/statement/NestingStatement'
import { ParameterTypeEnumConverter } from '../util/ParameterTypeEnumConverter'
import { type Parameter } from '../../data/editor/trigger/parameter/Parameter'
import { ParameterType } from '../../data/editor/trigger/parameter/ParameterType'
import { W3Buffer } from '../W3Buffer'
import { type VersionedBinaryToJsonConverter } from '../VersionedBinaryToJsonConverter'

export class TriggersTranslator implements VersionedBinaryToJsonConverter<{
  roots: TriggerContainer[]
  scriptReferences: Array<ScriptContent | null>
}> {
  public canTranslate (buffer: Buffer): boolean {

  }

  public translate (buffer: Buffer): JSONTranslationResult<{
    roots: TriggerContainer[]
    scriptReferences: Array<ScriptContent | null>
  }> {
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
                  const readParams = (parent: Statement | FunctionCall | ArrayVariableParameter, paramCount: number, arrayIndex: boolean): void => {
                    for (let k = 0; k < paramCount; k++) {
                      const paramType = ParameterTypeEnumConverter.toEnum(outBufferToJSON.readInt())
                      const value = outBufferToJSON.readString()
                      const hasSubParameters = outBufferToJSON.readInt() === 1

                      let parameter: unknown
                      switch (paramType) {
                        case ParameterType.FUNCTION:
                          parameter = {
                            name: value,
                            type: paramType,
                            statementType: StatementType.CALL,
                            statement: {} as unknown as Statement
                          } satisfies FunctionCall
                          break

                        case ParameterType.VALUE:
                          parameter = {
                            type: paramType,
                            value
                          } satisfies LiteralParameter
                          break

                        case ParameterType.INVALID:
                          parameter = {
                            type: paramType
                          }
                          break

                        case ParameterType.PRESET:
                          parameter = {
                            type: paramType,
                            presetName: value
                          } satisfies PresetParameter
                          break

                        case ParameterType.VARIABLE:
                          parameter = {
                            type: paramType,
                            value
                          } satisfies VariableParameter
                          break
                      }

                      if (hasSubParameters) {
                        const functionCall = parameter as FunctionCall
                        functionCall.statementType = StatementTypeEnumConverter.toEnum(outBufferToJSON.readInt())
                        functionCall.statement.name = outBufferToJSON.readString()
                        functionCall.statement.parameters = []
                        const beginParams = outBufferToJSON.readInt() !== 0
                        const subParamCount = TriggerDataRegistry.getParameterCount(functionCall.statementType, functionCall.statement.name)
                        if (subParamCount == null) {
                          throw new Error('Missing parameter count for function ' + functionCall.statement.name)
                        }

                        readParams(functionCall.statement, subParamCount, false)
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
                        readParams(parameter as ArrayVariableParameter, 1, true)
                      }

                      if (arrayIndex) {
                        (parent as ArrayVariableParameter).arrayIndex = parameter as Parameter
                      } else if ((parent as FunctionCall).statement != null) {
                        (parent as FunctionCall).statement.parameters.push(parameter as Parameter)
                      } else {
                        (parent as Statement).parameters.push(parameter as Parameter)
                      }
                    }
                  }
                  const statement: Statement = {
                    name,
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
                      ((content as NestingStatement).statements[group].statements).push(statement)
                    } else {
                      ((content as NestingStatement).statements[group]) = {
                        statements: [statement],
                        type: functionType
                      }
                    }
                  }
                }
              }
              readStatements(trigger, ecaCount, false)
              content[elementId] = trigger
              customScripts.push(null)
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
