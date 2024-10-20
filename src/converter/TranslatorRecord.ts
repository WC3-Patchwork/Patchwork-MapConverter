import { TriggersTranslator } from '../translator/TriggerTranslator'
import { CustomScriptsTranslator } from '../translator/CustomScriptsTranslator'
import { type Translator, TerrainTranslator, UnitsTranslator, DoodadsTranslator, RegionsTranslator, CamerasTranslator, SoundsTranslator, ObjectsTranslator, StringsTranslator, InfoTranslator, ImportsTranslator } from '../wc3maptranslator/translators'
import { ObjectType } from '../wc3maptranslator/data/ObjectModificationTable'

export const translatorRecord: Record<string, Translator<unknown>> = {
  // World files
  '.w3e': TerrainTranslator.getInstance() as Translator<unknown>,
  'Units.doo': UnitsTranslator.getInstance() as Translator<unknown>,
  '.doo': DoodadsTranslator.getInstance() as Translator<unknown>,
  '.w3r': RegionsTranslator.getInstance() as Translator<unknown>,
  '.w3c': CamerasTranslator.getInstance() as Translator<unknown>,
  '.w3s': SoundsTranslator.getInstance() as Translator<unknown>,

  // Object data files
  '.w3u': ObjectsTranslator.getInstance(ObjectType.Units) as Translator<unknown>,
  '.w3t': ObjectsTranslator.getInstance(ObjectType.Items) as Translator<unknown>,
  '.w3a': ObjectsTranslator.getInstance(ObjectType.Abilities) as Translator<unknown>,
  '.w3b': ObjectsTranslator.getInstance(ObjectType.Destructables) as Translator<unknown>,
  '.w3d': ObjectsTranslator.getInstance(ObjectType.Doodads) as Translator<unknown>,
  '.w3q': ObjectsTranslator.getInstance(ObjectType.Upgrades) as Translator<unknown>,
  '.w3h': ObjectsTranslator.getInstance(ObjectType.Buffs) as Translator<unknown>,

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

export function SupplementTranslatorRecord(mapDataExtension: string) {
  // World files
  translatorRecord[`.w3e${mapDataExtension}`] = TerrainTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`Units.doo${mapDataExtension}`] = UnitsTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`.doo${mapDataExtension}`] = DoodadsTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`.w3r${mapDataExtension}`] = RegionsTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`.w3c${mapDataExtension}`] = CamerasTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`.w3s${mapDataExtension}`] = SoundsTranslator.getInstance() as Translator<unknown>;

  // Object data files
  translatorRecord[`.w3u${mapDataExtension}`] = ObjectsTranslator.getInstance(ObjectType.Units) as Translator<unknown>;
  translatorRecord[`.w3t${mapDataExtension}`] = ObjectsTranslator.getInstance(ObjectType.Items) as Translator<unknown>;
  translatorRecord[`.w3a${mapDataExtension}`] = ObjectsTranslator.getInstance(ObjectType.Abilities) as Translator<unknown>;
  translatorRecord[`.w3b${mapDataExtension}`] = ObjectsTranslator.getInstance(ObjectType.Destructables) as Translator<unknown>;
  translatorRecord[`.w3d${mapDataExtension}`] = ObjectsTranslator.getInstance(ObjectType.Doodads) as Translator<unknown>;
  translatorRecord[`.w3q${mapDataExtension}`] = ObjectsTranslator.getInstance(ObjectType.Upgrades) as Translator<unknown>;
  translatorRecord[`.w3h${mapDataExtension}`] = ObjectsTranslator.getInstance(ObjectType.Buffs) as Translator<unknown>;

  // Trigger files
  // '.lua': IGNORED
  // '.j': IGNORED
  translatorRecord[`.wts${mapDataExtension}`] = StringsTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`.wtg${mapDataExtension}`] = TriggersTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`.wct${mapDataExtension}`] = CustomScriptsTranslator.getInstance() as Translator<unknown>;

  // Map files
  translatorRecord[`.w3i${mapDataExtension}`] = InfoTranslator.getInstance() as Translator<unknown>;
  translatorRecord[`.imp${mapDataExtension}`] = ImportsTranslator.getInstance() as Translator<unknown>;
  // '.wpm': IGNORED
  // '.shd': IGNORED
}