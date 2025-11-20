const EnhancementManager = {
  smartImport           : false,
  importFolder          : 'imports',
  sourceFolder          : 'src',
  triggerDataPath       : 'triggerdata.txt',
  ignoreFilelist        : 'patchwork.ignore',
  composeTriggers       : false,
  scriptExtension       : '.lua',
  disabledExtension     : '.disabled',
  guiExtension          : '.json',
  mapDataExtension      : '.json',
  prettify              : false,
  containerInfoExtension: '.ini',
  commentExtension      : '.txt',
  mapHeaderFilename     : 'header',
  generateTargetProfile : false,
  chunkifyMapData       : false,
  chunkFileExtension    : '.json',
  chunkSize             : { sizeX: 1, sizeY: 1, offsetX: 0, offsetY: 0 }
}

export default EnhancementManager