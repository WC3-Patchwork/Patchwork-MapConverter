import * as CustomScriptsTranslator from './CustomScriptsTranslator'
import * as TriggersTranslator from './TriggersTranslator'
import { type TriggerContainer } from './data/TriggerContainer'
import { type MapHeader } from './data/MapHeader'
import { type CustomScript } from './data/content/CustomScript'
import { type GlobalVariable } from './data/content/GlobalVariable'
import { type GUITrigger } from './data/content/GUITrigger'
import { type ScriptedTrigger } from './data/content/ScriptedTrigger'
import { type TriggerComment } from './data/content/TriggerComment'
import { type TriggerContent } from './data/content/TriggerContent'
import { type Parameter } from './data/parameter/Parameter'
import { type ParameterType } from './data/parameter/ParameterType'
import { type Describable } from './data/properties/Describable'
import { type Enableable } from './data/properties/Enableable'
import { type ScriptContent } from './data/properties/ScriptContent'
import { type Statement } from './data/statement/Statement'
import { type StatementType } from './data/statement/StatementType'
import { ContentTypeEnumConverter } from './util/ContentTypeEnumConverter'
import { ParameterTypeEnumConverter } from './util/ParameterTypeEnumConverter'
import { StatementTypeEnumConverter } from './util/StatementTypeEnumConverter'

const translators = { CustomScriptsTranslator, TriggersTranslator }
export { translators, ContentTypeEnumConverter, ParameterTypeEnumConverter, StatementTypeEnumConverter }
export type { TriggerContainer,MapHeader,CustomScript,GlobalVariable,GUITrigger,ScriptContent,ScriptedTrigger,TriggerComment,TriggerContent, Parameter,ParameterType,Describable,Enableable,Statement,StatementType }