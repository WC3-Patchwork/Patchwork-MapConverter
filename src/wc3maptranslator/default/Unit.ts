const UnitDefaults = {
  variation: 0,
  scale: [1, 1, 1],
  // skinId: whatever 'type' is,
  groupId: -1,
  flags: {
    fixedZ: false,
    isUprooted: false,
    useModelAxes: false
  },
  hitpoints: -1,
  mana: 0,
  randomItemSetPtr: -1,
  droppedItemSets: [],
  gold: 0,
  targetAcquisition: -1,
  hero: {
    level: 1,
    str: 1,
    agi: 1,
    int: 1
  },
  inventory: [],
  abilities: [],
  // color: whatever 'player' is,
  random: {
    type: -1,
    unitSet: []
  },
  waygate: -1,
  // id: generated somehow
  roll: 0,
  pitch: 0,
  lights: []
}

export { UnitDefaults }