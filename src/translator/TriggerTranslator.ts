import { type Translator } from 'wc3maptranslator'
import { type WarResult, type JsonResult } from 'wc3maptranslator/lib/CommonInterfaces'
import { W3Buffer } from 'wc3maptranslator/lib/W3Buffer'
import {
  type TriggerContainer,
  GUITrigger,
  GlobalVariable,
  CustomScript,
  Classifier,
  TriggerComment,
  ECA_Classifier,
  type ECA, ParameterType,
  type Parameter,
  TriggerHeader,
  TriggerLibrary,
  TriggerCategory,
  type TriggerContent,
  type TriggerTranslatorOutput,
  type NestedECAClassifier,
  type FunctionCall
} from './data/Trigger'
import { TriggerDataRegistry, TriggerDataSections } from '../enhancements/TriggerDataRegistry'

export class TriggersTranslator implements Translator<TriggerTranslatorOutput> {
  private static instance: TriggersTranslator | null = null

  private constructor () {}

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
    return { buffer: Buffer.alloc(1), errors: [] }
  }

  public warToJson (buffer: Buffer): JsonResult<TriggerTranslatorOutput> {
    const outBufferToJSON = new W3Buffer(buffer)

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

    // {variableId, data}
    const allGlobalVariables: Record<number, GlobalVariable> = {}
    const existingVariablesCount = outBufferToJSON.readInt()
    for (let i = 0; i < existingVariablesCount; i++) {
      const globalVariable: GlobalVariable = {
        name: '',
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

      allGlobalVariables[variableId] = new GlobalVariable(globalVariable)
    }

    // {elementId, {content, classification}}
    const headers: Record<number, TriggerHeader> = {}
    const libraries: Record<number, TriggerLibrary> = {}
    const categories: Record<number, TriggerCategory> = {}
    const triggers: Record<number, GUITrigger> = {}
    const comments: Record<number, TriggerComment> = {}
    const customScripts: Record<number, CustomScript> = {}

    // {elementId, parentElementId}
    const elementRelations = new Map<number, number>()

    const totalElements = outBufferToJSON.readInt()
    for (let i = 0; i < totalElements; i++) {
      const classifier = outBufferToJSON.readInt() as Classifier

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
      let container: TriggerContainer
      let content: (GUITrigger & CustomScript & TriggerComment) | GUITrigger

      switch (classifier) {
        case Classifier.HEADER:
        case Classifier.LIBRARY:
        case Classifier.CATEGORY:
          elementId = outBufferToJSON.readInt()
          name = outBufferToJSON.readString()
          if (gameVersion === 7) {
            isComment = outBufferToJSON.readInt() === 1
          }
          isExpanded = outBufferToJSON.readInt() === 1
          parentElementId = outBufferToJSON.readInt()
          container = {
            name,
            triggers: []
          }
          elementRelations.set(elementId, parentElementId)
          switch (classifier) {
            case Classifier.HEADER:
              headers[elementId] = new TriggerHeader(container)
              break
            case Classifier.LIBRARY:
              libraries[elementId] = new TriggerLibrary(container)
              break
            case Classifier.CATEGORY:
              categories[elementId] = new TriggerCategory(container)
              break
          }
          break

        case Classifier.GUI_TRIGGER:
        case Classifier.COMMENT:
        case Classifier.CUSTOM_SCRIPT:
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
          ecaCount = outBufferToJSON.readInt()
          content = {
            name,
            description,
            isEnabled,
            initiallyOff,
            runOnMapInit,
            events: [],
            conditions: [],
            actions: [],
            script: ''
          }

          if (classifier === Classifier.GUI_TRIGGER) {
            const readECAFunctions = (content: GUITrigger | ECA, functionCount: number, isChild: boolean): void => {
              for (let j = 0; j < functionCount; j++) {
                const functionType = outBufferToJSON.readInt() as ECA_Classifier

                let group: NestedECAClassifier | -1 = -1
                if (isChild) {
                  group = outBufferToJSON.readInt() as NestedECAClassifier
                }
                const name = outBufferToJSON.readString()
                const isEnabled = outBufferToJSON.readInt() === 1

                const parameterCount = TriggerDataRegistry.getParameterCount(functionType, name)
                const readParams = (parent: ECA | FunctionCall, paramCount: number): void => {
                  for (let k = 0; k < paramCount; k++) {
                    const paramType = outBufferToJSON.readInt() as ParameterType
                    const value = outBufferToJSON.readString()
                    const hasSubParameters = outBufferToJSON.readInt() === 1

                    const parameter: Parameter = {
                      type: paramType,
                      value,
                      nestedParams: [],
                      arrayIndex: undefined
                    }
                    if (hasSubParameters) {
                      const subParamType = outBufferToJSON.readInt() as ECA_Classifier
                      const subParamName = outBufferToJSON.readString()
                      const beginParams = outBufferToJSON.readInt() !== 0
                      const subParamCount = TriggerDataRegistry.getParameterCount(subParamType, subParamName)
                      if (subParamCount == null) {
                        throw new Error('Missing parameter count for function ' + subParamName)
                      }
                      const functionCall: FunctionCall = {
                        name: subParamName,
                        parameters: []
                      }
                      readParams(functionCall, subParamCount)
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
                      parameter.arrayIndex = outBufferToJSON.readInt()
                    }

                    parent.parameters.push(parameter)
                  }
                }
                const eca: ECA = {
                  name,
                  isEnabled,
                  nestedAs: group,
                  children: [],
                  parameters: []
                }
                if (parameterCount == null) {
                  throw new Error('Missing parameter count for function ' + name)
                }
                readParams(eca, parameterCount)

                if (gameVersion === 7) {
                  const nestedEcaCount = outBufferToJSON.readInt()
                  readECAFunctions(eca, nestedEcaCount, true)
                }

                if ((content as GUITrigger).events != null) { // is GUITrigger
                  switch (functionType) {
                    case ECA_Classifier.EVENT:
                      (content as GUITrigger).events.push(eca)
                      break
                    case ECA_Classifier.CONDITION:
                      (content as GUITrigger).conditions.push(eca)
                      break
                    case ECA_Classifier.ACTION:
                      (content as GUITrigger).actions.push(eca)
                      break
                  }
                } else {
                  (content as ECA).children.push(eca)
                }
              }
            }
            readECAFunctions(content, ecaCount, false)
          }

          elementRelations.set(elementId, parentElementId)
          switch (classifier) {
            case Classifier.GUI_TRIGGER:
              triggers[elementId] = new GUITrigger(content)
              break
            case Classifier.COMMENT:
              comments[elementId] = new TriggerComment(content)
              break
            case Classifier.CUSTOM_SCRIPT:
              customScripts[elementId] = new CustomScript(content)
              break
          }
          break

        case Classifier.VARIABLE:
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
        if (headers[elementId] != null) {
          roots.push(headers[elementId])
        } else if (libraries[elementId] != null) {
          roots.push(libraries[elementId])
        } else if (categories[elementId] != null) {
          roots.push(categories[elementId])
        }
      } else {
        let parent: TriggerContainer | undefined
        if (headers[parentId] != null) {
          parent = headers[parentId]
        } else if (libraries[parentId] != null) {
          parent = libraries[parentId]
        } else if (categories[parentId] != null) {
          parent = categories[parentId]
        }

        let element: TriggerContainer | TriggerContent | undefined
        if (headers[elementId] != null) {
          element = headers[elementId]
        } else if (libraries[elementId] != null) {
          element = libraries[elementId]
        } else if (categories[elementId] != null) {
          element = categories[elementId]
        } else if (triggers[elementId] != null) {
          element = triggers[elementId]
        } else if (comments[elementId] != null) {
          element = comments[elementId]
        } else if (customScripts[elementId] != null) {
          element = customScripts[elementId]
        } else if (allGlobalVariables[elementId] != null) {
          element = allGlobalVariables[elementId]
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

        parent.triggers.push(element)
      }
    }

    return {
      json: {
        roots,
        scriptReferences: Object.values(customScripts)
      },
      errors: []
    }
  }
}
