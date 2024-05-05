meta:
  id: w3_wgc
  file-extension: wgc
  endian: le
  imports:
    - w3str
seq:
  - id: version
    type: u4
    enum: version
  - id: flags
    type: flags
    size: 4
  - id: base_game_speed
    type: u4
  - id: relative_map_path
    type: w3str
  - id: num_player
    type: u4
  - id: player
    type: player
    repeat: expr
    repeat-expr: num_player
types:
  flags:
    seq:
      - id: victory_defeat_conditions
        type: b1
      - id: fog_of_war
        type: b1
  player:
    seq:
      - id: slot_index
        type: u4
      - id: force_index
        type: u4
      - id: race
        type: u4
        enum: race
      - id: color
        type: u4
      - id: handicap
        type: u4
      - id: player_slot_flags
        type: player_slot_flags
        size: 4
      - id: ai_difficulty
        type: u4
        enum: ai_difficulty
      - id: custom_ai_script_path
        type: w3str
  player_slot_flags:
    seq:
      - id: rest
        type: b1
        repeat: expr
        repeat-expr: 4
      - id: ai_file_path_is_absolute
        type: b1
      - id: use_custom_ai_file
        type: b1
      - id: is_observer
        type: b1
      - id: is_user
        type: b1
enums:
  version:
    0: roc
    1: tft
  race:
    0x01: human
    0x02: orc
    0x04: night_elf
    0x08: undead
    0x20: random
  ai_difficulty:
    0: easy
    1: normal
    2: hard