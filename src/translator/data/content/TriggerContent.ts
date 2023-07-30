enum ContentType {
  HEADER,
  LIBRARY,
  CATEGORY,
  TRIGGER,
  COMMENT,
  CUSTOM_SCRIPT,
  VARIABLE
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
