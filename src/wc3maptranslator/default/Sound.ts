import { SoundChannel } from '../data'

const SoundDefaults = {
  'eax'  : SoundChannel.GENERAL,
  'flags': {
    'looping'       : false,
    '3dSound'       : false,
    'stopOutOfRange': false,
    'music'         : false,
    'customImported': false
  },
  'fadeRate': {
    in : 0,
    out: 0
  },
  'volume'       : 105,
  'pitch'        : 1.0,
  'pitchVariance': 0xFFFFFFFF,
  'priority'     : 10,
  'channel'      : SoundChannel.GENERAL,
  '3d'           : {
    distance: {
      min   : 0xFFFFFFFF,
      max   : 0xFFFFFFFF,
      cutoff: 10000
    },
    cone: {
      insideAngle  : 0xFFFFFFFF,
      outsideAngle : 0xFFFFFFFF,
      outsideVolume: -1,
      orientation  : [0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF]
    }
  },
  'labelSLK'                         : '',
  'dialogueId'                       : -1,
  'productionComments'               : '',
  'speakerNameId'                    : -1,
  'listenerName'                     : '',
  'assetFlags'                       : 0, // Editor has no use for these
  'speakerUnitId'                    : '',
  'animationLabel'                   : '',
  'animationGroup'                   : '',
  'animationSetFilepath'             : '',
  'animationSetFilepathIsMapRelative': true
}

export { SoundDefaults }