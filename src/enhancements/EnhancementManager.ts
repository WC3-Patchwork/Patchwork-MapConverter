const EnhancementManager = {
  mergeObjectSkinData: false,
  resolveStrings: false,
  forceResolveStrings: false,
  smartImport: false,
  importFolder: 'imports',
  sourceFolder: 'src',
  triggerDataPath: 'triggerdata.txt',
  ignoreFilelist: 'patchwork.ignore',
  composeTriggers: false,
  scriptExtension: '.lua',
  disabledExtension: '.disabled',
  guiExtension: '.json',
  triggersFilename: 'triggers',
  mapDataExtension: '.json',
  prettify: false,
  containerInfoExtension: '.ini',
  commentExtension: '.txt',
  mapHeaderFilename: 'header',
  generateTargetProfile: false,
  profileOutputPath: 'profile.json',
  chunkifiedTerrainFolder: 'terrain',
  chunkifyMapData: false,
  chunkFileExtension: '.json',
  chunkSize: { sizeX: 10, sizeY: 10, offsetX: 0, offsetY: 0 }
}

export default EnhancementManager