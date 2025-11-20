const DoodadDefaults = {
  variation: 0,
  scale    : [1, 1, 1],
  flags    : {
    fixedZ          : false,
    notUsedInScript : true,
    inUnplayableArea: false
  },
  life            : 100,
  randomItemSetPtr: -1,
  droppedItemSets : []
}

export { DoodadDefaults }