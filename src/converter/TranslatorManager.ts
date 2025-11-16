import { TerrainTranslator, UnitsTranslator, DoodadsTranslator, RegionsTranslator, CamerasTranslator, SoundsTranslator, ObjectsTranslator, StringsTranslator, InfoTranslator, AssetsTranslator } from '../wc3maptranslator/translators'
import { type ObjectModificationTable, ObjectType } from '../wc3maptranslator/data/ObjectModificationTable'
import { type Terrain, type Unit, type Asset, type Info, type Doodad, type SpecialDoodad, type Region, type Camera, type Sound } from '../wc3maptranslator/data'
import { type TriggerTranslatorOutput } from '../translator/TriggersTranslator'
import { translators } from '../translator'
import { type TargetProfile } from './Profile'
import { DoodadsTranslatorOutput } from '../wc3maptranslator/translators/DoodadsTranslator'

const TranslatorManager = {
  FindAppropriateTranslationMethodText2Binary: function (filename: string, profile: TargetProfile): ((json: object) => Buffer) | null {
    // World files
    if (filename.endsWith('.w3e')) {
      return (terrain) => TerrainTranslator.jsonToWar(terrain as unknown as Terrain, profile.w3eFormatVersion)
    } else if (filename.endsWith('Units.doo')) {
      return (units) => UnitsTranslator.jsonToWar(units as unknown as Unit[], profile.unitsDooFormatVersion, profile.unitsDooFormatSubversion, profile.editorVersion)
    } else if (filename.endsWith('.doo')) {
      return (doodads) => DoodadsTranslator.jsonToWar(doodads as unknown as DoodadsTranslatorOutput, profile.dooFormatVersion, profile.dooFormatSubversion, profile.specialDooFormatVersion, profile.editorVersion)
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
    }

    // Trigger files
    // '.lua': IGNORED
    // '.j': IGNORED
    else if (filename.endsWith('.wts')) {
      return StringsTranslator.jsonToWar as unknown as ((json: object) => Buffer)
    } else if (filename.endsWith('.wtg')) {
      return (triggers) => translators.TriggersTranslator.jsonToWar(triggers as unknown as TriggerTranslatorOutput, profile.wtgFormatVersion, profile.wtgFormatSubversion)
    } else if (filename.endsWith('.wct')) {
      return (scripts) => translators.CustomScriptsTranslator.jsonToWar(scripts as unknown as { headerComment: string, scripts: string[] }, profile.wctFormatVersion)
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
}
export { TranslatorManager }
