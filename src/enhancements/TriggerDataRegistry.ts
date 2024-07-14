import { readFileSync } from 'fs'
import { LoggerFactory } from '../logging/LoggerFactory'
import { TriggerActions, TriggerCalls, TriggerConditions, TriggerEvents, type VariadicParameterTriggerDefinition } from './data/TriggerDefinition'
import { StatementType } from '../translator/data/statement/StatementType'

const log = LoggerFactory.createLogger('TriggerDataLoader')

enum TriggerDataSections {
  TRIGGER_ACTIONS = 'TriggerActions',
  TRIGGER_EVENTS = 'TriggerEvents',
  TRIGGER_CONDITIONS = 'TriggerConditions',
  TRIGGER_CALLS = 'TriggerCalls'
}

function convertToSectionRowData (section: TriggerDataSections, key: string, value: string): VariadicParameterTriggerDefinition | undefined {
  const values = value.split(',') as [unknown, unknown, unknown, unknown, ...unknown[]]

  switch (section) {
    case TriggerDataSections.TRIGGER_ACTIONS:
      values[0] = Number(values[0])
      return new TriggerActions(key, values as [number, ...string[]])
    case TriggerDataSections.TRIGGER_EVENTS:
      values[0] = Number(values[0])
      return new TriggerEvents(key, values as [number, ...string[]])
    case TriggerDataSections.TRIGGER_CONDITIONS:
      values[0] = Number(values[0])
      return new TriggerConditions(key, values as [number, ...string[]])
    case TriggerDataSections.TRIGGER_CALLS:
      values[0] = Number(values[0])
      values[1] = Number(values[1]) === 1
      return new TriggerCalls(key, values as [number, boolean, string, ...string[]])
  }
}

const registry = new Map<TriggerDataSections, Record<string, number | undefined>>()
let loaded = false

const TriggerDataRegistry = {
  loadTriggerData: function (triggerDataFilePath: string) {
    log.info('Loading trigger data from', triggerDataFilePath)
    const iniData = readFileSync(triggerDataFilePath, { encoding: 'utf8' })

    let currentSection = 'root'
    for (const line of iniData.split(/\r\n|\n/)) {
      if (line.startsWith('//')) continue // ignore comment
      if (/\[.*\]/.test(line)) {
        currentSection = line.substring(1, line.length - 1)
        continue
      }
      if (currentSection !== TriggerDataSections.TRIGGER_ACTIONS && currentSection !== TriggerDataSections.TRIGGER_CALLS &&
        currentSection !== TriggerDataSections.TRIGGER_CONDITIONS && currentSection !== TriggerDataSections.TRIGGER_EVENTS) {
        continue // ignore irrelevant sections
      }
      if (line.startsWith('_')) continue // ignore irrelevant properties
      if (line.includes('=')) {
        const [key, value] = line.split('=')
        const def = convertToSectionRowData(currentSection as TriggerDataSections, key, value)
        const sectionRegistry = registry.get(currentSection as TriggerDataSections)
        if (sectionRegistry == null) {
          registry.set(currentSection as TriggerDataSections, { [key]: def?.getParameterCount() })
        } else {
          sectionRegistry[key] = def?.getParameterCount()
        }
      }
    }
    loaded = true
  },

  getParameterCount: function (classification: StatementType | TriggerDataSections, name: string): number | undefined {
    let sectionRegistry: Record<string, number | undefined> | undefined
    if (!loaded) {
      throw new Error('TriggerData has not been provided, therefore GUI triggers cannot be converted!')
    }
    switch (classification) {
      case StatementType.EVENT:
      case TriggerDataSections.TRIGGER_EVENTS:
        sectionRegistry = registry.get(TriggerDataSections.TRIGGER_EVENTS)
        if (sectionRegistry != null) {
          return sectionRegistry[name]
        }
        break
      case StatementType.CONDITION:
      case TriggerDataSections.TRIGGER_CONDITIONS:
        sectionRegistry = registry.get(TriggerDataSections.TRIGGER_CONDITIONS)
        if (sectionRegistry != null) {
          return sectionRegistry[name]
        }
        break
      case StatementType.ACTION:
      case TriggerDataSections.TRIGGER_ACTIONS:
        sectionRegistry = registry.get(TriggerDataSections.TRIGGER_ACTIONS)
        if (sectionRegistry != null) {
          return sectionRegistry[name]
        }
        break
      case StatementType.CALL:
      case TriggerDataSections.TRIGGER_CALLS:
        sectionRegistry = registry.get(TriggerDataSections.TRIGGER_CALLS)
        if (sectionRegistry != null) {
          return sectionRegistry[name]
        }
        break
    }

    return 0 // TODO: do actual error handling?
  }

}

export { TriggerDataSections, TriggerDataRegistry }
