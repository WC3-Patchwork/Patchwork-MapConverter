import {
  type Translator,
  Data,
  CamerasTranslator,
  DoodadsTranslator,
  ImportsTranslator,
  InfoTranslator,
  ObjectsTranslator,
  RegionsTranslator,
  SoundsTranslator,
  StringsTranslator,
  TerrainTranslator,
  UnitsTranslator
} from 'wc3maptranslator'
import { TriggersTranslator } from '../translator/TriggerTranslator'
import { CustomScriptsTranslator } from '../translator/CustomScriptsTranslator'

export const translatorRecord: Record<string, Translator<unknown>> = {
  // World files
  '.w3e': TerrainTranslator.getInstance() as Translator<unknown>,
  'Units.doo': UnitsTranslator.getInstance() as Translator<unknown>,
  '.doo': DoodadsTranslator.getInstance() as Translator<unknown>,
  '.w3r': RegionsTranslator.getInstance() as Translator<unknown>,
  '.w3c': CamerasTranslator.getInstance() as Translator<unknown>,
  '.w3s': SoundsTranslator.getInstance() as Translator<unknown>,

  // Object data files
  '.w3u': ObjectsTranslator.getInstance(Data.ObjectType.Units) as Translator<unknown>,
  '.w3t': ObjectsTranslator.getInstance(Data.ObjectType.Items) as Translator<unknown>,
  '.w3a': ObjectsTranslator.getInstance(Data.ObjectType.Abilities) as Translator<unknown>,
  '.w3b': ObjectsTranslator.getInstance(Data.ObjectType.Destructables) as Translator<unknown>,
  '.w3d': ObjectsTranslator.getInstance(Data.ObjectType.Doodads) as Translator<unknown>,
  '.w3q': ObjectsTranslator.getInstance(Data.ObjectType.Upgrades) as Translator<unknown>,
  '.w3h': ObjectsTranslator.getInstance(Data.ObjectType.Buffs) as Translator<unknown>,

  // Trigger files
  // '.lua': IGNORED
  // '.j': IGNORED
  '.wts': StringsTranslator.getInstance() as Translator<unknown>,
  '.wtg': TriggersTranslator.getInstance() as Translator<unknown>,
  '.wct': CustomScriptsTranslator.getInstance() as Translator<unknown>,

  // Map files
  '.w3i': InfoTranslator.getInstance() as Translator<unknown>,
  '.imp': ImportsTranslator.getInstance() as Translator<unknown>
  // '.wpm': IGNORED
  // '.shd': IGNORED
}
