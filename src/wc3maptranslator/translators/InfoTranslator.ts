/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type integer } from '../CommonInterfaces'
import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type ObjectChance, type Force, type GameVersion, type Info, type Player, type RandomGroup, type RandomGroupSet, type RandomTable, type TechUnavailable, type UpgradeAvailable, type PlayerList } from '../data/Info'

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

export function jsonToWar (infoJson: Info): Buffer {
  const outBufferToWar = new HexBuffer()

  outBufferToWar.addInt(33) // format version
  outBufferToWar.addInt(infoJson.mapVersion != null ? infoJson.mapVersion : 0)
  outBufferToWar.addInt(infoJson.editorVersion != null ? infoJson.editorVersion : 0)

  outBufferToWar.addInt(infoJson.gameVersion.major)
  outBufferToWar.addInt(infoJson.gameVersion.minor)
  outBufferToWar.addInt(infoJson.gameVersion.patch)
  outBufferToWar.addInt(infoJson.gameVersion.build)

  // Map information
  outBufferToWar.addString(infoJson.map.name)
  outBufferToWar.addString(infoJson.map.author)
  outBufferToWar.addString(infoJson.map.description)
  outBufferToWar.addString(infoJson.map.recommendedPlayers)

  // Camera bounds (8 floats total)
  for (let cbIndex = 0; cbIndex < 8; cbIndex++) {
    outBufferToWar.addFloat(infoJson.camera.bounds[cbIndex])
  }

  // Camera complements (4 ints total)
  for (let ccIndex = 0; ccIndex < 4; ccIndex++) {
    outBufferToWar.addInt(infoJson.camera.margins[ccIndex])
  }

  // Playable area
  outBufferToWar.addInt(infoJson.map.playableArea.width)
  outBufferToWar.addInt(infoJson.map.playableArea.height)

  /*
  * Flags
  */
  let flags = 0
  if (infoJson.map.flags != null) { // can leave out the entire flags object, all flags will default to false
    if (infoJson.map.flags.hideMinimapInPreview) flags |= 0x0001 // hide minimap in preview screens
    if (infoJson.map.flags.modifyAllyPriorities) flags |= 0x0002 // modify ally priorities
    if (infoJson.map.flags.isMeleeMap) flags |= 0x0004 // melee map
    if (infoJson.map.flags.nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium) flags |= 0x0008 // playable map size was large and never reduced to medium (?)
    if (infoJson.map.flags.maskedPartiallyVisible) flags |= 0x0010 // masked area are partially visible
    if (infoJson.map.flags.fixedPlayerSetting) flags |= 0x0020 // fixed player setting for custom forces
    if (infoJson.map.flags.useCustomForces) flags |= 0x0040 // use custom forces
    if (infoJson.map.flags.useCustomTechtree) flags |= 0x0080 // use custom techtree
    if (infoJson.map.flags.useCustomAbilities) flags |= 0x0100 // use custom abilities
    if (infoJson.map.flags.useCustomUpgrades) flags |= 0x0200 // use custom upgrades
    if (infoJson.map.flags.mapPropertiesMenuOpenedAtLeastOnce) flags |= 0x0400 // map properties menu opened at least once since map creation (?)
    if (infoJson.map.flags.waterWavesOnCliffShores) flags |= 0x0800 // show water waves on cliff shores
    if (infoJson.map.flags.waterWavesOnRollingShores) flags |= 0x1000 // show water waves on rolling shores
    if (infoJson.map.flags.useTerrainFog) flags |= 0x2000
    if (infoJson.map.flags.tftRequired) flags |= 0x4000
    if (infoJson.map.flags.useItemClassificationSystem) flags |= 0x8000
    if (infoJson.map.flags.enableWaterTinting) flags |= 0x10000
    if (infoJson.map.flags.useAccurateProbabilityForCalculations) flags |= 0x20000
    if (infoJson.map.flags.useCustomAbilitySkins) flags |= 0x40000
    if (infoJson.map.flags.disableDenyIcon) flags |= 0x80000
    if (infoJson.map.flags.forceDefaultCameraZoom) flags |= 0x100000
    if (infoJson.map.flags.forceMaxCameraZoom) flags |= 0x200000
    if (infoJson.map.flags.forceMinCameraZoom) flags |= 0x400000
    // 0x800000
    // 8 -unknown bits?
  }

  outBufferToWar.addInt(flags) // Add flags - default 0x9810

  // Map main ground type
  outBufferToWar.addChar(infoJson.map.mainTileType ?? 0)

  // Loading screen
  outBufferToWar.addInt(infoJson.loadingScreen.imageId)
  outBufferToWar.addString(infoJson.loadingScreen.path)
  outBufferToWar.addString(infoJson.loadingScreen.text)
  outBufferToWar.addString(infoJson.loadingScreen.title)
  outBufferToWar.addString(infoJson.loadingScreen.subtitle)

  // Use game data set
  outBufferToWar.addInt(infoJson.gameDataSet)

  // Prologue
  outBufferToWar.addString(infoJson.prologue.path)
  outBufferToWar.addString(infoJson.prologue.text)
  outBufferToWar.addString(infoJson.prologue.title)
  outBufferToWar.addString(infoJson.prologue.subtitle)

  // Fog
  outBufferToWar.addInt(infoJson.fog.type)
  outBufferToWar.addFloat(infoJson.fog.startHeight)
  outBufferToWar.addFloat(infoJson.fog.endHeight)
  outBufferToWar.addFloat(infoJson.fog.density)
  outBufferToWar.addByte(infoJson.fog.color[0])
  outBufferToWar.addByte(infoJson.fog.color[1])
  outBufferToWar.addByte(infoJson.fog.color[2])
  outBufferToWar.addByte(infoJson.fog.color[3])

  // Misc.
  // // If globalWeather is not defined or is set to 'none', use 0 sentinel value, else add char[4] -- why this distinct crap? it just breaks the w3i for me.
  // if (infoJson.globalWeather == null || infoJson.globalWeather.toLowerCase() === 'none') {
  //   outBufferToWar.addInt(0)
  // } else {
  outBufferToWar.addInt(infoJson.globalWeatherEffect)
  // }
  outBufferToWar.addString(infoJson.customSoundEnvironment != null ? infoJson.customSoundEnvironment : '')
  outBufferToWar.addByte(infoJson.customLightEnvironment)

  // Custom water tinting
  outBufferToWar.addByte(infoJson.waterColor[0])
  outBufferToWar.addByte(infoJson.waterColor[1])
  outBufferToWar.addByte(infoJson.waterColor[2])
  outBufferToWar.addByte(infoJson.waterColor[3])

  outBufferToWar.addInt(infoJson.scriptLanguage)
  outBufferToWar.addInt(infoJson.assetMode)
  outBufferToWar.addInt(infoJson.mapDataVersion)
  outBufferToWar.addInt(infoJson.forcedDefaultCamDistance)
  outBufferToWar.addInt(infoJson.forcedMaxCamDistance)
  outBufferToWar.addInt(infoJson.forcedMinCamDistance)

  // Players
  outBufferToWar.addInt(infoJson.players?.length ?? 0)
  infoJson.players?.forEach((player) => {
    outBufferToWar.addInt(player.slotId)
    outBufferToWar.addInt(player.type)
    outBufferToWar.addInt(player.race)
    outBufferToWar.addInt(player.startLocation.fixed ? 1 : 0)
    outBufferToWar.addString(player.name)
    outBufferToWar.addFloat(player.startLocation.x)
    outBufferToWar.addFloat(player.startLocation.y)
    outBufferToWar.addInt(playerListToPlayerBitmap(player.allyLowPriorities))
    outBufferToWar.addInt(playerListToPlayerBitmap(player.allyHighPriorities))
    outBufferToWar.addInt(playerListToPlayerBitmap(player.enemyLowPriorities))
    outBufferToWar.addInt(playerListToPlayerBitmap(player.enemyHighPriorities))
  })

  const undefinedPlayersBitMask = ~(infoJson.players?.map(it => 1 << it.slotId).reduce((acc, it) => acc | it) ?? 0)

  // Forces
  outBufferToWar.addInt(infoJson.forces?.length ?? 0)
  let firstForce = true
  infoJson.forces?.forEach((force) => {
    // Calculate flags
    let forceFlags = 0
    if (force.flags.allied) forceFlags |= 0x0001
    if (force.flags.alliedVictory) forceFlags |= 0x0002
    // Skip 0x0004
    if (force.flags.shareVision) forceFlags |= 0x0008
    if (force.flags.shareUnitControl) forceFlags |= 0x0010
    if (force.flags.shareAdvUnitControl) forceFlags |= 0x0020

    outBufferToWar.addInt(forceFlags)

    const forcePlayerbitmap = playerListToPlayerBitmap(force.players)
    // First force must contain undefined players so they get automatically added in case they do get defined.
    if (firstForce) {
      outBufferToWar.addInt(forcePlayerbitmap | undefinedPlayersBitMask)
    } else {
      outBufferToWar.addInt(forcePlayerbitmap)
    }

    outBufferToWar.addString(force.name)
    firstForce = false
  })

  // Struct: upgrade avail.
  outBufferToWar.addInt(infoJson.upgrades?.length ?? 0)
  infoJson.upgrades?.forEach(upgrade => {
    outBufferToWar.addInt(playerListToPlayerBitmap(upgrade.players))
    outBufferToWar.addChars(upgrade.upgradeId)
    outBufferToWar.addInt(upgrade.level)
    outBufferToWar.addInt(upgrade.state)
  })

  // Struct: tech avail.
  outBufferToWar.addInt(infoJson.techtree?.length ?? 0)
  infoJson.techtree?.forEach(tech => {
    outBufferToWar.addInt(playerListToPlayerBitmap(tech.players))
    outBufferToWar.addChars(tech.techId)
  })

  // Struct: random unit table
  outBufferToWar.addInt(infoJson.randomGroups?.length ?? 0)
  infoJson.randomGroups?.forEach(randomUnitTable => {
    outBufferToWar.addInt(randomUnitTable.id)
    outBufferToWar.addString(randomUnitTable.name)

    outBufferToWar.addInt(randomUnitTable.positions?.length ?? 0)
    randomUnitTable.positions?.forEach(position => { outBufferToWar.addInt(position) })

    outBufferToWar.addInt(randomUnitTable.sets?.length ?? 0)
    randomUnitTable.sets?.forEach(chance => {
      outBufferToWar.addInt(chance.chance)
      chance.objects.forEach(objectId => { outBufferToWar.addChars(objectId) }) // Amount of units must match amount of positions
    })
  })

  // Struct: random item table
  outBufferToWar.addInt(infoJson.randomItemTables?.length ?? 0)
  infoJson.randomItemTables?.forEach(randomItemTable => {
    outBufferToWar.addInt(randomItemTable.id)
    outBufferToWar.addString(randomItemTable.name)

    outBufferToWar.addInt(randomItemTable.table?.length ?? 0)
    randomItemTable.table?.forEach(randomItemPool => {
      outBufferToWar.addInt(randomItemPool.length ?? 0)
      randomItemPool.forEach(randomItem => {
        outBufferToWar.addInt(randomItem.chance)
        outBufferToWar.addChars(randomItem.objectId)
      })
    })
  })
  return outBufferToWar.getBuffer()
}

export function warToJson (buffer: Buffer): Info {
  const input = new W3Buffer(buffer)

  const formatVersion = input.readInt()

  if (formatVersion > 33) {
    throw new Error(`Unknown map info format version=${formatVersion}, expected under 34`)
  }

  let mapVersion: integer
  let editorVersion: integer
  if (formatVersion > 0xF) {
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
  if (formatVersion > 7) {
    recommendedPlayers = input.readString()
  } else {
    recommendedPlayers = ''
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

  const cameraBounds = [
    input.readFloat(), input.readFloat(),
    input.readFloat(), input.readFloat(),
    input.readFloat(), input.readFloat(),
    input.readFloat(), input.readFloat()
  ]

  let cameraMargins: [integer, integer, integer, integer]
  if (formatVersion > 0xD) {
    cameraMargins = [input.readInt(), input.readInt(), input.readInt(), input.readInt()]
  } else {
    cameraMargins = [0, 0, 0, 0] // TODO: find default values
  }

  let width: number
  let height: number
  if (formatVersion !== 0) {
    width = input.readInt()
    height = input.readInt()
  } else {
    width = 0 // TODO: find default value
    height = 0 // TODO: find default value
  }

  let flags
  if (formatVersion > 1) {
    if (formatVersion < 9) {
      input.readInt() // some mystery field
    }

    flags = input.readInt()
    if (formatVersion < 0xF) {
      flags |= 0x800
    }
  } else {
    flags = 0 // TODO: find default value
  }

  let tileset: string
  if (formatVersion > 7) {
    tileset = input.readChars()
  } else {
    tileset = '\0'
  }

  let loadingScreenImageId = -1
  let loadingScreenImageFile = ''
  let loadingScreenText = ''
  let loadingScreenTitle = ''
  let loadingScreenSubtitle = ''
  if (formatVersion > 9) {
    if (formatVersion > 0x10) {
      loadingScreenImageId = input.readInt()
    }
    if (formatVersion < 0x12) {
      input.readString() // unknown string
    } else if (formatVersion > 0x13) {
      loadingScreenImageFile = input.readString()
    }
    loadingScreenText = input.readString()
    if (formatVersion > 10) {
      loadingScreenTitle = input.readString()
      loadingScreenSubtitle = input.readString()
    }
  }

  let prologueScreenImageId = -1
  let prologueScreenImageFile = ''
  let prologueScreenText = ''
  let prologueScreenTitle = ''
  let prologueScreenSubtitle = ''
  if (formatVersion > 9) {
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
  let fogColor = [0, 0, 0, 0] // TODO: find default
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

  let waterColor = [0, 0, 0, 0] // TODO: find default
  if (formatVersion > 0x18) {
    waterColor = [input.readByte(), input.readByte(), input.readByte(), input.readByte()] // R G B A
  }

  let scriptLanguage = 0 // TODO: find default
  if (formatVersion > 0x1B) {
    scriptLanguage = input.readInt()
  }

  let assetMode = 0 // TODO: find default
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
    const playerStartLocation = [input.readFloat(), input.readFloat()]

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
      type: playerType,
      race: playerRace,
      name: playerName,
      startLocation: {
        x: playerStartLocation[0],
        y: playerStartLocation[1],
        fixed: !!(playerFlags & 1)
      },
      allyLowPriorities,
      allyHighPriorities,
      enemyLowPriorities,
      enemyHighPriorities
    })
  }

  const forces: Force[] = []
  if (formatVersion < 3) {
    forces.push({ flags: { allied: false, alliedVictory: false, shareVision: false, shareUnitControl: false, shareAdvUnitControl: false }, players: players.map(it => it.slotId), name: '%s %d' })
  } else {
    const forceCount = input.readInt()
    for (let i = 0; i < forceCount; i++) {
      const forceFlag = input.readInt()
      forces.push({
        flags: {
          allied: !!(forceFlag & 0b1), // 0x00000001: allied (force 1)
          alliedVictory: !!(forceFlag & 0b10), // 0x00000002: allied victory
          // 0x00000004: share vision (the documentation has this incorrect)
          shareVision: !!(forceFlag & 0b1000), // 0x00000008: share vision
          shareUnitControl: !!(forceFlag & 0b10000), // 0x00000010: share unit control
          shareAdvUnitControl: !!(forceFlag & 0b100000) // 0x00000020: share advanced unit control
        },
        players: playerBitmapToPlayerList(input.readInt()),
        name: input.readString()
      })
    }
  }

  const upgrades: UpgradeAvailable[] = []
  if (formatVersion >= 6) {
    const upgradeCount = input.readInt()
    for (let i = 0; i < upgradeCount; i++) {
      upgrades.push({
        players: playerBitmapToPlayerList(input.readInt()),
        upgradeId: input.readChars(4), // upgrade id (as in UpgradeData.slk)
        level: input.readInt(), // Level of the upgrade for which the availability is changed (this is actually the level - 1, so 1 => 0)
        state: input.readInt() // Availability (0 = unavailable, 1 = available, 2 = researched)
      })
    }
  }

  const techtree: TechUnavailable[] = []
  if (formatVersion >= 7) {
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
        id: input.readInt(), // Group number
        name: input.readString(), // Group name
        positions: [],
        sets: []
      }
      randomGroups.push(randomUnitTable)

      const objectCount = input.readInt() // Number "m" of positions
      const positions: number[] = randomUnitTable.positions = []
      for (let j = 0; j < objectCount; j++) {
        positions.push(input.readInt()) // Apparently, the following is false: unit table (=0), a building table (=1) or an item table (=2)
      }

      const randomGroupSetCount = input.readInt()
      for (let j = 0; j < randomGroupSetCount; j++) {
        const randomGroupSet: RandomGroupSet = {
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
    scriptLanguage,
    assetMode,
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
        hideMinimapInPreview: !!(flags & 0x0001),
        modifyAllyPriorities: !!(flags & 0x0002),
        isMeleeMap: !!(flags & 0x0004),
        nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium: !!(flags & 0x0008),
        maskedPartiallyVisible: !!(flags & 0x0010),
        fixedPlayerSetting: !!(flags & 0x0020),
        useCustomForces: !!(flags & 0x0040),
        useCustomTechtree: !!(flags & 0x0080),
        useCustomAbilities: !!(flags & 0x0100),
        useCustomUpgrades: !!(flags & 0x0200),
        mapPropertiesMenuOpenedAtLeastOnce: !!(flags & 0x0400),
        waterWavesOnCliffShores: !!(flags & 0x0800),
        waterWavesOnRollingShores: !!(flags & 0x1000),
        useTerrainFog: !!(flags & 0x2000),
        tftRequired: !!(flags & 0x4000),
        useItemClassificationSystem: !!(flags & 0x8000),
        enableWaterTinting: !!(flags & 0x10000),
        useAccurateProbabilityForCalculations: !!(flags & 0x20000),
        useCustomAbilitySkins: !!(flags & 0x40000),
        disableDenyIcon: !!(flags & 0x80000),
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
      type: fogStyle,
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
