const DoodadDefaults = {
  variation: 0,
  scale: [1, 1, 1],
  groupId: -1,
  flags: {
    fixedZ: false,
    notUsedInScript: true,
    inUnplayableArea: false,
    useModelAxes: false
  },
  life: 100,
  randomItemSetPtr: -1,
  droppedItemSets: [],
  color: -1,
  roll: 0,
  pitch: 0,
  lights: []
}

const SpecialDoodadDefaults = {
  variation: 0
}

export { DoodadDefaults, SpecialDoodadDefaults }