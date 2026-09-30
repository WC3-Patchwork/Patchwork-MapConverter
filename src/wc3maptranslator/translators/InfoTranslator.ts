import { LoggerFactory } from '../../logging/LoggerFactory'
import { color, type integer } from '../CommonInterfaces'
import { HexBuffer } from '../HexBuffer'
import { mergeBoolRecords, colorBytesToHex, colorHexToBytes } from '../Util'
import { W3Buffer } from '../W3Buffer'
import { type ObjectChance, type Force, type Info, type Player, type RandomGroup, type RandomGroupSet, type TechUnavailable, type UpgradeAvailable, type PlayerList, ScriptLanguage, ResearchState, PlayerType, Race, FogType, type ItemTable, RandomGroupObjectType, RaceCrest } from '../data/Info'
import { ForceDefaults, InfoDefaults, PlayerDefaults, RandomGroupDefaults, UpgradeAvailableDefaults } from '../default/Info'

const log = LoggerFactory.createLogger('InfoTranslator')

function playerBitmapToPlayerList(playerBitmap: integer): PlayerList {
  const playerList: integer[] = []
  for (let i = 0; i < 24; i++) {
    playerList.push(playerBitmap & (1 << i))
  }
  return playerList
}

function playerListToPlayerBitmap(playerList: PlayerList): integer {
  return playerList.map(it => 1 << it).reduce((acc, it) => acc | it)
}

export function jsonToWar(infoJson: Info, formatVersion: number): Buffer {
  if (formatVersion < 0 || formatVersion > 39) {
    throw new Error(`Unknown map info format version=${formatVersion}, expected value from range [0, 39]`)
  }

  const output = new HexBuffer()
  output.addInt(formatVersion)
  if (formatVersion >= 16) {
    output.addInt(infoJson.mapVersion ?? InfoDefaults.mapVersion)
    output.addInt(infoJson.editorVersion ?? InfoDefaults.editorVersion)
  }

  if (formatVersion >= 27) {
    output.addInt(infoJson.gameVersion?.major ?? InfoDefaults.gameVersion.major)
    output.addInt(infoJson.gameVersion?.minor ?? InfoDefaults.gameVersion.minor)
    output.addInt(infoJson.gameVersion?.patch ?? InfoDefaults.gameVersion.patch)
    output.addInt(infoJson.gameVersion?.build ?? InfoDefaults.gameVersion.build)
  }

  output.addString(infoJson.map?.name ?? InfoDefaults.map.name)
  output.addString(infoJson.map?.author ?? InfoDefaults.map.author)
  output.addString(infoJson.map?.description ?? InfoDefaults.map.description)

  if (formatVersion >= 8) {
    output.addString(infoJson.map?.recommendedPlayers ?? InfoDefaults.map.recommendedPlayers)
  }

  // Pad with some mystery bytes
  if (formatVersion < 4) {
    output.addByte(0)
    output.addFloat(0)
  } else if (formatVersion < 9) {
    output.addFloat(0)
    output.addByte(0)
    output.addFloat(0)
    output.addFloat(0)
    output.addFloat(0)
    output.addInt(0)
  }

  const cameraBounds = infoJson?.camera?.bounds ?? InfoDefaults.camera.bounds
  for (let i = 0; i < 8; i++) {
    output.addFloat(cameraBounds[i] as number)
  }

  if (formatVersion >= 14) {
    const cameraMargin = infoJson?.camera?.margins ?? InfoDefaults.camera.margins
    for (let i = 0; i < 4; i++) {
      output.addInt(cameraMargin[i] as number)
    }
  }

  if (formatVersion !== 0) {
    output.addInt(infoJson.map?.playableArea?.width)
    output.addInt(infoJson.map?.playableArea?.height)
  }

  if (formatVersion >= 2) {
    if (formatVersion < 9) {
      output.addInt(0)
    }

    const mapFlags = mergeBoolRecords(infoJson.map?.flags, InfoDefaults.map.flags)
    let flags = 0
    if (mapFlags.hideMinimapInPreview) flags |= 0x01
    if (mapFlags.modifyAllyPriorities) flags |= 0x02
    if (mapFlags.isMeleeMap) flags |= 0x04
    if (mapFlags.nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium) flags |= 0x08
    if (mapFlags.maskedPartiallyVisible) flags |= 0x10
    if (mapFlags.fixedPlayerSetting) flags |= 0x20
    if (mapFlags.useCustomForces) flags |= 0x40
    if (mapFlags.useCustomTechtree) flags |= 0x80
    if (mapFlags.useCustomAbilities) flags |= 0x0100
    if (mapFlags.useCustomUpgrades) flags |= 0x0200
    if (mapFlags.mapPropertiesMenuOpenedAtLeastOnce) flags |= 0x0400
    if (mapFlags.waterWavesOnCliffShores) flags |= 0x0800
    if (mapFlags.waterWavesOnRollingShores) flags |= 0x1000
    if (mapFlags.useTerrainFog) flags |= 0x2000
    if (mapFlags.tftRequired) flags |= 0x4000
    if (mapFlags.useItemClassificationSystem) flags |= 0x8000
    if (mapFlags.enableWaterTinting) flags |= 0x010000
    if (mapFlags.useAccurateProbabilityForCalculations) flags |= 0x020000
    if (mapFlags.useCustomAbilitySkins) flags |= 0x040000
    if (mapFlags.disableDenyIcon) flags |= 0x080000
    if (mapFlags.forceDefaultCameraZoom) flags |= 0x100000
    if (mapFlags.forceMaxCameraZoom) flags |= 0x200000
    if (mapFlags.forceMinCameraZoom) flags |= 0x400000
    if (mapFlags.overrideHdWaterColor) flags |= 0x800000
    if (mapFlags.alphaTileDefaultMinimapColor) flags |= 0x1000000
    if (mapFlags.dynamicMinimap) flags |= 0x2000000
    output.addInt(flags)
  }

  if (formatVersion >= 8) {
    output.addChar(infoJson.map?.mainTileType ?? InfoDefaults.map.mainTileType)
  }

  if (formatVersion >= 10) {
    if (formatVersion >= 17) {
      output.addInt(infoJson.loadingScreen?.imageId ?? InfoDefaults.loadingScreen.imageId)
    }
    if (formatVersion >= 37) {
      output.addInt(((race: RaceCrest) => {
        switch (race) {
          case RaceCrest.SELECTED_RACE: return 64
          case RaceCrest.HUMAN: return 1
          case RaceCrest.ORC: return 2
          case RaceCrest.UNDEAD: return 8
          case RaceCrest.NIGHT_ELF: return 4
          case RaceCrest.FORSAKEN: return 128
        }
      })(infoJson.loadingScreen?.raceCrest ?? InfoDefaults.loadingScreen.raceCrest))
    }
    if (formatVersion < 18) {
      output.addString('')
    } else if (formatVersion >= 20) {
      output.addString(infoJson.loadingScreen?.path ?? InfoDefaults.loadingScreen.path)
    }
    output.addString(infoJson.loadingScreen?.text ?? InfoDefaults.loadingScreen.text)
    if (formatVersion >= 11) {
      output.addString(infoJson.loadingScreen?.title ?? InfoDefaults.loadingScreen.title)
      output.addString(infoJson.loadingScreen?.subtitle ?? InfoDefaults.loadingScreen.subtitle)
    }
  }

  if (formatVersion >= 13) {
    if (formatVersion >= 17) {
      output.addInt(infoJson.gameDataSet ?? InfoDefaults.gameDataSet) // used to be prologue imageId
    }
    if (formatVersion < 18) {
      output.addString('')
    } else if (formatVersion >= 20) {
      output.addString(infoJson.prologue?.path ?? InfoDefaults.prologueScreen.path)
    }
    output.addString(infoJson.prologue?.text ?? InfoDefaults.prologueScreen.text)
    output.addString(infoJson.prologue?.title ?? InfoDefaults.prologueScreen.title)
    output.addString(infoJson.prologue?.subtitle ?? InfoDefaults.prologueScreen.subtitle)
  }

  if (formatVersion >= 19) {
    output.addInt(((type) => {
      switch (type) {
        case FogType.LINEAR: return 0
        case FogType.EXPONENTIAL1: return 1
        case FogType.EXPONENTIAL2: return 2
        case FogType.NEW_EXPONENTIAL1: return 3
        case FogType.NEW_EXPONENTIAL2: return 4
        case FogType.HEIGHT: return 5
      }
    })(infoJson.map?.fog?.type ?? InfoDefaults.map.fog.type))
    output.addFloat(infoJson.map?.fog?.startHeight ?? InfoDefaults.map.fog.startHeight)
    output.addFloat(infoJson.map?.fog?.endHeight ?? InfoDefaults.map.fog.endHeight)
    output.addFloat(infoJson.map?.fog?.density ?? InfoDefaults.map.fog.density)
    colorHexToBytes(infoJson.map?.fog?.color ?? InfoDefaults.map.fog.color).forEach((it) => {
      output.addByte(it)
    })
  }

  if (formatVersion >= 36) {
    output.addFloat(infoJson.map?.fog?.newHeightStart ?? InfoDefaults.map.fog.newHeightStart)
    output.addFloat(infoJson.map?.fog?.newHeightEnd ?? InfoDefaults.map.fog.newHeightEnd)
    output.addFloat(infoJson.map?.fog?.newLinearStart ?? InfoDefaults.map.fog.newLinearStart)
    output.addFloat(infoJson.map?.fog?.newLinearEnd ?? InfoDefaults.map.fog.newLinearEnd)
  }

  if (formatVersion >= 39) {
    output.addFloat(infoJson.map?.fog?.maxOpacity ?? InfoDefaults.map.fog.maxOpacity)
    output.addInt(+(infoJson.map?.fog?.drawFogOverSky ?? InfoDefaults.map.fog.drawFogOverSky))
  }

  if (formatVersion >= 21) {
    output.addInt(infoJson.map?.globalWeatherEffect ?? InfoDefaults.map.globalWeatherEffect)
  }

  if (formatVersion >= 22) {
    output.addString(infoJson.map?.customSoundEnvironment ?? InfoDefaults.map.customSoundEnvironment)
  }

  if (formatVersion >= 23) {
    output.addByte(infoJson.map?.customLightEnvironment ?? InfoDefaults.map.customLightEnvironment)
  }

  if (formatVersion >= 25) {
    colorHexToBytes(infoJson.map.water?.color ?? InfoDefaults.map.water.color).forEach((it) => {
      output.addByte(it)
    })
  }

  const scriptLanguageValue = ((val) => {
    switch (val) {
      case ScriptLanguage.JASS: return 0
      case ScriptLanguage.LUA: return 1
    }
  })(infoJson.scriptLanguage ?? InfoDefaults.scriptLanguage)
  if (formatVersion >= 28) {
    output.addInt(scriptLanguageValue)
  }

  const assetMode = { ...infoJson?.assetMode, ...InfoDefaults.assetMode }
  if (formatVersion >= 29) {
    let supportedModes = 0
    if (assetMode?.SD) supportedModes |= 0x01
    if (assetMode?.HD) supportedModes |= 0x02
    if (assetMode?.DE) supportedModes |= 0x04
    output.addInt(supportedModes)
  }

  if (formatVersion >= 30) {
    output.addInt(infoJson.gameDataVersion ?? InfoDefaults.gameDataVersion)
  }

  if (formatVersion >= 32) {
    output.addInt(infoJson.camera?.forcedDefaultCamDistance ?? InfoDefaults.camera.forcedDefaultCamDistance)
    output.addInt(infoJson.camera?.forcedMaxCamDistance ?? InfoDefaults.camera.forcedMaxCamDistance)
  }

  if (formatVersion >= 33) {
    output.addInt(infoJson.camera?.forcedMinCamDistance ?? InfoDefaults.camera.forcedMinCamDistance)
  }

  if (formatVersion >= 34) {
    output.addInt(infoJson.map.water?.hdMinOpacity ?? InfoDefaults.map.water.hdMinOpacity)
    output.addInt(infoJson.map.water?.hdMaxOpacity ?? InfoDefaults.map.water.hdMaxOpacity)
    output.addInt(infoJson.map.water?.hdReflectivity ?? InfoDefaults.map.water.hdReflectivity)
    output.addInt(infoJson.map.water?.hdEmissivity ?? InfoDefaults.map.water.hdEmissivity)
    output.addInt(infoJson.map.water?.hdEdgeSoftness ?? InfoDefaults.map.water.hdEdgeSoftness)
    output.addInt(infoJson.map.water?.hdWavesVertexDisplacement ?? InfoDefaults.map.water.hdWavesVertexDisplacement)
    output.addInt(infoJson.map.water?.hdWavesNormalMapStrength ?? InfoDefaults.map.water.hdWavesNormalMapStrength)
    colorHexToBytes(infoJson.map.water?.hdColor ?? InfoDefaults.map.water.hdColor).forEach((it) => {
      output.addByte(it)
    })
  }

  if (formatVersion >= 35) {
    output.addInt(infoJson.map.water?.hdEnvmapReflectivity ?? InfoDefaults.map.water.hdEnvmapReflectivity)
  }

  if (formatVersion >= 38) {
    colorHexToBytes(infoJson.map.alphaTileMinimapColor ?? InfoDefaults.map.alphaTileMinimapColor).forEach((it) => {
      output.addByte(it)
    })
  }

  output.addInt(infoJson.players?.length ?? 0)
  infoJson.players?.forEach((player) => {
    output.addInt(player.slotId)
    output.addInt(((type) => {
      switch (type) {
        case PlayerType.HUMAN: return 1
        case PlayerType.COMPUTER: return 2
        case PlayerType.NEUTRAL: return 3
        case PlayerType.RESCUABLE: return 4
      }
    })(player.type ?? PlayerDefaults.type))
    output.addInt(((race) => {
      switch (race) {
        case Race.RANDOM: return 0 // Check
        case Race.HUMAN: return 1
        case Race.ORC: return 2
        case Race.UNDEAD: return 3
        case Race.NIGHT_ELF: return 4
      }
    })(player.race ?? PlayerDefaults.race))
    if (formatVersion >= 37) {
      output.addInt(((race: RaceCrest) => {
        switch (race) {
          case RaceCrest.SELECTED_RACE: return 64
          case RaceCrest.HUMAN: return 1
          case RaceCrest.ORC: return 2
          case RaceCrest.UNDEAD: return 8
          case RaceCrest.NIGHT_ELF: return 4
          case RaceCrest.FORSAKEN: return 128
        }
      })(player.raceCrest ?? PlayerDefaults.raceCrest))
    }

    output.addInt(player.startLocation.fixed ? 1 : 0)
    output.addString(player.name)
    output.addFloat(player.startLocation.x)
    output.addFloat(player.startLocation.y)

    if (formatVersion >= 5) {
      output.addInt(playerListToPlayerBitmap(player.allyLowPriorities ?? PlayerDefaults.allyLowPriorities))
      output.addInt(playerListToPlayerBitmap(player.allyHighPriorities ?? PlayerDefaults.allyHighPriorities))
    }

    if (formatVersion >= 31) {
      output.addInt(playerListToPlayerBitmap(player.enemyLowPriorities ?? PlayerDefaults.enemyLowPriorities))
      output.addInt(playerListToPlayerBitmap(player.enemyHighPriorities ?? PlayerDefaults.enemyHighPriorities))
    }
  })

  const undefinedPlayersBitMask = ~(infoJson.players?.map(it => 1 << it.slotId).reduce((acc, it) => acc | it) ?? 0)

  if (formatVersion >= 3) {
    output.addInt(infoJson.forces?.length ?? 0)
    let firstForce = true
    infoJson.forces?.forEach((force) => {
      let forceFlags = 0
      if (force.flags.allied) forceFlags |= 0x0001
      if (force.flags.alliedVictory) forceFlags |= 0x0002
      // Skip 0x0004
      if (force.flags.shareVision) forceFlags |= 0x0008
      if (force.flags.shareUnitControl) forceFlags |= 0x0010
      if (force.flags.shareAdvUnitControl) forceFlags |= 0x0020
      output.addInt(forceFlags)

      const forcePlayerbitmap = playerListToPlayerBitmap(force.players)
      // First force must contain undefined players so they get automatically added in case they do get defined.
      if (firstForce) {
        output.addInt(forcePlayerbitmap | undefinedPlayersBitMask)
      } else {
        output.addInt(forcePlayerbitmap)
      }

      output.addString(force.name)
      firstForce = false
    })
  }

  if (formatVersion >= 6) {
    output.addInt(infoJson.upgrades?.length ?? 0)
    infoJson.upgrades?.forEach((upgrade) => {
      output.addInt(playerListToPlayerBitmap(upgrade.players))
      output.addChars(upgrade.upgradeId)
      output.addInt(upgrade.level)
      output.addInt(((val) => {
        switch (val) {
          case ResearchState.UNAVAILABLE: return 0
          case ResearchState.AVAILABLE: return 1
          case ResearchState.RESEARCHED: return 2
        }
      })(upgrade.state ?? UpgradeAvailableDefaults.state))
    })
  }

  if (formatVersion >= 7) {
    output.addInt(infoJson.techtree?.length ?? 0)
    infoJson.techtree?.forEach((tech) => {
      output.addInt(playerListToPlayerBitmap(tech.players))
      output.addChars(tech.techId)
    })
  }

  if (formatVersion >= 12) {
    output.addInt(infoJson.randomGroups?.length ?? 0)
    infoJson.randomGroups?.forEach((randomUnitTable) => {
      output.addInt(randomUnitTable.id)
      output.addString(randomUnitTable.name)

      const objectTypeGroups = randomUnitTable.sets?.map(value => {
        const acc = value.objects.reduce((acc, currentValue) => {
          acc[currentValue.type].push(currentValue.objectId);
          return acc;
        }, {
          chance: 0,
          [RandomGroupObjectType.ANY_UNIT]: [] as string[],
          [RandomGroupObjectType.ANY_BUILDING]: [] as string[],
          [RandomGroupObjectType.ANY_ITEM]: [] as string[]
        });
        acc.chance = value.chance;
        return acc;
      });
      const objectTypeCounts = objectTypeGroups.reduce((prevValue, currentValue) => {
        prevValue[RandomGroupObjectType.ANY_UNIT] = Math.max(prevValue[RandomGroupObjectType.ANY_UNIT], currentValue[RandomGroupObjectType.ANY_UNIT].length)
        prevValue[RandomGroupObjectType.ANY_BUILDING] = Math.max(prevValue[RandomGroupObjectType.ANY_BUILDING], currentValue[RandomGroupObjectType.ANY_BUILDING].length)
        prevValue[RandomGroupObjectType.ANY_ITEM] = Math.max(prevValue[RandomGroupObjectType.ANY_ITEM], currentValue[RandomGroupObjectType.ANY_ITEM].length)
        return prevValue;
      }, {
        [RandomGroupObjectType.ANY_UNIT]: 0,
        [RandomGroupObjectType.ANY_BUILDING]: 0,
        [RandomGroupObjectType.ANY_ITEM]: 0
      });

      const colCount = objectTypeCounts ? Object.values(objectTypeCounts).reduce((acc, value) => acc + value, 0) : 0
      output.addInt(colCount)

      if (colCount > 0) {
        let randomGroupObjectType: keyof typeof RandomGroupObjectType;
        for (randomGroupObjectType in RandomGroupObjectType) {
          const outputValue = ((randomGroupObjectType: RandomGroupObjectType) => {
            switch (randomGroupObjectType) {
              case RandomGroupObjectType.ANY_UNIT: return 0;
              case RandomGroupObjectType.ANY_BUILDING: return 1;
              case RandomGroupObjectType.ANY_ITEM: return 2;
            }
          })((randomGroupObjectType as RandomGroupObjectType|undefined) ?? RandomGroupDefaults.objectType)
          for (let count = 0; count < objectTypeCounts[randomGroupObjectType]; count++) {
            output.addInt(outputValue);
          }
        }
      }

      output.addInt(randomUnitTable.sets?.length ?? 0);
      objectTypeGroups.forEach(row => {
        output.addInt(row.chance)
        let randomGroupObjectType: keyof typeof RandomGroupObjectType;
        for (randomGroupObjectType in RandomGroupObjectType) {
          for (let i = 0; i < objectTypeCounts[randomGroupObjectType]; i++) {
            output.addChars(row[RandomGroupObjectType.ANY_UNIT][i] ?? RandomGroupDefaults.objectId)
          }
        }
      });
    })
  }

  if (formatVersion >= 24) {
    output.addInt(infoJson.randomItemTables?.length ?? 0)
    infoJson.randomItemTables?.forEach((randomItemTable) => {
      output.addInt(randomItemTable.id)
      output.addString(randomItemTable.name)

      output.addInt(randomItemTable.table?.length ?? 0)
      randomItemTable.table?.forEach((randomItemPool) => {
        output.addInt(randomItemPool.length ?? 0)
        randomItemPool.forEach((randomItem) => {
          output.addInt(randomItem.chance)
          output.addChars(randomItem.objectId)
        })
      })
    })
  }

  if (formatVersion >= 26 && formatVersion < 28) {
    output.addInt(scriptLanguageValue)
  }

  return output.getBuffer()
}

export function warToJson(buffer: Buffer): [Info, integer, integer] {
  const input = new W3Buffer(buffer)
  const formatVersion = input.readInt()
  if (formatVersion < 0 || formatVersion > 39) {
    log.warn(`Unknown map info format version ${formatVersion} will attempt at reading...`)
  } else {
    log.info(`Info format version is ${formatVersion}.`)
  }

  let mapVersion: integer
  let editorVersion: integer
  if (formatVersion >= 16) {
    mapVersion = input.readInt()
    editorVersion = input.readInt()
    log.info(`Editor version is ${editorVersion}.`)
  } else {
    mapVersion = InfoDefaults.mapVersion
    editorVersion = InfoDefaults.editorVersion
  }

  let gameVersionMajor: integer
  let gameVersionMinor: integer
  let gameVersionPatch: integer
  let gameVersionBuild: integer
  if (formatVersion >= 27) {
    gameVersionMajor = input.readInt()
    gameVersionMinor = input.readInt()
    gameVersionPatch = input.readInt()
    gameVersionBuild = input.readInt()
  } else {
    gameVersionMajor = InfoDefaults.gameVersion.major
    gameVersionMinor = InfoDefaults.gameVersion.minor
    gameVersionPatch = InfoDefaults.gameVersion.patch
    gameVersionBuild = InfoDefaults.gameVersion.build
  }

  const name = input.readString()
  const author = input.readString()
  const description = input.readString()
  let recommendedPlayers: string
  if (formatVersion >= 8) {
    recommendedPlayers = input.readString()
  } else {
    recommendedPlayers = InfoDefaults.map.recommendedPlayers
  }

  // Consume some old mystery bits
  if (formatVersion < 4) {
    input.readByte()
    input.readFloat()
  } else if (formatVersion < 9) {
    input.readFloat()
    input.readByte()
    input.readFloat()
    input.readFloat()
    input.readFloat()
    input.readInt()
  }

  const cameraBounds: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ] = [
      input.readFloat(),
      input.readFloat(),
      input.readFloat(),
      input.readFloat(),
      input.readFloat(),
      input.readFloat(),
      input.readFloat(),
      input.readFloat()
    ]

  let cameraMargins: [integer, integer, integer, integer]
  if (formatVersion >= 14) {
    cameraMargins = [input.readInt(), input.readInt(), input.readInt(), input.readInt()]
  } else {
    cameraMargins = [...InfoDefaults.camera.margins]
  }

  let width: number
  let height: number
  if (formatVersion !== 0) {
    width = input.readInt()
    height = input.readInt()
  } else {
    width = InfoDefaults.map.playableArea.width
    height = InfoDefaults.map.playableArea.height
  }

  let hideMinimapInPreview: boolean
  let modifyAllyPriorities: boolean
  let isMeleeMap: boolean
  let nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium: boolean
  let maskedPartiallyVisible: boolean
  let fixedPlayerSetting: boolean
  let useCustomForces: boolean
  let useCustomTechtree: boolean
  let useCustomAbilities: boolean
  let useCustomUpgrades: boolean
  let mapPropertiesMenuOpenedAtLeastOnce: boolean
  let waterWavesOnCliffShores: boolean
  let waterWavesOnRollingShores: boolean
  let useTerrainFog: boolean
  let tftRequired: boolean
  let useItemClassificationSystem: boolean
  let enableWaterTinting: boolean
  let useAccurateProbabilityForCalculations: boolean
  let useCustomAbilitySkins: boolean
  let disableDenyIcon: boolean
  let forceDefaultCameraZoom: boolean
  let forceMaxCameraZoom: boolean
  let forceMinCameraZoom: boolean
  let overrideHdWaterColor: boolean
  let alphaTileDefaultMinimapColor: boolean
  let dynamicMinimap: boolean
  if (formatVersion >= 2) {
    if (formatVersion < 9) {
      input.readInt() // some mystery field
    }

    let flagsValue = input.readInt()
    if (formatVersion < 15) {
      flagsValue |= 0x0800
    }
    hideMinimapInPreview = !!(flagsValue & 0x01)
    modifyAllyPriorities = !!(flagsValue & 0x02)
    isMeleeMap = !!(flagsValue & 0x04)
    nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium = !!(flagsValue & 0x08)
    maskedPartiallyVisible = !!(flagsValue & 0x10)
    fixedPlayerSetting = !!(flagsValue & 0x20)
    useCustomForces = !!(flagsValue & 0x40)
    useCustomTechtree = !!(flagsValue & 0x80)
    useCustomAbilities = !!(flagsValue & 0x0100)
    useCustomUpgrades = !!(flagsValue & 0x0200)
    mapPropertiesMenuOpenedAtLeastOnce = !!(flagsValue & 0x0400)
    waterWavesOnCliffShores = !!(flagsValue & 0x0800)
    waterWavesOnRollingShores = !!(flagsValue & 0x1000)
    useTerrainFog = !!(flagsValue & 0x2000)
    tftRequired = !!(flagsValue & 0x4000)
    useItemClassificationSystem = !!(flagsValue & 0x8000)
    enableWaterTinting = !!(flagsValue & 0x010000)
    useAccurateProbabilityForCalculations = !!(flagsValue & 0x020000)
    useCustomAbilitySkins = !!(flagsValue & 0x040000)
    disableDenyIcon = !!(flagsValue & 0x080000)
    forceDefaultCameraZoom = !!(flagsValue & 0x100000)
    forceMaxCameraZoom = !!(flagsValue & 0x200000)
    forceMinCameraZoom = !!(flagsValue & 0x400000)
    overrideHdWaterColor = !!(flagsValue & 0x800000)
    alphaTileDefaultMinimapColor = !!(flagsValue & 0x1000000)
    dynamicMinimap = !!(flagsValue & 0x2000000)
  } else {
    hideMinimapInPreview = InfoDefaults.map.flags.hideMinimapInPreview
    modifyAllyPriorities = InfoDefaults.map.flags.modifyAllyPriorities
    isMeleeMap = InfoDefaults.map.flags.isMeleeMap
    nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium = InfoDefaults.map.flags.nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium
    maskedPartiallyVisible = InfoDefaults.map.flags.maskedPartiallyVisible
    fixedPlayerSetting = InfoDefaults.map.flags.fixedPlayerSetting
    useCustomForces = InfoDefaults.map.flags.useCustomForces
    useCustomTechtree = InfoDefaults.map.flags.useCustomTechtree
    useCustomAbilities = InfoDefaults.map.flags.useCustomAbilities
    useCustomUpgrades = InfoDefaults.map.flags.useCustomUpgrades
    mapPropertiesMenuOpenedAtLeastOnce = InfoDefaults.map.flags.mapPropertiesMenuOpenedAtLeastOnce
    waterWavesOnCliffShores = InfoDefaults.map.flags.waterWavesOnCliffShores
    waterWavesOnRollingShores = InfoDefaults.map.flags.waterWavesOnRollingShores
    useTerrainFog = InfoDefaults.map.flags.useTerrainFog
    tftRequired = InfoDefaults.map.flags.tftRequired
    useItemClassificationSystem = InfoDefaults.map.flags.useItemClassificationSystem
    enableWaterTinting = InfoDefaults.map.flags.enableWaterTinting
    useAccurateProbabilityForCalculations = InfoDefaults.map.flags.useAccurateProbabilityForCalculations
    useCustomAbilitySkins = InfoDefaults.map.flags.useCustomAbilitySkins
    disableDenyIcon = InfoDefaults.map.flags.disableDenyIcon
    forceDefaultCameraZoom = InfoDefaults.map.flags.forceDefaultCameraZoom
    forceMaxCameraZoom = InfoDefaults.map.flags.forceMaxCameraZoom
    forceMinCameraZoom = InfoDefaults.map.flags.forceMinCameraZoom
    overrideHdWaterColor = InfoDefaults.map.flags.overrideHdWaterColor
    alphaTileDefaultMinimapColor = InfoDefaults.map.flags.alphaTileDefaultMinimapColor
    dynamicMinimap = InfoDefaults.map.flags.dynamicMinimap
  }

  let tileset: string
  if (formatVersion >= 8) {
    tileset = input.readChars()
  } else {
    tileset = InfoDefaults.map.mainTileType
  }

  let loadingScreenImageId: integer
  let loadingScreenRaceCrest: RaceCrest
  let loadingScreenImageFile: string
  let loadingScreenText: string
  let loadingScreenTitle: string
  let loadingScreenSubtitle: string
  if (formatVersion >= 10) {
    if (formatVersion >= 17) {
      loadingScreenImageId = input.readInt()
    } else {
      loadingScreenImageId = InfoDefaults.loadingScreen.imageId
    }
    if (formatVersion >= 37) {
      loadingScreenRaceCrest = ((crest: integer) => {
        switch (crest) {
          case 64: return RaceCrest.SELECTED_RACE
          case 1: return RaceCrest.HUMAN
          case 2: return RaceCrest.ORC
          case 8: return RaceCrest.UNDEAD
          case 4: return RaceCrest.NIGHT_ELF
          case 128: return RaceCrest.FORSAKEN
          default: return PlayerDefaults.raceCrest
        }
      })(input.readInt())
    } else {
      loadingScreenRaceCrest = InfoDefaults.loadingScreen.raceCrest
    }
    if (formatVersion < 18) {
      input.readString() // unknown string
      loadingScreenImageFile = InfoDefaults.loadingScreen.path
    } else if (formatVersion >= 20) {
      loadingScreenImageFile = input.readString()
    } else {
      loadingScreenImageFile = InfoDefaults.loadingScreen.path
    }
    loadingScreenText = input.readString()
    if (formatVersion >= 11) {
      loadingScreenTitle = input.readString()
      loadingScreenSubtitle = input.readString()
    } else {
      loadingScreenTitle = InfoDefaults.loadingScreen.title
      loadingScreenSubtitle = InfoDefaults.loadingScreen.subtitle
    }
  } else {
    loadingScreenImageId = InfoDefaults.loadingScreen.imageId
    loadingScreenRaceCrest = InfoDefaults.loadingScreen.raceCrest
    loadingScreenImageFile = InfoDefaults.loadingScreen.path
    loadingScreenText = InfoDefaults.loadingScreen.text
    loadingScreenTitle = InfoDefaults.loadingScreen.title
    loadingScreenSubtitle = InfoDefaults.loadingScreen.subtitle
  }

  let prologueScreenImageId: integer
  let prologueScreenImageFile: string
  let prologueScreenText: string
  let prologueScreenTitle: string
  let prologueScreenSubtitle: string
  if (formatVersion >= 13) {
    if (formatVersion >= 17) {
      prologueScreenImageId = input.readInt()
    } else {
      prologueScreenImageId = InfoDefaults.gameDataSet
    }
    if (formatVersion < 18) {
      input.readString() // unknown string
      prologueScreenImageFile = InfoDefaults.prologueScreen.path
    } else if (formatVersion >= 20) {
      prologueScreenImageFile = input.readString()
    } else {
      prologueScreenImageFile = InfoDefaults.prologueScreen.path
    }
    prologueScreenText = input.readString()
    prologueScreenTitle = input.readString()
    prologueScreenSubtitle = input.readString()
  } else {
    prologueScreenImageId = InfoDefaults.gameDataSet // Yes, this is correct, despite it looking wrong
    prologueScreenImageFile = InfoDefaults.prologueScreen.path
    prologueScreenText = InfoDefaults.prologueScreen.text
    prologueScreenTitle = InfoDefaults.prologueScreen.title
    prologueScreenSubtitle = InfoDefaults.prologueScreen.subtitle
  }

  let fogStyle: FogType
  let fogZStart: number
  let fogZEnd: number
  let fogDensity: number
  let fogColor: color
  if (formatVersion >= 19) {
    fogStyle = ((type) => {
      switch (type) {
        case 0: return FogType.LINEAR
        case 1: return FogType.EXPONENTIAL1
        case 2: return FogType.EXPONENTIAL2
        case 3: return FogType.NEW_EXPONENTIAL1
        case 4: return FogType.NEW_EXPONENTIAL2
        case 5: return FogType.HEIGHT
        default: return FogType.LINEAR
      }
    })(input.readInt())
    fogZStart = input.readFloat()
    fogZEnd = input.readFloat()
    fogDensity = input.readFloat()
    fogColor = colorBytesToHex(input.readByte(), input.readByte(), input.readByte(), input.readByte())
  } else {
    fogStyle = InfoDefaults.map.fog.type
    fogZStart = InfoDefaults.map.fog.startHeight
    fogZEnd = InfoDefaults.map.fog.endHeight
    fogDensity = InfoDefaults.map.fog.density
    fogColor = InfoDefaults.map.fog.color
  }

  let fogNewHeightStart: number
  let fogNewHeightEnd: number
  let fogNewLinearStart: number
  let fogNewLinearEnd: number
  if (formatVersion >= 36) {
    fogNewHeightStart = input.readFloat()
    fogNewHeightEnd = input.readFloat()
    fogNewLinearStart = input.readFloat()
    fogNewLinearEnd = input.readFloat()
  } else {
    fogNewHeightStart = InfoDefaults.map.fog.newHeightStart
    fogNewHeightEnd = InfoDefaults.map.fog.newHeightEnd
    fogNewLinearStart = InfoDefaults.map.fog.newLinearStart
    fogNewLinearEnd = InfoDefaults.map.fog.newLinearEnd
  }

  let fogMaxOpacity: number
  let fogDrawOverSky: boolean
  if (formatVersion >= 39) {
    fogMaxOpacity = input.readFloat()
    fogDrawOverSky = !!input.readInt()
  } else {
    fogMaxOpacity = InfoDefaults.map.fog.maxOpacity
    fogDrawOverSky = InfoDefaults.map.fog.drawFogOverSky
  }

  let globalWeatherEffect: integer
  if (formatVersion >= 21) {
    globalWeatherEffect = input.readInt()
  } else {
    globalWeatherEffect = InfoDefaults.map.globalWeatherEffect
  }

  let customSoundEnvironment: string
  if (formatVersion >= 22) {
    customSoundEnvironment = input.readString()
  } else {
    customSoundEnvironment = InfoDefaults.map.customSoundEnvironment
  }

  let customLightEnvironment: integer
  if (formatVersion >= 23) {
    customLightEnvironment = input.readByte()
  } else {
    customLightEnvironment = InfoDefaults.map.customLightEnvironment
  }

  let waterColor: color
  if (formatVersion >= 25) {
    waterColor = colorBytesToHex(input.readByte(), input.readByte(), input.readByte(), input.readByte())
  } else {
    waterColor = InfoDefaults.map.water.color
  }

  let scriptLanguageVal: number | undefined
  if (formatVersion >= 28) {
    scriptLanguageVal = input.readInt()
  }

  let assetMode: { SD: boolean, HD: boolean, DE: boolean }
  if (formatVersion >= 29) {
    let assetModeVal = input.readInt()
    if (assetModeVal === 0) assetModeVal = 3
    assetMode = {
      SD: !!(assetModeVal & 0x01),
      HD: !!(assetModeVal & 0x02),
      DE: !!(assetModeVal & 0x04)
    }
  } else {
    assetMode = { ...InfoDefaults.assetMode }
  }

  let gameDataVersion: integer
  if (formatVersion >= 30) {
    gameDataVersion = input.readInt()
  } else {
    gameDataVersion = InfoDefaults.gameDataVersion
  }

  let forcedDefaultCamDistance: integer
  let forcedMaxCamDistance: integer
  if (formatVersion >= 32) {
    forcedDefaultCamDistance = input.readInt()
    forcedMaxCamDistance = input.readInt()
  } else {
    forcedDefaultCamDistance = InfoDefaults.camera.forcedDefaultCamDistance
    forcedMaxCamDistance = InfoDefaults.camera.forcedMaxCamDistance
  }

  let forcedMinCamDistance: integer
  if (formatVersion >= 33) {
    forcedMinCamDistance = input.readInt()
  } else {
    forcedMinCamDistance = InfoDefaults.camera.forcedMinCamDistance
  }

  let waterHdMinOpacity: integer
  let waterHdMaxOpacity: integer
  let waterHdReflectivity: integer
  let waterHdEmissivity: integer
  let waterHdEdgeSoftness: integer
  let waterHdWavesVertexDisplacement: integer
  let waterHdWavesNormalMapStrength: integer
  let waterHdColor: color
  if (formatVersion >= 34) {
    waterHdMinOpacity = input.readInt()
    waterHdMaxOpacity = input.readInt()
    waterHdReflectivity = input.readInt()
    waterHdEmissivity = input.readInt()
    waterHdEdgeSoftness = input.readInt()
    waterHdWavesVertexDisplacement = input.readInt()
    waterHdWavesNormalMapStrength = input.readInt()
    waterHdColor = colorBytesToHex(input.readByte(), input.readByte(), input.readByte(), input.readByte())
  } else {
    waterHdMinOpacity = InfoDefaults.map.water?.hdMinOpacity
    waterHdMaxOpacity = InfoDefaults.map.water?.hdMaxOpacity
    waterHdReflectivity = InfoDefaults.map.water?.hdReflectivity
    waterHdEmissivity = InfoDefaults.map.water?.hdEmissivity
    waterHdEdgeSoftness = InfoDefaults.map.water?.hdEdgeSoftness
    waterHdWavesVertexDisplacement = InfoDefaults.map.water?.hdWavesVertexDisplacement
    waterHdWavesNormalMapStrength = InfoDefaults.map.water?.hdWavesNormalMapStrength
    waterHdColor = InfoDefaults.map.water?.hdColor
  }

  let waterHdEnvmapReflectivity: integer
  if (formatVersion >= 35) {
    waterHdEnvmapReflectivity = input.readInt()
  } else {
    waterHdEnvmapReflectivity = InfoDefaults.map.water?.hdEnvmapReflectivity
  }

  let alphaTileMinimapColor: color
  if (formatVersion >= 38) {
    alphaTileMinimapColor = colorBytesToHex(input.readByte(), input.readByte(), input.readByte(), input.readByte())
  } else {
    alphaTileMinimapColor = InfoDefaults.map.alphaTileMinimapColor
  }

  const players: Player[] = []
  const playerCount = input.readInt()
  for (let i = 0; i < playerCount; i++) {
    const playerSlotId = input.readInt()
    const playerType = input.readInt()
    const playerRace = input.readInt()
    const playerCrest = input.readInt()
    const playerFlags = input.readInt()
    const playerName = input.readString()
    const playerStartX = input.readFloat()
    const playerStartY = input.readFloat()

    let allyLowPriorities: PlayerList
    let allyHighPriorities: PlayerList
    if (formatVersion >= 5) {
      allyLowPriorities = playerBitmapToPlayerList(input.readInt())
      allyHighPriorities = playerBitmapToPlayerList(input.readInt())
    } else {
      allyLowPriorities = PlayerDefaults.allyLowPriorities
      allyHighPriorities = PlayerDefaults.allyHighPriorities
    }

    let enemyLowPriorities: PlayerList
    let enemyHighPriorities: PlayerList
    if (formatVersion >= 31) {
      enemyLowPriorities = playerBitmapToPlayerList(input.readInt())
      enemyHighPriorities = playerBitmapToPlayerList(input.readInt())
    } else {
      enemyLowPriorities = PlayerDefaults.enemyLowPriorities
      enemyHighPriorities = PlayerDefaults.enemyHighPriorities
    }

    players.push({
      slotId: playerSlotId,
      type: ((type) => {
        switch (type) {
          case 1: return PlayerType.HUMAN
          case 2: return PlayerType.COMPUTER
          case 3: return PlayerType.NEUTRAL
          case 4: return PlayerType.RESCUABLE
          default: return PlayerDefaults.type
        }
      })(playerType),
      race: ((race) => {
        switch (race) {
          case 0: return Race.RANDOM
          case 1: return Race.HUMAN
          case 2: return Race.ORC
          case 3: return Race.UNDEAD
          case 4: return Race.NIGHT_ELF
          default: return PlayerDefaults.race
        }
      })(playerRace),
      raceCrest: ((crest: integer) => {
        switch (crest) {
          case 64: return RaceCrest.SELECTED_RACE
          case 1: return RaceCrest.HUMAN
          case 2: return RaceCrest.ORC
          case 8: return RaceCrest.UNDEAD
          case 4: return RaceCrest.NIGHT_ELF
          case 128: return RaceCrest.FORSAKEN
          default: return PlayerDefaults.raceCrest
        }
      })(playerCrest),
      name: playerName,
      startLocation: {
        x: playerStartX,
        y: playerStartY,
        fixed: !!(playerFlags & 0x01)
      },
      allyLowPriorities,
      allyHighPriorities,
      enemyLowPriorities,
      enemyHighPriorities
    })
  }

  const forces: Force[] = []
  if (formatVersion >= 3) {
    const forceCount = input.readInt()
    for (let i = 0; i < forceCount; i++) {
      const forceFlag = input.readInt()
      forces.push({
        flags: {
          allied: !!(forceFlag & 0x01),
          alliedVictory: !!(forceFlag & 0x02),
          // 0x04: share vision (the documentation has this incorrect)
          shareVision: !!(forceFlag & 0x08),
          shareUnitControl: !!(forceFlag & 0x10),
          shareAdvUnitControl: !!(forceFlag & 0x20)
        },
        players: playerBitmapToPlayerList(input.readInt()),
        name: input.readString()
      })
    }
  } else {
    forces.push({ flags: { ...ForceDefaults.flags }, players: players.map(it => it.slotId), name: ForceDefaults.name })
  }

  let upgrades: UpgradeAvailable[]
  if (formatVersion >= 6) {
    upgrades = []
    const upgradeCount = input.readInt()
    for (let i = 0; i < upgradeCount; i++) {
      upgrades.push({
        players: playerBitmapToPlayerList(input.readInt()),
        upgradeId: input.readChars(4), // upgrade id (as in UpgradeData.slk)
        level: input.readInt(), // Level of the upgrade for which the availability is changed (this is actually the level - 1, so 1 => 0)
        state: ((val) => {
          switch (val) {
            case 0: return ResearchState.UNAVAILABLE
            case 1: return ResearchState.AVAILABLE
            case 2: return ResearchState.RESEARCHED
            default: return UpgradeAvailableDefaults.state
          }
        })(input.readInt())
      })
    }
  } else {
    upgrades = InfoDefaults.upgrades
  }

  let techtree: TechUnavailable[]
  if (formatVersion >= 7) {
    techtree = []
    const techCount = input.readInt()
    for (let i = 0; i < techCount; i++) {
      techtree.push({
        players: playerBitmapToPlayerList(input.readInt()),
        techId: input.readChars(4) // tech id (this can be an item, unit or ability)
      })
    }
  } else {
    techtree = InfoDefaults.techtree
  }

  let randomGroups: RandomGroup[]
  if (formatVersion >= 12) {
    randomGroups = []
    const randomUnitCount = input.readInt()
    for (let i = 0; i < randomUnitCount; i++) {
      const randomUnitTable: RandomGroup = {
        id: input.readInt(),
        name: input.readString(),
        sets: []
      }
      randomGroups.push(randomUnitTable)

      const colCount = input.readInt() // Number "m" of positions
      const types: integer[] = []
      for (let j = 0; j < colCount; j++) {
        types.push(input.readInt())
      }

      const rowCount = input.readInt()
      for (let j = 0; j < rowCount; j++) {
        const randomGroupSet: RandomGroupSet = {
          chance: input.readInt(), // Chance of the unit/item (percentage)
          objects: []
        }
        randomUnitTable.sets.push(randomGroupSet)

        for (let k = 0; k < colCount; k++) {
          randomGroupSet.objects.push({
            type: ((type) => {
              switch (type) {
                case 0: return RandomGroupObjectType.ANY_UNIT
                case 1: return RandomGroupObjectType.ANY_BUILDING
                case 2: return RandomGroupObjectType.ANY_ITEM
                default: return RandomGroupObjectType.ANY_UNIT
              }
            })(types[k]),
            objectId: input.readChars(4)
          }) // unit/item id's for this line specified
        }
      }
    }
  } else {
    randomGroups = InfoDefaults.randomGroups
  }

  let randomItemTables: ItemTable[]
  if (formatVersion >= 24) {
    randomItemTables = []
    const itemTableCount = input.readInt()
    for (let i = 0; i < itemTableCount; i++) {
      const tableRows: ObjectChance[][] = []
      randomItemTables.push({
        id: input.readInt(), // Group number
        name: input.readString(), // Group name
        table: tableRows
      })

      const itemSetsCurrentTable = input.readInt()
      for (let j = 0; j < itemSetsCurrentTable; j++) {
        const objects: ObjectChance[] = []
        tableRows.push(objects)

        const itemsInItemSet = input.readInt() // Number "i" of items on the current item set
        for (let k = 0; k < itemsInItemSet; k++) {
          objects.push({
            chance: input.readInt(), // Percentual chance
            objectId: input.readChars(4) // Item id (as in ItemData.slk)
          })
        }
      }
    }
  } else {
    randomItemTables = InfoDefaults.randomItemTables
  }

  if (formatVersion >= 26 && formatVersion < 28) {
    scriptLanguageVal = input.readInt()
  }

  return [{
    mapVersion,
    gameVersion: {
      major: gameVersionMajor,
      minor: gameVersionMinor,
      patch: gameVersionPatch,
      build: gameVersionBuild
    },
    editorVersion,
    scriptLanguage: ((scriptLanguage) => {
      switch (scriptLanguage) {
        case 0: return ScriptLanguage.JASS
        case 1: return ScriptLanguage.LUA
        default: return InfoDefaults.scriptLanguage
      }
    })(scriptLanguageVal),
    assetMode,
    gameDataVersion,
    map: {
      name,
      author,
      description,
      recommendedPlayers,
      playableArea: {
        width,
        height
      },
      flags: {
        hideMinimapInPreview,
        modifyAllyPriorities,
        isMeleeMap,
        nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium,
        maskedPartiallyVisible,
        fixedPlayerSetting,
        useCustomForces,
        useCustomTechtree,
        useCustomAbilities,
        useCustomUpgrades,
        mapPropertiesMenuOpenedAtLeastOnce,
        waterWavesOnCliffShores,
        waterWavesOnRollingShores,
        useTerrainFog,
        tftRequired,
        useItemClassificationSystem,
        enableWaterTinting,
        useAccurateProbabilityForCalculations,
        useCustomAbilitySkins,
        disableDenyIcon,
        forceDefaultCameraZoom,
        forceMaxCameraZoom,
        forceMinCameraZoom,
        overrideHdWaterColor,
        alphaTileDefaultMinimapColor,
        dynamicMinimap
      },
      mainTileType: tileset,
      fog: {
        type: fogStyle,
        startHeight: fogZStart,
        endHeight: fogZEnd,
        density: fogDensity,
        color: fogColor,
        newHeightStart: fogNewHeightStart,
        newHeightEnd: fogNewHeightEnd,
        newLinearStart: fogNewLinearStart,
        newLinearEnd: fogNewLinearEnd,
        maxOpacity: fogMaxOpacity,
        drawFogOverSky: fogDrawOverSky
      },
      globalWeatherEffect,
      customSoundEnvironment,
      customLightEnvironment,
      water: {
        color: waterColor,
        hdMinOpacity: waterHdMinOpacity,
        hdMaxOpacity: waterHdMaxOpacity,
        hdReflectivity: waterHdReflectivity,
        hdEmissivity: waterHdEmissivity,
        hdEdgeSoftness: waterHdEdgeSoftness,
        hdWavesVertexDisplacement: waterHdWavesVertexDisplacement,
        hdWavesNormalMapStrength: waterHdWavesNormalMapStrength,
        hdEnvmapReflectivity: waterHdEnvmapReflectivity,
        hdColor: waterHdColor,
      },
      alphaTileMinimapColor: alphaTileMinimapColor
    },
    camera: {
      bounds: cameraBounds,
      margins: cameraMargins,
      forcedDefaultCamDistance,
      forcedMaxCamDistance,
      forcedMinCamDistance
    },
    gameDataSet: prologueScreenImageId,
    prologue: {
      path: prologueScreenImageFile,
      text: prologueScreenText,
      title: prologueScreenTitle,
      subtitle: prologueScreenSubtitle
    },
    loadingScreen: {
      imageId: loadingScreenImageId,
      raceCrest: loadingScreenRaceCrest,
      path: loadingScreenImageFile,
      text: loadingScreenText,
      title: loadingScreenTitle,
      subtitle: loadingScreenSubtitle
    },
    players,
    forces,
    upgrades,
    techtree,
    randomGroups,
    randomItemTables
  } satisfies Info, formatVersion, editorVersion]
}