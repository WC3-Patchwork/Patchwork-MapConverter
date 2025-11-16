/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type integer } from '../CommonInterfaces'
import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type ObjectChance, type Force, type GameVersion, type Info, type Player, type RandomGroup, type RandomGroupSet, type RandomTable, type TechUnavailable, type UpgradeAvailable, type PlayerList, ScriptLanguage, ResearchState, PlayerType, Race, RandomGroupSetType, FogType } from '../data/Info'

function playerBitmapToPlayerList (playerBitmap: integer): PlayerList {
  const playerList: integer[] = []
  for (let i = 0; i < 24; i++) {
    playerList.push(playerBitmap & (1 << i))
  }
  return playerList
}

function playerListToPlayerBitmap (playerList: PlayerList): integer {
  return playerList.map(it => 1 << it).reduce((acc, it) => acc | it)
}

export function jsonToWar (infoJson: Info, formatVersion: number): Buffer {
  const output = new HexBuffer()

  if (formatVersion < 0 || formatVersion > 33) {
    throw new Error(`Unknown map info format version=${formatVersion}, expected value from range [0, 33]`)
  }

  output.addInt(formatVersion)
  if (formatVersion > 0x0F) {
    output.addInt(infoJson.mapVersion ?? 0)
    output.addInt(infoJson.editorVersion ?? 0)
  }

  if (formatVersion > 0x1A) {
    output.addInt(infoJson.gameVersion.major ?? 0)
    output.addInt(infoJson.gameVersion.minor ?? 0)
    output.addInt(infoJson.gameVersion.patch ?? 0)
    output.addInt(infoJson.gameVersion.build ?? 0)
  }

  output.addString(infoJson.map.name)
  output.addString(infoJson.map.author)
  output.addString(infoJson.map.description)

  if (formatVersion > 0x07) {
    output.addString(infoJson.map.recommendedPlayers ?? '')
  }

  // Pad with some mystery bytes
  if (formatVersion < 0x04) {
    output.addByte(0)
    output.addFloat(0)
  } else if (formatVersion < 0x09) {
    output.addFloat(0)
    output.addByte(0)
    output.addFloat(0)
    output.addFloat(0)
    output.addFloat(0)
    output.addInt(0)
  }

  for (let i = 0; i < 8; i++) {
    output.addFloat(infoJson.camera.bounds[i])
  }

  for (let i = 0; i < 4; i++) {
    output.addInt(infoJson.camera.margins[i])
  }

  if (formatVersion !== 0) {
    output.addInt(infoJson.map.playableArea.width)
    output.addInt(infoJson.map.playableArea.height)
  }

  if (formatVersion > 1) {
    if (formatVersion < 9) {
      output.addInt(0)
    }

    if (infoJson.map.flags != null) {
      let flags = 0
      if (infoJson.map.flags.hideMinimapInPreview) flags |= 0x01
      if (infoJson.map.flags.modifyAllyPriorities) flags |= 0x02
      if (infoJson.map.flags.isMeleeMap) flags |= 0x04
      if (infoJson.map.flags.nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium) flags |= 0x08
      if (infoJson.map.flags.maskedPartiallyVisible) flags |= 0x10
      if (infoJson.map.flags.fixedPlayerSetting) flags |= 0x20
      if (infoJson.map.flags.useCustomForces) flags |= 0x40
      if (infoJson.map.flags.useCustomTechtree) flags |= 0x80
      if (infoJson.map.flags.useCustomAbilities) flags |= 0x0100
      if (infoJson.map.flags.useCustomUpgrades) flags |= 0x0200
      if (infoJson.map.flags.mapPropertiesMenuOpenedAtLeastOnce) flags |= 0x0400
      if (infoJson.map.flags.waterWavesOnCliffShores) flags |= 0x0800
      if (infoJson.map.flags.waterWavesOnRollingShores) flags |= 0x1000
      if (infoJson.map.flags.useTerrainFog) flags |= 0x2000
      if (infoJson.map.flags.tftRequired) flags |= 0x4000
      if (infoJson.map.flags.useItemClassificationSystem) flags |= 0x8000
      if (infoJson.map.flags.enableWaterTinting) flags |= 0x010000
      if (infoJson.map.flags.useAccurateProbabilityForCalculations) flags |= 0x020000
      if (infoJson.map.flags.useCustomAbilitySkins) flags |= 0x040000
      if (infoJson.map.flags.disableDenyIcon) flags |= 0x080000
      if (infoJson.map.flags.forceDefaultCameraZoom) flags |= 0x100000
      if (infoJson.map.flags.forceMaxCameraZoom) flags |= 0x200000
      if (infoJson.map.flags.forceMinCameraZoom) flags |= 0x400000
      output.addInt(flags)
    } else {
      output.addInt(0x9810)
    }
  }

  if (formatVersion > 0x07) {
    output.addChar(infoJson.map.mainTileType ?? '\0')
  }

  if (formatVersion > 0x09) {
    if (formatVersion > 0x10) {
      output.addInt(infoJson.loadingScreen.imageId ?? -1)
    }
    if (formatVersion < 0x12) {
      output.addString('')
    } else if (formatVersion > 0x13) {
      output.addString(infoJson.loadingScreen.path ?? '')
    }
    output.addString(infoJson.loadingScreen.text ?? '')
    if (formatVersion > 0x0A) {
      output.addString(infoJson.loadingScreen.title ?? '')
      output.addString(infoJson.loadingScreen.subtitle ?? '')
    }
  }

  if (formatVersion > 0x0C) {
    if (formatVersion > 0x10) {
      output.addInt(infoJson.gameDataSet ?? -1)
    }
    if (formatVersion < 0x12) {
      output.addString('')
    } else if (formatVersion > 0x13) {
      output.addString(infoJson.prologue.path ?? '')
    }
    output.addString(infoJson.prologue.text ?? '')
    output.addString(infoJson.prologue.title ?? '')
    output.addString(infoJson.prologue.subtitle ?? '')
  }

  if (formatVersion > 0x12) {
    output.addInt((type => {
      switch (type) {
        case FogType.LINEAR: return 0
        case FogType.EXPONENTIAL1: return 1
        case FogType.EXPONENTIAL2: return 2
        default: return 0
      }
    })(infoJson.fog.type ?? FogType.LINEAR))
    output.addFloat(infoJson.fog.startHeight ?? 0)
    output.addFloat(infoJson.fog.endHeight ?? 0)
    output.addFloat(infoJson.fog.density ?? 0)
    output.addByte(infoJson.fog.color[0] ?? 0)
    output.addByte(infoJson.fog.color[1] ?? 0)
    output.addByte(infoJson.fog.color[2] ?? 0)
    output.addByte(infoJson.fog.color[3] ?? 0)
  }

  if (formatVersion > 0x14) {
    output.addInt(infoJson.globalWeatherEffect ?? 0)
  }

  if (formatVersion > 0x15) {
    output.addString(infoJson.customSoundEnvironment ?? '')
  }

  if (formatVersion > 0x16) {
    output.addByte(infoJson.customLightEnvironment ?? 0)
  }

  if (formatVersion > 0x18) {
    output.addByte(infoJson.waterColor[0] ?? 0)
    output.addByte(infoJson.waterColor[1] ?? 0)
    output.addByte(infoJson.waterColor[2] ?? 0)
    output.addByte(infoJson.waterColor[3] ?? 0)
  }

  const scriptLanguageValue = (val => {
    switch (val) {
      case ScriptLanguage.JASS: return 0
      case ScriptLanguage.LUA: return 1
      default: return 0
    }
  })(infoJson.scriptLanguage)
  if (formatVersion > 0x1B) {
    output.addInt(scriptLanguageValue)
  }

  if (formatVersion > 0x1C) {
    let supportedModes = 0
    if (infoJson.assetMode.SD) supportedModes |= 0x01
    if (infoJson.assetMode.HD) supportedModes |= 0x02
    output.addInt(supportedModes)
  }

  if (formatVersion > 0x1D) {
    output.addInt(infoJson.mapDataVersion)
  }

  if (formatVersion > 0x1F) {
    output.addInt(infoJson.forcedDefaultCamDistance ?? 0)
    output.addInt(infoJson.forcedMaxCamDistance ?? 0)
  }

  if (formatVersion > 0x20) {
    output.addInt(infoJson.forcedMinCamDistance ?? 0)
  }

  output.addInt(infoJson.players?.length ?? 0)
  infoJson.players?.forEach(player => {
    output.addInt(player.slotId)
    output.addInt((type => {
      switch (type) {
        case PlayerType.HUMAN: return 1
        case PlayerType.COMPUTER: return 2
        case PlayerType.NEUTRAL: return 3
        case PlayerType.RESCUABLE: return 4
        default: return 1
      }
    })(player.type))
    output.addInt((race => {
      switch (race) {
        case Race.RANDOM: return 0 // Check
        case Race.HUMAN: return 1
        case Race.ORC: return 2
        case Race.UNDEAD: return 3
        case Race.NIGHT_ELF: return 4
        default: return 0
      }
    })(player.race))
    output.addInt(player.startLocation.fixed ? 1 : 0)
    output.addString(player.name)
    output.addFloat(player.startLocation.x)
    output.addFloat(player.startLocation.y)

    if (formatVersion > 0x04) {
      output.addInt(playerListToPlayerBitmap(player.allyLowPriorities))
      output.addInt(playerListToPlayerBitmap(player.allyHighPriorities))
    }

    if (formatVersion > 0x1E) {
      output.addInt(playerListToPlayerBitmap(player.enemyLowPriorities))
      output.addInt(playerListToPlayerBitmap(player.enemyHighPriorities))
    }
  })

  const undefinedPlayersBitMask = ~(infoJson.players?.map(it => 1 << it.slotId).reduce((acc, it) => acc | it) ?? 0)

  if (formatVersion >= 0x03) {
    output.addInt(infoJson.forces?.length ?? 0)
    let firstForce = true
    infoJson.forces?.forEach(force => {
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

  if (formatVersion >= 0x06) {
    output.addInt(infoJson.upgrades?.length ?? 0)
    infoJson.upgrades?.forEach(upgrade => {
      output.addInt(playerListToPlayerBitmap(upgrade.players))
      output.addChars(upgrade.upgradeId)
      output.addInt(upgrade.level)
      output.addInt((val => {
        switch (val) {
          case ResearchState.UNAVAILABLE: return 0
          case ResearchState.AVAILABLE: return 1
          case ResearchState.RESEARCHED: return 2
          default: return 1
        }
      })(upgrade.state))
    })
  }

  if (formatVersion > 0x07) {
    output.addInt(infoJson.techtree?.length ?? 0)
    infoJson.techtree?.forEach(tech => {
      output.addInt(playerListToPlayerBitmap(tech.players))
      output.addChars(tech.techId)
    })
  }

  if (formatVersion > 0x0C) {
    output.addInt(infoJson.randomGroups?.length ?? 0)
    infoJson.randomGroups?.forEach(randomUnitTable => {
      output.addInt(randomUnitTable.id)
      output.addString(randomUnitTable.name)

      output.addInt(randomUnitTable.sets?.length ?? 0)
      randomUnitTable.sets?.forEach(set => {
        output.addInt((type => {
          switch (type) {
            case RandomGroupSetType.ANY_UNIT: return 0
            case RandomGroupSetType.ANY_BUILDING: return 1
            case RandomGroupSetType.ANY_ITEM: return 2
            default: return 0
          }
        })(set.type))
        output.addInt(randomUnitTable.sets?.length ?? 0)
        randomUnitTable.sets?.forEach(chance => {
          output.addInt(chance.chance)
          chance.objects.forEach(objectId => { output.addChars(objectId) })
        })
      })
    })
  }

  if (formatVersion >= 0x18) {
    output.addInt(infoJson.randomItemTables?.length ?? 0)
    infoJson.randomItemTables?.forEach(randomItemTable => {
      output.addInt(randomItemTable.id)
      output.addString(randomItemTable.name)

      output.addInt(randomItemTable.table?.length ?? 0)
      randomItemTable.table?.forEach(randomItemPool => {
        output.addInt(randomItemPool.length ?? 0)
        randomItemPool.forEach(randomItem => {
          output.addInt(randomItem.chance)
          output.addChars(randomItem.objectId)
        })
      })
    })
  }

  if (formatVersion > 0x19 && formatVersion < 0x1C) {
    output.addInt(scriptLanguageValue)
  }

  return output.getBuffer()
}

export function warToJson (buffer: Buffer): Info {
  const input = new W3Buffer(buffer)

  const formatVersion = input.readInt()

  if (formatVersion < 0 || formatVersion > 33) {
    throw new Error(`Unknown map info format version=${formatVersion}, expected value from range [0, 33]`)
  }

  let mapVersion: integer
  let editorVersion: integer
  if (formatVersion > 0x0F) {
    mapVersion = input.readInt()
    editorVersion = input.readInt()
  } else {
    mapVersion = 0
    editorVersion = 0
  }

  let gameVersion: GameVersion
  if (formatVersion > 0x1A) {
    gameVersion = { major: input.readInt(), minor: input.readInt(), patch: input.readInt(), build: input.readInt() }
  } else {
    gameVersion = { major: 0, minor: 0, patch: 0, build: 0 }
  }

  const name = input.readString()
  const author = input.readString()
  const description = input.readString()
  let recommendedPlayers: string
  if (formatVersion > 0x07) {
    recommendedPlayers = input.readString()
  } else {
    recommendedPlayers = ''
  }

  // Consume some old mystery bits
  if (formatVersion < 0x04) {
    input.readByte()
    input.readFloat()
  } else if (formatVersion < 0x09) {
    input.readFloat()
    input.readByte()
    input.readFloat()
    input.readFloat()
    input.readFloat()
    input.readInt()
  }

  const cameraBounds = [
    input.readFloat(), input.readFloat(),
    input.readFloat(), input.readFloat(),
    input.readFloat(), input.readFloat(),
    input.readFloat(), input.readFloat()
  ]

  let cameraMargins: [integer, integer, integer, integer]
  if (formatVersion > 0x0D) {
    cameraMargins = [input.readInt(), input.readInt(), input.readInt(), input.readInt()]
  } else {
    cameraMargins = [0, 0, 0, 0] // TODO: find default values
  }

  let width: number
  let height: number
  if (formatVersion > 0x00) {
    width = input.readInt()
    height = input.readInt()
  } else {
    width = 0 // TODO: find default value
    height = 0 // TODO: find default value
  }

  let flags
  if (formatVersion > 0x01) {
    if (formatVersion < 0x09) {
      input.readInt() // some mystery field
    }

    flags = input.readInt()
    if (formatVersion < 0x0F) {
      flags |= 0x0800
    }
  } else {
    flags = 0x9810 // TODO: confirm default value
  }

  let tileset: string
  if (formatVersion > 0x07) {
    tileset = input.readChars()
  } else {
    tileset = '\0'
  }

  let loadingScreenImageId = -1
  let loadingScreenImageFile = ''
  let loadingScreenText = ''
  let loadingScreenTitle = ''
  let loadingScreenSubtitle = ''
  if (formatVersion > 0x09) {
    if (formatVersion > 0x10) {
      loadingScreenImageId = input.readInt()
    }
    if (formatVersion < 0x12) {
      input.readString() // unknown string
    } else if (formatVersion > 0x13) {
      loadingScreenImageFile = input.readString()
    }
    loadingScreenText = input.readString()
    if (formatVersion > 0x0A) {
      loadingScreenTitle = input.readString()
      loadingScreenSubtitle = input.readString()
    }
  }

  let prologueScreenImageId = -1
  let prologueScreenImageFile = ''
  let prologueScreenText = ''
  let prologueScreenTitle = ''
  let prologueScreenSubtitle = ''
  if (formatVersion > 0x0C) {
    if (formatVersion > 0x10) {
      prologueScreenImageId = input.readInt()
    }
    if (formatVersion < 0x12) {
      input.readString() // unknown string
    } else if (formatVersion > 0x13) {
      prologueScreenImageFile = input.readString()
    }
    prologueScreenText = input.readString()
    prologueScreenTitle = input.readString()
    prologueScreenSubtitle = input.readString()
  }

  let fogStyle = 0 // TODO: find default
  let fogZStart = 0 // TODO: find default
  let fogZEnd = 0 // TODO: find default
  let fogDensity = 0 // TODO: find default
  let fogColor: [integer, integer, integer, integer] = [0, 0, 0, 0] // TODO: find default
  if (formatVersion > 0x12) {
    fogStyle = input.readInt()
    fogZStart = input.readFloat()
    fogZEnd = input.readFloat()
    fogDensity = input.readFloat()
    fogColor = [input.readByte(), input.readByte(), input.readByte(), input.readByte()] // R G B A
  }

  let globalWeatherEffect = 0 // TODO: find default
  if (formatVersion > 0x14) {
    globalWeatherEffect = input.readInt()
  }

  let customSoundEnvironment = '' // TODO: find default
  if (formatVersion > 0x15) {
    customSoundEnvironment = input.readString()
  }

  let customLightEnvironment = 0 // TODO: find default
  if (formatVersion > 0x16) {
    customLightEnvironment = input.readByte()
  }

  let waterColor: [integer, integer, integer, integer] = [0, 0, 0, 0] // TODO: find default
  if (formatVersion > 0x18) {
    waterColor = [input.readByte(), input.readByte(), input.readByte(), input.readByte()] // R G B A
  }

  let scriptLanguage = 0 // TODO: find default
  if (formatVersion > 0x1B) {
    scriptLanguage = input.readInt()
  }

  let assetMode = 3
  if (formatVersion > 0x1C) {
    assetMode = input.readInt()
    if (assetMode === 0) assetMode = 3
  }

  let mapDataVersion = 0 // TODO: find default
  if (formatVersion > 0x1D) {
    mapDataVersion = input.readInt()
  }

  let forcedDefaultCamDistance = 0 // TODO: find default
  let forcedMaxCamDistance = 0 // TODO: find default
  if (formatVersion > 0x1F) {
    forcedDefaultCamDistance = input.readInt()
    forcedMaxCamDistance = input.readInt()
  }

  let forcedMinCamDistance = 0 // TODO: find default
  if (formatVersion > 0x20) {
    forcedMinCamDistance = input.readInt()
  }

  const players: Player[] = []
  const playerCount = input.readInt()
  for (let i = 0; i < playerCount; i++) {
    const playerSlotId = input.readInt()
    const playerType = input.readInt() // 1=Human, 2=Computer, 3=Neutral, 4=Rescuable
    const playerRace = input.readInt() // 1=Human, 2=Orc, 3=Undead, 4=Night Elf
    const playerFlags = input.readInt() // 00000001 = fixed start position
    const playerName = input.readString()
    const playerStartX = input.readFloat()
    const playerStartY = input.readFloat()

    let allyLowPriorities: PlayerList
    let allyHighPriorities: PlayerList
    if (formatVersion > 0x04) {
      allyLowPriorities = playerBitmapToPlayerList(input.readInt())
      allyHighPriorities = playerBitmapToPlayerList(input.readInt())
    } else {
      allyLowPriorities = []
      allyHighPriorities = []
    }

    let enemyLowPriorities: PlayerList
    let enemyHighPriorities: PlayerList
    if (formatVersion > 0x1E) {
      enemyLowPriorities = playerBitmapToPlayerList(input.readInt())
      enemyHighPriorities = playerBitmapToPlayerList(input.readInt())
    } else {
      enemyLowPriorities = []
      enemyHighPriorities = []
    }

    players.push({
      slotId: playerSlotId,
      type: (type => {
        switch (type) {
          case 1: return PlayerType.HUMAN
          case 2: return PlayerType.COMPUTER
          case 3: return PlayerType.NEUTRAL
          case 4: return PlayerType.RESCUABLE
          default: return PlayerType.HUMAN
        }
      })(playerType),
      race: (race => {
        switch (race) {
          case 0: return Race.RANDOM // Check
          case 1: return Race.HUMAN
          case 2: return Race.ORC
          case 3: return Race.UNDEAD
          case 4: return Race.NIGHT_ELF
          default: return Race.RANDOM
        }
      })(playerRace),
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
  if (formatVersion < 0x03) {
    forces.push({ flags: { allied: false, alliedVictory: false, shareVision: false, shareUnitControl: false, shareAdvUnitControl: false }, players: players.map(it => it.slotId), name: '%s %d' })
  } else {
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
  }

  const upgrades: UpgradeAvailable[] = []
  if (formatVersion >= 0x06) {
    const upgradeCount = input.readInt()
    for (let i = 0; i < upgradeCount; i++) {
      upgrades.push({
        players: playerBitmapToPlayerList(input.readInt()),
        upgradeId: input.readChars(4), // upgrade id (as in UpgradeData.slk)
        level: input.readInt(), // Level of the upgrade for which the availability is changed (this is actually the level - 1, so 1 => 0)
        state: (val => {
          switch (val) {
            case 0: return ResearchState.UNAVAILABLE
            case 1: return ResearchState.AVAILABLE
            case 2: return ResearchState.RESEARCHED
            default: return ResearchState.AVAILABLE
          }
        })(input.readInt())
      })
    }
  }

  const techtree: TechUnavailable[] = []
  if (formatVersion >= 0x07) {
    const techCount = input.readInt()
    for (let i = 0; i < techCount; i++) {
      techtree.push({
        players: playerBitmapToPlayerList(input.readInt()),
        techId: input.readChars(4) // tech id (this can be an item, unit or ability)
      })
    }
  }

  const randomGroups: RandomGroup[] = []
  if (formatVersion >= 0x0C) {
    const randomUnitCount = input.readInt()
    for (let i = 0; i < randomUnitCount; i++) {
      const randomUnitTable: RandomGroup = {
        id: input.readInt(),
        name: input.readString(),
        sets: []
      }
      randomGroups.push(randomUnitTable)

      const objectCount = input.readInt() // Number "m" of positions
      const types: integer[] = []
      for (let j = 0; j < objectCount; j++) {
        types.push(input.readInt())
      }

      const randomGroupSetCount = input.readInt()
      for (let j = 0; j < randomGroupSetCount; j++) {
        const randomGroupSet: RandomGroupSet = {
          type: (type => {
            switch (type) {
              case 0: return RandomGroupSetType.ANY_UNIT
              case 1: return RandomGroupSetType.ANY_BUILDING
              case 2: return RandomGroupSetType.ANY_ITEM
              default: return RandomGroupSetType.ANY_UNIT
            }
          })(types[j]),
          chance: input.readInt(), // Chance of the unit/item (percentage)
          objects: []
        }
        randomUnitTable.sets.push(randomGroupSet)

        for (let k = 0; k < objectCount; k++) {
          randomGroupSet.objects.push(input.readChars(4)) // unit/item id's for this line specified
        }
      }
    }
  }

  const randomItemTables: RandomTable[] = []
  if (formatVersion >= 0x18) {
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
  }

  if (formatVersion > 0x19 && formatVersion < 0x1C) {
    scriptLanguage = input.readInt()
  }

  return {
    mapVersion,
    gameVersion,
    editorVersion,
    scriptLanguage: (scriptLanguage => {
      switch (scriptLanguage) {
        case 0: return ScriptLanguage.JASS
        case 1: return ScriptLanguage.LUA
        default: return ScriptLanguage.JASS
      }
    })(scriptLanguage),
    assetMode: {
      SD: !!(assetMode & 0x01),
      HD: !!(assetMode & 0x02)
    },
    mapDataVersion,
    forcedDefaultCamDistance,
    forcedMaxCamDistance,
    forcedMinCamDistance,
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
        hideMinimapInPreview: !!(flags & 0x01),
        modifyAllyPriorities: !!(flags & 0x02),
        isMeleeMap: !!(flags & 0x04),
        nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium: !!(flags & 0x08),
        maskedPartiallyVisible: !!(flags & 0x10),
        fixedPlayerSetting: !!(flags & 0x20),
        useCustomForces: !!(flags & 0x40),
        useCustomTechtree: !!(flags & 0x80),
        useCustomAbilities: !!(flags & 0x0100),
        useCustomUpgrades: !!(flags & 0x0200),
        mapPropertiesMenuOpenedAtLeastOnce: !!(flags & 0x0400),
        waterWavesOnCliffShores: !!(flags & 0x0800),
        waterWavesOnRollingShores: !!(flags & 0x1000),
        useTerrainFog: !!(flags & 0x2000),
        tftRequired: !!(flags & 0x4000),
        useItemClassificationSystem: !!(flags & 0x8000),
        enableWaterTinting: !!(flags & 0x010000),
        useAccurateProbabilityForCalculations: !!(flags & 0x020000),
        useCustomAbilitySkins: !!(flags & 0x040000),
        disableDenyIcon: !!(flags & 0x080000),
        forceDefaultCameraZoom: !!(flags & 0x100000),
        forceMaxCameraZoom: !!(flags & 0x200000),
        forceMinCameraZoom: !!(flags & 0x400000)
      },
      mainTileType: tileset
    },
    camera: {
      bounds: cameraBounds,
      margins: cameraMargins
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
      path: loadingScreenImageFile,
      text: loadingScreenText,
      title: loadingScreenTitle,
      subtitle: loadingScreenSubtitle
    },
    fog: {
      type: (type => {
        switch (type) {
          case 0: return FogType.LINEAR
          case 1: return FogType.EXPONENTIAL1
          case 2: return FogType.EXPONENTIAL2
          default: return FogType.LINEAR
        }
      })(fogStyle),
      startHeight: fogZStart,
      endHeight: fogZEnd,
      density: fogDensity,
      color: fogColor
    },
    globalWeatherEffect,
    customSoundEnvironment,
    customLightEnvironment,
    waterColor,
    players,
    forces,
    upgrades,
    techtree,
    randomGroups,
    randomItemTables
  } satisfies Info
}
