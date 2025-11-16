/* eslint-disable @typescript-eslint/brace-style */
import { TerrainTranslator, UnitsTranslator, DoodadsTranslator, RegionsTranslator, CamerasTranslator, SoundsTranslator, ObjectsTranslator, StringsTranslator, InfoTranslator, AssetsTranslator } from '../wc3maptranslator/translators'
import { type ObjectModificationTable, ObjectType } from '../wc3maptranslator/data/ObjectModificationTable'
import { type Terrain, type Unit, type Asset, type Info, type Doodad, type SpecialDoodad, type Region, type Camera, type Sound } from '../wc3maptranslator/data'
import { CustomScriptsTranslator, TriggersTranslator } from '../translator'
import { type TriggerTranslatorOutput } from '../translator/TriggersTranslator'
import { type TargetProfile } from './Profile'
import { type integer } from '../wc3maptranslator/CommonInterfaces'

function FindAppropriateTranslationMethodText2Binary (filename: string, profile: TargetProfile): ((json: object) => Buffer) | null {
// World files
  if (filename.endsWith('.w3e')) {
    return (terrain) => TerrainTranslator.jsonToWar(terrain as unknown as Terrain, profile.w3eFormatVersion)
  } else if (filename.endsWith('Units.doo')) {
    return (units) => UnitsTranslator.jsonToWar(units as unknown as Unit[], profile.unitsDooFormatVersion, profile.unitsDooFormatSubversion, profile.editorVersion)
  } else if (filename.endsWith('.doo')) {
    return (doodads) => DoodadsTranslator.jsonToWar(doodads as unknown as [Doodad[], SpecialDoodad[]], profile.dooFormatVersion, profile.dooFormatSubversion, profile.specialDooFormatSubversion, profile.editorVersion)
  } else if (filename.endsWith('.w3r')) {
    return (regions) => RegionsTranslator.jsonToWar(regions as unknown as Region[], profile.w3rFormatVersion)
  } else if (filename.endsWith('.w3c')) {
    return (cameras) => CamerasTranslator.jsonToWar(cameras as unknown as Camera[], profile.w3cFormatVersion, profile.editorVersion)
  } else if (filename.endsWith('.w3s')) {
    return (sounds) => SoundsTranslator.jsonToWar(sounds as unknown as Sound[], profile.w3sFormatVersion)
  }

  // Object data files
  else if (filename.endsWith('.w3u')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Units, profile.objectFormatVersion)
  } else if (filename.endsWith('.w3t')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Items, profile.objectFormatVersion)
  } else if (filename.endsWith('.w3a')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Abilities, profile.objectFormatVersion)
  } else if (filename.endsWith('.w3b')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Destructables, profile.objectFormatVersion)
  } else if (filename.endsWith('.w3d')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Doodads, profile.objectFormatVersion)
  } else if (filename.endsWith('.w3q')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Upgrades, profile.objectFormatVersion)
  } else if (filename.endsWith('.w3h')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Buffs, profile.objectFormatVersion)
  } else if (filename.endsWith('.w3u')) {
    return (objects) => ObjectsTranslator.jsonToWar(objects as unknown as ObjectModificationTable, ObjectType.Units, profile.objectFormatVersion)
  }

  // Trigger files
  // '.lua': IGNORED
  // '.j': IGNORED
  else if (filename.endsWith('.wts')) {
    return StringsTranslator.jsonToWar as unknown as ((json: object) => Buffer)
  } else if (filename.endsWith('.wtg')) {
    return (triggers) => TriggersTranslator.jsonToWar(triggers as unknown as TriggerTranslatorOutput, profile.wtgFormatVersion, profile.wtgFormatSubversion)
  } else if (filename.endsWith('.wct')) {
    return (scripts) => CustomScriptsTranslator.jsonToWar(scripts as unknown as { headerComment: string, scripts: string[] }, profile.wctFormatVersion)
  }

  // Map files
  else if (filename.endsWith('.w3i')) {
    return (info) => InfoTranslator.jsonToWar(info as unknown as Info, profile.w3iFormatVersion)
  } else if (filename.endsWith('.imp')) {
    return (assets) => AssetsTranslator.jsonToWar(assets as unknown as Asset[], profile.impFormatVersion)
  }
  // '.wpm': IGNORED
  // '.shd': IGNORED

  return null
}

function FindAppropriateTranslationMethodBinary2Text (filename: string, editorVersionSupplier: Promise<integer>): ((buffer: Buffer) => unknown) | null {
  // World files
  if (filename.endsWith('.w3e')) {
    return TerrainTranslator.warToJson
  } else if (filename.endsWith('Units.doo')) {
    return async (buffer) => UnitsTranslator.warToJson(buffer, await editorVersionSupplier)
  } else if (filename.endsWith('.doo')) {
    return async (buffer) => DoodadsTranslator.warToJson(buffer, await editorVersionSupplier)
  } else if (filename.endsWith('.w3r')) {
    return RegionsTranslator.warToJson
  } else if (filename.endsWith('.w3c')) {
    return async (buffer) => CamerasTranslator.warToJson(buffer, await editorVersionSupplier)
  } else if (filename.endsWith('.w3s')) {
    return SoundsTranslator.warToJson
  }

  // Object data files
  else if (filename.endsWith('.w3u')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Units)
  } else if (filename.endsWith('.w3t')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Items)
  } else if (filename.endsWith('.w3a')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Abilities)
  } else if (filename.endsWith('.w3b')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Destructables)
  } else if (filename.endsWith('.w3d')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Doodads)
  } else if (filename.endsWith('.w3q')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Upgrades)
  } else if (filename.endsWith('.w3h')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Buffs)
  } else if (filename.endsWith('.w3u')) {
    return (buffer) => ObjectsTranslator.warToJson(buffer, ObjectType.Units)
  }

  // Trigger files
  // '.lua': IGNORED
  // '.j': IGNORED
  else if (filename.endsWith('.wts')) {
    return StringsTranslator.warToJson
  } else if (filename.endsWith('.wtg')) {
    return TriggersTranslator.warToJson
  } else if (filename.endsWith('.wct')) {
    return CustomScriptsTranslator.warToJson
  }

  // Map files
  else if (filename.endsWith('.w3i')) {
    return InfoTranslator.warToJson
  } else if (filename.endsWith('.imp')) {
    return AssetsTranslator.warToJson
  }
  // '.wpm': IGNORED
  // '.shd': IGNORED

  return null
}

const TranslatorManager = { FindAppropriateTranslationMethodBinary2Text, FindAppropriateTranslationMethodText2Binary }
export { TranslatorManager }
