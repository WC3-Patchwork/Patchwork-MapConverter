import { Service } from 'typedi'
import { type JsonToBinaryConverter } from '../JsonToBinaryConverter'
import { type TriggerContainer } from '../../data/editor/trigger/TriggerContainer'
import { type ScriptContent } from '../../data/editor/trigger/properties/ScriptContent'
import { type HexBuffer } from '../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../BinaryTranslationResult'
import { type CustomScript } from '../../data/editor/trigger/content/CustomScript'
import { type GUITrigger } from '../../data/editor/trigger/content/GUITrigger'
import { type GlobalVariable } from '../../data/editor/trigger/content/GlobalVariable'
import { type TriggerComment } from '../../data/editor/trigger/content/TriggerComment'
import { ContentType, type TriggerContent } from '../../data/editor/trigger/content/TriggerContent'
import { type ArrayVariableParameter } from '../../data/editor/trigger/parameter/ArrayVariableParameter'
import { type FunctionCall } from '../../data/editor/trigger/parameter/FunctionCall'
import { ParameterType } from '../../data/editor/trigger/parameter/ParameterType'
import { type PresetParameter } from '../../data/editor/trigger/parameter/PresetParameter'
import { type NestingStatement } from '../../data/editor/trigger/statement/NestingStatement'
import { type Statement } from '../../data/editor/trigger/statement/Statement'
import { StatementType } from '../../data/editor/trigger/statement/StatementType'
import { ContentTypeEnumConverter } from '../util/ContentTypeEnumConverter'
import { ParameterTypeEnumConverter } from '../util/ParameterTypeEnumConverter'
import { StatementTypeEnumConverter } from '../util/StatementTypeEnumConverter'
import { type Parameter } from '../../data/editor/trigger/parameter/Parameter'
import { type VariableParameter } from '../../data/editor/trigger/parameter/VariableParameter'
import { type LiteralParameter } from '../../data/editor/trigger/parameter/LiteralParameter'

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

@Service()
export class TriggerBinaryAssembler implements JsonToBinaryConverter<{
  roots: TriggerContainer[]
  scriptReferences: Array<ScriptContent | null>
}> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length >= 3 && metadata[0] === 'WTG!' && metadata[1] === 0x04000080 && metadata[2] === 7
  }

  public translate (outBufferToWar: HexBuffer, data: { roots: TriggerContainer[], scriptReferences: Array<ScriptContent | null> }, ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors: Error[] = []
    const warnings: Error[] = []

    outBufferToWar.addChars('WTG!') // File header
    outBufferToWar.addByte(0x04)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x00)
    outBufferToWar.addByte(0x80) // Format version
    outBufferToWar.addInt(7) // TFT Game Version

    const contentTypeCounts = countContentTypes(data.roots)
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

    const triggerStack: TriggerContent[] = [...data.roots]

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

    const variables = getAllOfContentType(data.roots, elementReference, ContentType.VARIABLE) as Map<GlobalVariable, number>
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

    triggerStack.push(...data.roots)
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

            const writeStatements = (parent: GUITrigger | Statement, ECAs: Statement[], statementType: StatementType, group: number): void => {
              for (const eca of ECAs) {
                outBufferToWar.addInt(StatementTypeEnumConverter.toIdentifier(statementType))

                if (group !== -1) {
                  outBufferToWar.addInt(group)
                }

                outBufferToWar.addString(eca.name)
                outBufferToWar.addInt(eca.isEnabled ? 1 : 0)
                const writeParams = (parameters: Parameter[]): void => {
                  for (const param of parameters) {
                    outBufferToWar.addInt(ParameterTypeEnumConverter.toIdentifier(param.type))

                    switch (param.type) {
                      case ParameterType.INVALID:
                        continue // skip invalid param.
                        break
                      case ParameterType.PRESET:
                        outBufferToWar.addString((param as PresetParameter).presetName)
                        outBufferToWar.addInt(0) // no sub params
                        outBufferToWar.addInt(0) // is not array
                        break
                      case ParameterType.VARIABLE:
                        outBufferToWar.addString((param as VariableParameter).value)
                        outBufferToWar.addInt(0) // no sub params
                        if ((param as ArrayVariableParameter).arrayIndex != null) {
                          outBufferToWar.addInt(1) // is array
                          writeParams([(param as ArrayVariableParameter).arrayIndex])
                        } else {
                          outBufferToWar.addInt(0) // is not array
                        }
                        break
                      case ParameterType.FUNCTION:
                        outBufferToWar.addString((param as FunctionCall).name)
                        outBufferToWar.addInt(1) // has sub params
                        outBufferToWar.addInt(StatementTypeEnumConverter.toIdentifier((param as FunctionCall).statementType))
                        outBufferToWar.addString((param as FunctionCall).statement.name)
                        outBufferToWar.addInt(1) // begin function
                        writeParams((param as FunctionCall).statement.parameters)
                        outBufferToWar.addInt(0) // unknown, end function maybe?
                        outBufferToWar.addInt(0) // is not array
                        break
                      case ParameterType.VALUE:
                        outBufferToWar.addString((param as LiteralParameter).value)
                        outBufferToWar.addInt(0) // no sub params
                        outBufferToWar.addInt(0) // is not array
                        break
                    }
                  }
                }

                writeParams(eca.parameters)
                if ((eca as NestingStatement).statements != null) {
                  const nestingStatement = (eca as NestingStatement)
                  let ecaCount = 0
                  for (const typedStatements of nestingStatement.statements) {
                    if (typedStatements != null) {
                      ecaCount += typedStatements.statements.length
                    }
                  }

                  outBufferToWar.addInt(ecaCount)
                  for (let group = 0; group < nestingStatement.statements.length; group++) {
                    if (nestingStatement.statements[group] != null) {
                      writeStatements(eca, nestingStatement.statements[group].statements, nestingStatement.statements[group].type, group)
                    }
                  }
                } else {
                  outBufferToWar.addInt(0) // ecaCount
                }
              }
            }
            writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).actions, StatementType.ACTION, -1)
            writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).events, StatementType.EVENT, -1)
            writeStatements(currentTrigger as GUITrigger, (currentTrigger as GUITrigger).conditions, StatementType.CONDITION, -1)
          }
          break

        case ContentType.VARIABLE:
          outBufferToWar.addInt(elementId)
          outBufferToWar.addString((currentTrigger as GlobalVariable).name)
          outBufferToWar.addInt(parentId)
          break
      }
    }

    return { errors, warnings }
  }
}
