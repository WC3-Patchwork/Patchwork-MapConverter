interface TriggerContainer {
  name: string
  // isComment: boolean //maybe not required in data structure?
  // isExpanded: boolean // this can definitively be omitted.
  triggers: Array<TriggerContainer | TriggerContent>
}

class TriggerHeader implements TriggerContainer {
  public name: string
  public triggers: TriggerContent[]

  public constructor (data: TriggerContainer) {
    this.name = data.name
    this.triggers = data.triggers != null ? data.triggers : []
  }
}

class TriggerLibrary implements TriggerContainer {
  public name: string
  public triggers: TriggerContent[]

  public constructor (data: TriggerContainer) {
    this.name = data.name
    this.triggers = data.triggers != null ? data.triggers : []
  }
}

class TriggerCategory implements TriggerContainer {
  public name: string
  public triggers: TriggerContent[]

  public constructor (data: TriggerContainer) {
    this.name = data.name
    this.triggers = data.triggers != null ? data.triggers : []
  }
}

interface TriggerContent {
  name: string
  // description: string
  // isComment: boolean // probably ignorable?
  // isEnabled: boolean
  // isCustomScript: boolean // probably ignorable?
  // initiallyOff: boolean
  // runOnMapInit: boolean
}

class GUITrigger implements TriggerContent {
  public name: string
  public description: string
  public isEnabled: boolean
  public initiallyOff: boolean
  public runOnMapInit: boolean
  public events: ECA[]
  public conditions: ECA[]
  public actions: ECA[]

  public constructor (data: TriggerContent & GUITrigger) {
    this.name = data.name
    this.description = data.description
    this.isEnabled = data.isEnabled
    this.initiallyOff = data.initiallyOff
    this.runOnMapInit = data.runOnMapInit
    this.events = data.events != null ? data.events : []
    this.conditions = data.conditions != null ? data.conditions : []
    this.actions = data.actions != null ? data.actions : []
  }
}

class TriggerComment implements TriggerContent {
  public name: string
  public description: string

  public constructor (data: TriggerContent & TriggerComment) {
    this.name = data.name
    this.description = data.description
  }
}

class CustomScript implements TriggerContent {
  public name: string
  public description: string
  public isEnabled: boolean
  public script: string

  public constructor (data: TriggerContent & CustomScript, script?: string) {
    this.name = data.name
    this.description = data.description
    this.isEnabled = data.isEnabled
    this.script = data.script != null ? data.script : script != null ? script : ''
  }
}

class GlobalVariable implements TriggerContent {
  public name: string
  public type: string
  public isArray: boolean
  public arrayLength: number
  public isInitialized: boolean
  public initialValue: string

  public constructor (data: TriggerContent & GlobalVariable) {
    this.name = data.name
    this.type = data.type
    this.isArray = data.isArray
    this.arrayLength = data.arrayLength
    this.isInitialized = data.isInitialized
    this.initialValue = data.initialValue
  }
}

enum Classifier {
  HEADER = 1,
  LIBRARY = 2,
  CATEGORY = 4,
  GUI_TRIGGER = 8,
  COMMENT = 16,
  CUSTOM_SCRIPT = 32,
  VARIABLE = 64
}

interface ECA {
  name: string
  isEnabled: boolean
  nestedAs: NestedECAClassifier | -1 // -1 = not nested.
  children: ECA[]
  parameters: Parameter[]
}

interface FunctionCall {
  name: string
  parameters: Parameter[]
}

enum ECA_Classifier {
  EVENT = 0,
  CONDITION = 1,
  ACTION = 2,
  CALL = 3 // questionable
}

enum NestedECAClassifier {
  CONDITION = 0,
  THEN_ACTION = 1,
  ELSE_ACTION = 2,
  LOOP_ACTION = 1, // I assume
}

interface Parameter {
  type: ParameterType
  value: string
  nestedParams: Parameter[]
  arrayIndex: number | undefined
}
enum ParameterType {
  NOTHING = 0,
  PRESET = 1,
  VARIABLE = 1,
  FUNCTION = 2,
  STRING = 3
}

interface TriggerTranslatorOutput {
  roots: TriggerContainer[]
  scriptReferences: CustomScript[]
}

export {
  type TriggerContainer,
  TriggerHeader,
  TriggerCategory,
  TriggerLibrary,
  type TriggerContent,
  GUITrigger,
  TriggerComment,
  CustomScript,
  GlobalVariable,
  type ECA,
  type FunctionCall,
  type Parameter,
  ParameterType,
  Classifier,
  ECA_Classifier,
  NestedECAClassifier,
  type TriggerTranslatorOutput
}
