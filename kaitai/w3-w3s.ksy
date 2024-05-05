meta:
  id: w3_w3s
  file-extension: w3s
  endian: le
  imports:
    - w3str
seq:
  - id: version
    type: u4
  - id: num_sound
    type: u4
  - id: sound
    type: sound
    repeat: expr
    repeat-expr: num_sound
types:
  sound:
    seq:
      - id: name
        type: w3str
      - id: path
        type: w3str
      - id: eax
        type: w3str
      - id: flags
        size: 4
        type: flags
      - id: fade_in_rate
        type: u4
      - id: fade_out_rate
        type: u4
      - id: volume
        type: s4
      - id: pitch
        type: f4
      - id: pitch_variance
        type: f4
      - id: priority
        type: s4
      - id: channel
        type: s4
        enum: channel
      - id: min_distance
        type: f4
      - id: max_distance
        type: f4
      - id: cutoff_distance
        type: f4
      - id: cone_inside
        type: f4
      - id: cone_outside
        type: f4
      - id: cone_outside_volume
        type: s4
      - id: cone_orientation_x
        type: f4
      - id: cone_orientation_y
        type: f4
      - id: cone_orientation_z
        type: f4
      - id: var_name
        type: w3str
        if: _root.version >= 2
      - id: internal_sound_name
        type: w3str
        if: _root. version >= 2
      - id: sound_path
        type: w3str
        if:  _root.version >= 2
      - id: unknown_9
        type: s4
        if:  _root.version >= 2
      - id: unknown_10
        type: w3str
        if:  _root.version >= 2
      - id: unknown_11
        type: s4
        if:  _root.version >= 2
      - id: unknown_12
        type: w3str
        if:  _root.version >= 2
      - id: unknown_13
        type: s4
        if:  _root.version >= 2
      - id: unknown_14
        type: w3str
        if:  _root.version >= 2
      - id: unknown_15
        type: w3str
        if:  _root.version >= 2
      - id: unknown_16
        type: w3str
        if:  _root.version >= 2
      - id: unknown_17
        type: w3str
        if:  _root.version >= 2
      - id: unknown_18
        type: s4
        if:  _root.version >= 3
  flags:
    seq:
      - id: rest
        type: b1
        repeat: expr
        repeat-expr: 3
      - id: is_imported
        type: b1
      - id: is_music
        type: b1
      - id: stop_when_out_of_range
        type: b1
      - id: is_3d
        type: b1
      - id: is_looping
        type: b1
enums:
  channel:
    -1: default
    0: general
    1: unit_selection
    2: unit_acknowledgement
    3: unit_movement
    4: unit_ready
    5: combat
    6: error
    7: music
    8: user_interface
    9: movement_looping
    10: ambient
    11: animation
    12: building
    13: birth
    14: fire