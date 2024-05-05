meta:
  id: w3_w3f
  file-extension: w3f
  endian: le
  imports:
    - w3str
seq:
  - id: version
    type: u4
  - id: saves
    type: u4
  - id: editor_version
    type: u4
  - id: name
    type: w3str
  - id: difficulty
    type: w3str
  - id: author
    type: w3str
  - id: description
    type: w3str
  - id: variable_difficulty_levels_flag_and_expansion_flag
    type: u4
    enum: variable_difficulty_levels_flag_and_expansion_flag
  - id: background_screen_index
    type: u4
  - id: background_screen_path
    type: w3str
  - id: minimap_picture_path
    type: w3str
  - id: ambient_sound_index
    type: u4
  - id: custom_ambient_sound_path
    type: w3str
  - id: use_terrain_fog
    type: u4
  - id: fog_z_height
    type: f4
  - id: fog_z_end
    type: f4
  - id: fog_density
    type: f4
  - id: fog_red
    type: u1
  - id: fog_green
    type: u1
  - id: fog_blue
    type: u1
  - id: fog_alpha
    type: u1
  - id: cursor_race_index
    type: u4
  - id: num_map
    type: u4
  - id: map
    type: w3_map
    repeat: expr
    repeat-expr: num_map
  - id: num_map_order
    type: u4
  - id: map_order
    type: w3_map_order
    repeat: expr
    repeat-expr: num_map_order
types:
  w3_map:
    seq:
      - id: visibility
        type: u4
        enum: map_visibility
      - id: chapter_title
        type: w3str
      - id: map_title
        type: w3str
      - id: path
        type: w3str
  w3_map_order:
    seq:
      - id: unknown
        type: w3str
      - id: path
        type: w3str
enums:
  variable_difficulty_levels_flag_and_expansion_flag:
    0: fixed
    1: variable
    2: fixed_w3x
    3: variable_w3x
  map_visibility:
    0: invisible
    1: visible