interface TriggerDefinition {
  getKey: () => string
}

interface VariadicParameterTriggerDefinition {
  getParameterCount: () => number
}

function removeNothings (params: string[]): string[] {
  return params.filter(it => it !== 'nothing')
}

class TriggerCategory implements TriggerDefinition { // Defines categories for organizing trigger functions
  public identifier: string // Key: Arbitrary category identifier
  public displayText: string // Value 0: Display text
  public iconImageFile: string // Value 1: Icon image file
  public disableNameDisplay: boolean // Value 2: Optional flag (defaults to 0) indicating to disable display of category name

  public constructor (identifier: string, ...values: [string, string, boolean]) {
    [this.displayText, this.iconImageFile, this.disableNameDisplay] = values
    this.identifier = identifier
  }

  public getKey (): string {
    return this.identifier
  }
}

class TriggerType implements TriggerDefinition { // Defines all trigger variable types to be used by the Script Editor
  public type: string // Key: type name
  public sinceGameVersion: number // Value 0: first game version in which this type is valid
  public canBeGlobal: boolean // Value 1: flag (0 or 1) indicating if this type can be a global variable
  public canBeCompared: boolean // Value 2: flag (0 or 1) indicating if this type can be used with comparison operators
  public displayText: string // Value 3: string to display in the editor
  public baseType: string // Value 4: base type, used only for custom types
  public importType: string // Value 5: import type, for strings which represent files (optional)
  public isBaseType: boolean // Value 6: flag (0 or 1) indicating to treat this type as the base type in the editor

  public constructor (type: string, ...values: [number, boolean, boolean, string, string, string, boolean]) {
    [this.sinceGameVersion, this.canBeGlobal, this.canBeCompared, this.displayText, this.baseType, this.importType, this.isBaseType] = values
    this.type = type
  }

  public getKey (): string {
    return this.type
  }
}

class TriggerTypeDefaults implements TriggerDefinition { // Defines an optional default value for a trigger type used as a global variable
  public type: string // Key: variable type
  public script: string // Value 0: script text
  public displayText: string // Value 1: display text (if not present, script text will be used)

  // If a type does not have an entry here, it will be set to null if it is a handle

  public constructor (type: string, ...values: [string, string]) {
    [this.script, this.displayText] = values
    this.type = type
  }

  public getKey (): string {
    return this.type
  }
}

class TriggerParams implements TriggerDefinition {// Defines possible values for variable types
  public name: string // Key: arbitrary text
  public sinceGameVersion: number// Value 0: first game version in which this parameter is valid
  public type: string// Value 1: variable type
  public script: string// Value 2: code text (used in script)
  public displayText: string// Value 3: display text

  public constructor (name: string, ...values: [number, string, string, string]) {
    [this.sinceGameVersion, this.type, this.script, this.displayText] = values
    this.name = name
  }

  public getKey (): string {
    return this.name
  }
}

class TriggerEvents implements TriggerDefinition, VariadicParameterTriggerDefinition { // Defines events available in the editor
  public event: string// Key: script event function
  public sinceGameVersion: number// Value 0: first game version in which this function is valid
  public argumentTypes: string[] // Value 1+: argument types
  // Note that the first argument is always a `trigger`, and is excluded here

  public constructor (event: string, values: [number, ...string[]]) {
    [this.sinceGameVersion, ...this.argumentTypes] = values
    this.argumentTypes = removeNothings(this.argumentTypes)
    this.event = event
  }

  public getKey (): string {
    return this.event
  }

  public getParameterCount (): number {
    return this.argumentTypes.length
  }
}

class TriggerConditions implements TriggerDefinition, VariadicParameterTriggerDefinition { // Defines boolean condition functions
  public condition: string// Key: condition function name
  public sinceGameVersion: number// Value 0: first game version in which this function is valid
  public argumentTypes: string[]// Value 1+: argument types

  public constructor (condition: string, values: [number, ...string[]]) {
    [this.sinceGameVersion, ...this.argumentTypes] = values
    this.argumentTypes = removeNothings(this.argumentTypes)
    this.condition = condition
  }

  public getKey (): string {
    return this.condition
  }

  public getParameterCount (): number {
    return this.argumentTypes.length
  }
}

class TriggerActions implements TriggerDefinition, VariadicParameterTriggerDefinition {// Defines action functions
  public action: string// Key: action function name
  public sinceGameVersion: number// Value 0: first game version in which this function is valid
  public argumentTypes: string[]// Value 1+: argument types

  public constructor (action: string, values: [number, ...string[]]) {
    [this.sinceGameVersion, ...this.argumentTypes] = values
    this.argumentTypes = removeNothings(this.argumentTypes)
    this.action = action
  }

  public getKey (): string {
    return this.action
  }

  public getParameterCount (): number {
    return this.argumentTypes.length
  }
}

class TriggerCalls implements TriggerDefinition, VariadicParameterTriggerDefinition {// Defines function calls which may be used as parameter values
  functionName: string// Key: Function name
  sinceGameVersion: number// Value 0: first game version in which this function is valid
  forEvent: boolean // Value 1: flag (0 or 1) indicating if the call can be used in events
  returnType: string // Value 2: return type
  argumentTypes: string[]// Value 3+: argument types
  // Note: Operators are specially handled by the editor

  public constructor (functionName: string, values: [number, boolean, string, ...string[]]) {
    [this.sinceGameVersion, this.forEvent, this.returnType, ...this.argumentTypes] = values
    this.argumentTypes = removeNothings(this.argumentTypes)
    this.functionName = functionName
  }

  public getKey (): string {
    return this.functionName
  }

  public getParameterCount (): number {
    return this.argumentTypes.length
  }
}

export { type TriggerDefinition, type VariadicParameterTriggerDefinition, TriggerActions, TriggerCalls, TriggerCategory, TriggerConditions, TriggerEvents, TriggerParams, TriggerType, TriggerTypeDefaults }
