import path from 'path'
import { LoggerFactory } from '../logging/LoggerFactory'
import { GetTriggerContainerChildren, type TriggerContainer } from '../translator/data/TriggerContainer'
import EnhancementManager from './EnhancementManager'
import TreeIterator from '../util/TreeIterator'
import { ContentType, type TriggerContent } from '../translator/data/content/TriggerContent'
import { type MapHeader } from '../translator/data/MapHeader'
import { type ScriptContent } from '../translator/data/properties/ScriptContent'
import { type GlobalVariable } from '../translator/data/content/GlobalVariable'
import { type TriggerComment } from '../translator/data/content/TriggerComment'
import * as ini from 'ini'
import { type GUITrigger } from '../translator/data/content/GUITrigger'
import { WriteAndCreatePath } from '../util/WriteAndCreatePath'
import type directoryTree from 'directory-tree'
import { type DirectoryTree } from 'directory-tree'
import { readFile } from 'fs/promises'
import { type CustomScript } from '../translator/data/content/CustomScript'

const log = LoggerFactory.createLogger('TriggerComposer')

async function populateComment (element: TriggerComment, child: DirectoryTree): Promise<void> {
  element.comment = await readFile(child.path, 'utf8')
}

// handles both GUI trigger and Variable
async function populateGUIContent (element: TriggerContent, child: DirectoryTree): Promise<void> {
  const trigger: unknown = JSON.parse(await readFile(child.path, 'utf8'))
  for (const [key, value] of Object.entries(trigger as JSON)) {
    if (key === 'children') continue
    if (value == null || value === '') continue
    element[key] = value as unknown
  }
}

async function populateCustomScript (element: CustomScript, child: DirectoryTree): Promise<void> {
  element.script = await readFile(child.path, 'utf8')
  element.isEnabled = true
}

async function populateParentDetails (parent: TriggerContainer, file: DirectoryTree): Promise<void> {
  const record = ini.parse(await readFile(file.path, 'utf8'))
  for (const [key, value] of Object.entries(record)) {
    if (key === 'children') continue // ignore children entry, that one is handled internally (shouldn't exist anyways)
    parent[key] = value as unknown
  }
}

function generateTriggerOrder (parent: TriggerContainer): string[] {
  return parent.children.map(it => it.name)
}

type OrderedTriggerContainer = TriggerContainer & { order: string[] }
function sortTriggerContent (root: OrderedTriggerContainer): void {
  let newChildrenOrder = new Array(root.order != null ? root.order.length : 0) as TriggerContent[]
  const unspecifiedChildren: TriggerContent[] = []
  const containerChildrenRecord = Object.values(root.children).reduce((ret, value) => {
    ret[value.name] = value
    return ret
  }, {}) as Record<string, TriggerContent>
  if (root.order == null) root.order = []
  const orderedContentRecord = Object.entries(root.order).reduce((ret, entry) => {
    const [key, value] = entry
    ret[value] = key
    return ret
  }, {}) as Record<string, number>
  for (const [name, content] of Object.entries(containerChildrenRecord)) {
    const desiredIndex = orderedContentRecord[name]
    if (desiredIndex == null) {
      unspecifiedChildren.push(content)
    } else {
      newChildrenOrder[desiredIndex] = content
    }
  }

  newChildrenOrder = newChildrenOrder.filter(it => it != null)
  newChildrenOrder.push(...unspecifiedChildren)
  root.children = newChildrenOrder

  for (const child of root.children) {
    if ((child as TriggerContainer).children != null) {
      sortTriggerContent(child as OrderedTriggerContainer)
    }
  }
}

const TriggerComposer = {
  composeTriggerJson: async function (input: DirectoryTree): Promise<TriggerContainer> {
    const tasks: Array<Promise<unknown>> = []
    const result = {
      name: EnhancementManager.mapHeaderFilename,
      contentType: ContentType.HEADER,
      isExpanded: false,
      children: [],
      description: '',
      script: ''
    } satisfies MapHeader

    const parentMap = new Map<DirectoryTree, TriggerContainer>()
    parentMap.set(input, result)

    if (input.children == null) {
      return result
    }

    for (const [parents, file] of TreeIterator<DirectoryTree>(input,
      (parent: directoryTree.DirectoryTree<Record<string, string>>) => parent.children)) {
      let parent = parents.pop()
      if (parent == null) {
        parent = input
      }
      const containerParent = parentMap.get(parent)
      if (containerParent == null) {
        throw new Error('Something went wrong 2')
      }

      if (file.type === 'directory' && file !== input) {
        const container = {
          name: file.name,
          contentType: ContentType.CATEGORY,
          isExpanded: false,
          children: []
        } satisfies TriggerContainer
        parentMap.set(file, container)
        containerParent.children.push(container)
      } else if (file.type === 'file') {
        if (file.extension === EnhancementManager.containerInfoExtension) {
          tasks.push(populateParentDetails(containerParent, file))
        } else if (file.extension === EnhancementManager.guiExtension) {
          const element = {
            name: file.name,
            contentType: ContentType.TRIGGER,
            actions: [],
            arrayLength: 0,
            conditions: [],
            description: '',
            events: [],
            initiallyOff: false,
            initialValue: '',
            isArray: false,
            isEnabled: true,
            isInitialized: false,
            runOnMapInit: true,
            type: ''
          } satisfies GUITrigger | GlobalVariable
          containerParent.children.push(element)
          tasks.push(populateGUIContent(element, file))
        } else if (file.extension === EnhancementManager.scriptExtension) {
          const element = {
            name: file.name.substring(0, file.name.indexOf('.')),
            contentType: ContentType.CUSTOM_SCRIPT,
            script: '',
            description: '',
            isEnabled: true
          } satisfies CustomScript
          if (file.name.endsWith(`${EnhancementManager.mapHeaderFilename}${EnhancementManager.scriptExtension}`)) {
            tasks.push(populateCustomScript(result as unknown as CustomScript, file))
          } else {
            containerParent.children.push(element)
            tasks.push(populateCustomScript(element, file))
          }
        } else if (file.extension === EnhancementManager.commentExtension) {
          const element = {
            name: file.name.substring(0, file.name.indexOf('.')),
            contentType: ContentType.COMMENT,
            comment: ''
          } satisfies TriggerComment
          containerParent.children.push(element)
          tasks.push(populateComment(element, file))
        }
      }
    }

    for (const file of input.children) {
      if (file.type === 'file') {
        if (file.extension === EnhancementManager.containerInfoExtension) {
          tasks.push(populateParentDetails(result, file))
        }
      }
    }

    await Promise.all(tasks)
    sortTriggerContent(result as unknown as OrderedTriggerContainer)
    return result
  },

  explodeTriggersJsonIntoSource: async function (output: string, triggersJson: TriggerContainer): Promise<void> {
    const sourceOutput = path.join(output, EnhancementManager.sourceFolder)
    log.info('Exploding triggers.json into a source code tree at', sourceOutput)

    triggersJson.name = '' // Delete header name

    const tasks: Array<Promise<unknown>> = []
    for (const [parents, content] of TreeIterator<TriggerContent>(triggersJson, GetTriggerContainerChildren)) {
      const outPath = path.join(sourceOutput, ...parents.map(it => it.name))
      const exportObj: Record<string, unknown> = {
        contentType: content.contentType
      }
      switch (content.contentType) {
        case ContentType.HEADER:
          exportObj.description = (content as MapHeader).description
          tasks.push(WriteAndCreatePath(path.join(outPath, `${EnhancementManager.mapHeaderFilename}${EnhancementManager.scriptExtension}`), (content as ScriptContent).script, 'utf8'))
          exportObj.isExpanded = (content as TriggerContainer).isExpanded
          exportObj.order = generateTriggerOrder(content as TriggerContainer)
          tasks.push(WriteAndCreatePath(path.join(outPath, `${EnhancementManager.mapHeaderFilename}${EnhancementManager.containerInfoExtension}`), ini.encode(exportObj), 'utf8'))
          break
        case ContentType.LIBRARY:
        case ContentType.CATEGORY:
          exportObj.isExpanded = (content as TriggerContainer).isExpanded
          exportObj.order = generateTriggerOrder(content as TriggerContainer)
          tasks.push(WriteAndCreatePath(path.join(outPath, content.name, `${content.name}${EnhancementManager.containerInfoExtension}`), ini.encode(exportObj), 'utf8'))
          break
        case ContentType.TRIGGER:
          exportObj.runOnMapInit = (content as GUITrigger).runOnMapInit
          exportObj.initiallyOff = (content as GUITrigger).initiallyOff
          exportObj.isEnabled = (content as GUITrigger).isEnabled
          exportObj.description = (content as GUITrigger).description
          exportObj.events = (content as GUITrigger).events
          exportObj.conditions = (content as GUITrigger).conditions
          exportObj.actions = (content as GUITrigger).actions
          tasks.push(WriteAndCreatePath(path.join(outPath, `${content.name}${EnhancementManager.guiExtension}`), JSON.stringify(content), 'utf8'))
          break
        case ContentType.COMMENT:
          tasks.push(WriteAndCreatePath(path.join(outPath, `${content.name}${EnhancementManager.commentExtension}`), (content as TriggerComment).comment, 'utf8'))
          break
        case ContentType.CUSTOM_SCRIPT:
          tasks.push(WriteAndCreatePath(path.join(outPath, `${content.name}${EnhancementManager.scriptExtension}`), (content as ScriptContent).script, 'utf8'))
          break
        case ContentType.VARIABLE:
          exportObj.type = (content as GlobalVariable).type
          exportObj.isInitialized = (content as GlobalVariable).isInitialized
          exportObj.initialValue = (content as GlobalVariable).initialValue
          exportObj.isArray = (content as GlobalVariable).isArray
          exportObj.arrayLength = (content as GlobalVariable).arrayLength
          tasks.push(WriteAndCreatePath(path.join(outPath, `${content.name}${EnhancementManager.guiExtension}`), JSON.stringify(content), 'utf8'))
          break
      }
    }
    await Promise.all(tasks)
  }
}

export { TriggerComposer }
