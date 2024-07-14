enum ContentType {
  HEADER = 'HEADER',
  LIBRARY = 'LIBRARY',
  CATEGORY = 'CATEGORY',
  TRIGGER = 'TRIGGER',
  TRIGGER_SCRIPTED = 'TRIGGER_SCRIPTED',
  COMMENT = 'COMMENT',
  CUSTOM_SCRIPT = 'CUSTOM_SCRIPT',
  VARIABLE = 'VARIABLE'
}

interface TriggerContent {
  name: string
  contentType: ContentType
  // description: string
  // isComment: boolean // probably ignorable?
  // isEnabled: boolean
  // isCustomScript: boolean // probably ignorable?
  // initiallyOff: boolean
  // runOnMapInit: boolean
}

export { ContentType, type TriggerContent }
