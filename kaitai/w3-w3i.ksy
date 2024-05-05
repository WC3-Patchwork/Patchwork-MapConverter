meta:
  id: w3_w3i
  file-extension: w3i
  endian: le
  imports:
    - w3id
    - w3str
    - w3char
seq:
  - id: version
    type: u4
    doc: The version of the format.
  - id: saves
    type: u4
    if: version >= 16
    doc: How many times the map was saved in the editor.
  - id: editor_version
    type: u4
    if: version >= 16
    doc: What version of the editor was used to make this file.
  - id: game_version
    type: game_version
    if: version >= 27
    doc: For what version of the game this file was made.
  - id: map_name_raw
    type: w3str
  - id: author
    type: w3str
  - id: description
    type: w3str
  - id: recommended_players
    type: w3str
    if: version >= 8
  - id: unknown_v0_to_v3
    type: unknown_v0_to_v3
    if: version <= 3
  - id: unknown_v4_to_v8
    type: unknown_v4_to_v8
    if: version > 3 and version <= 8
  - id: camera_bounds
    type: camera_bounds
  - id: margins
    type: margins
    if: version >= 14
  - id: map_width
    type: u4
    if: version >= 1
  - id: map_height
    type: u4
    if: version >= 1
  - id: unknown_v3_int1
    type: u4
    if: version >= 2 and version <= 8
  - id: flags
    type: flags
    if: version >= 2
  - id: tileset
    type: u1
    enum: tileset
    if: version >= 8
  - id: loading_screen
    type: loading_screen
  - id: game_data_set
    type: u4
    enum: game_data_set
    if: version >= 17
  - id: unknown_path
    type: w3str
    if: version <= 17
  - id: prologue_screen
    type: prologue_screen
    if: version >= 13
  - id: fog
    type: fog
    if: version >= 19
  - id: global_weather_id
    type: w3id
    if: version >= 21
  - id: sound_environment
    type: w3str
    if: version >= 22
  - id: light_environment
    type: w3char
    if: version >= 23
  - id: water_color
    type: water_color
    if: version >= 25
  - id: script_language
    type: u4
    enum: script_language
    if: version >= 28
  - id: supported_graphics_modes
    type: graphics_modes
    size: 4
    if: version >= 29
  - id: game_data_version
    type: u4
    enum: game_data_version
    if: version >= 30
  - id: players_chunk
    type: players_chunk
  - id: forces_chunk
    type: forces_chunk
  - id: upgrades_chunk
    type: upgrades_chunk
    if: version >= 6
  - id: techs_chunk
    type: techs_chunk
    if: version >= 7
  - id: random_unit_tables_chunk
    type: random_unit_tables_chunk
    if: version >= 12
  - id: random_item_tables_chunk
    type: random_item_tables_chunk
    if: version >= 24
  - id: script_language2
    type: u4
    #if: false
    if: version == 26 or version == 27

types:
  point_2d:
    seq:
      - id: x
        type: f4
      - id: y
        type: f4
  game_version:
    seq:
      - id: major
        type: u4
      - id: minor
        type: u4
      - id: revision
        type: u4
      - id: build
        type: u4
  unknown_v0_to_v3:
    seq:
      - id: unknown_v0_int1
        type: u4
      - id: unknown_v0_int2
        type: u4
  unknown_v4_to_v8:
    seq:
      - id: unknown_v4_int1
        type: u4
      - id: unknown_v4_int2
        type: u4
      - id: unknown_v4_int3
        type: u4
      - id: unknown_v4_float1
        type: f4
      - id: unknown_v4_float2
        type: f4
      - id: unknown_v4_float3
        type: f4
  camera_bounds:
    seq:
      - id: camera_bound_bottom_left
        type: point_2d
      - id: camera_bound_top_right
        type: point_2d
      - id: camera_bound_top_left
        type: point_2d
      - id: camera_bound_bottom_right
        type: point_2d
  margins:
    seq:
      - id: left
        type: s4
      - id: right
        type: s4
      - id: bottom
        type: s4
      - id: top
        type: s4
  flags:
    seq:
      - id: use_custom_techs
        type: b1
      - id: use_custom_teams
        type: b1
      - id: fixed_player_parameters_for_custom_teams
        type: b1
      - id: unexplored_areas_partially_visible
        type: b1
      - id: non_default_tileset_map_size_large_never_been_reduced_to_medium
        type: b1
      - id: melee
        type: b1
      - id: change_ally_priorities
        type: b1
      - id: hide_minimap_on_preview_screens
        type: b1

      - id: use_item_classification_system
        type: b1
      - id: tft_required
        type: b1
      - id: use_terrain_fog
        type: b1
      - id: show_water_waves_on_rolling_shores
        type: b1
      - id: show_water_waves_on_cliff_shores
        type: b1
      - id: map_properties_menu_opened_at_least_once
        type: b1
      - id: use_custom_upgrades
        type: b1
      - id: use_custom_abilities
        type: b1

      - id: custom_water_tint_color
        type: b1
      - id: flag17
        type: b1
      - id: flag18
        type: b1
      - id: flag19
        type: b1
      - id: flag20
        type: b1
      - id: use_custom_ability_skin
        type: b1
      - id: use_accurate_probabilities_for_calculation
        type: b1

      - id: rest
        type: b1
        repeat: expr
        repeat-expr: 8
  loading_screen:
    seq:
      - id: loading_screen_index
        type: s4
        if: _root.version >= 17
      - id: custom_loading_screen_path
        type: w3str
        if: _root.version >= 10 and _root.version != 18 and _root.version != 19
      - id: loading_screen_text
        type: w3str
        if: _root.version >= 10
      - id: loading_screen_title
        type: w3str
        if: _root.version >= 11
      - id: loading_screen_subtitle
        type: w3str
        if: _root.version >= 11
  prologue_screen:
    seq:
      - id: prologue_screen_path
        type: w3str
        if: _root.version != 18 and _root.version != 19
      - id: prologue_screen_text
        type: w3str
      - id: prologue_screen_title
        type: w3str
      - id: prologue_screen_subtitle
        type: w3str
  fog:
    seq:
      - id: fog_type
        type: u4
        enum: fog_type
      - id: fog_z_start
        type: f4
      - id: fog_z_end
        type: f4
      - id: fog_density
        type: f4
      - id: fog_color_red
        type: u1
      - id: fog_color_green
        type: u1
      - id: fog_color_blue
        type: u1
      - id: fog_color_alpha
        type: u1
  water_color:
    seq:
      - id: red
        type: u1
        doc: red value 0-255
      - id: green
        type: u1
        doc: green value 0-255
      - id: blue
        type: u1
        doc: blue value 0-255
      - id: alpha
        type: u1
        doc: alpha value 0-255
  graphics_modes:
    seq:
      - id: rest
        type: b1
        repeat: expr
        repeat-expr: 6
      - id: sd
        type: b1
      - id: hd
        type: b1
  players_chunk:
    seq:
      - id: num_player
        type: u4
      - id: player
        type: player
        repeat: expr
        repeat-expr: num_player
  player:
    seq:
      - id: num
        type: u4
      - id: controller
        type: u4
        enum: player_controller
      - id: race
        type: u4
        enum: player_race
      - id: fixed_position
        type: u4
      - id: name
        type: w3str
      - id: position
        type: point_2d
      - id: ally_low_priority
        type: player_bitmap
        if: _root.version >= 5
      - id: ally_high_priority
        type: player_bitmap
        if: _root.version >= 5
      - id: enemy_low_priority
        type: player_bitmap
        if: _root.version >= 31
      - id: enemy_high_priority
        type: player_bitmap
        if: _root.version >= 31
  forces_chunk:
    seq:
      - id: num_force
        type: u4
      - id: force
        type: force
        repeat: expr
        repeat-expr: num_force
  force:
    seq:
      - id: flags
        type: force_flags
      - id: players
        type: player_bitmap
      - id: name
        type: w3str
  force_flags:
    seq:
      - id: bits
        type: force_flags_bits
        size: 4
  force_flags_bits:
    seq:
      - id: flag7
        type: b1
      - id: flag6
        type: b1
      - id: flag5
        type: b1
      - id: share_advanced_unit_control
        type: b1
      - id: share_unit_control
        type: b1
      - id: share_vision
        type: b1
      - id: allied_victory
        type: b1
      - id: allied
        type: b1
      - id: rest
        type: u1
        repeat: expr
        repeat-expr: 3
  player_bitmap:
    seq:
      - id: bits
        type: player_bitmap_bits
        size: 4
  player_bitmap_bits:
    seq:
      - id: is_member
        type: b1
        repeat: expr
        repeat-expr: 32
  upgrades_chunk:
    seq:
      - id: num_upgrade
        type: u4
      - id: upgrade
        type: upgrade
        repeat: expr
        repeat-expr: num_upgrade
  upgrade:
    seq:
      - id: players
        type: u4
      - id: id
        type: w3id
      - id: level
        type: u4
      - id: availability
        type: u4
  techs_chunk:
    seq:
      - id: num_tech
        type: u4
      - id: tech
        type: tech
        repeat: expr
        repeat-expr: num_tech
  tech:
    seq:
      - id: players
        type: u4
      - id: id
        type: w3id
  random_unit_tables_chunk:
    seq:
      - id: num_table
        type: u4
      - id: table
        type: random_unit_table
        repeat: expr
        repeat-expr: num_table
  random_unit_table:
    seq:
      - id: index
        type: u4
      - id: name
        type: w3str
      - id: num_column_type
        type: u4
      - id: column_type
        type: u4
        enum: random_unit_table_column_type
        repeat: expr
        repeat-expr: num_column_type
      - id: num_row
        type: u4
      - id: row
        type: random_unit_table_row
        repeat: expr
        repeat-expr: num_row
  random_unit_table_row:
    seq:
      - id: chance
        type: u4
      - id: id
        type: w3id
        repeat: expr
        repeat-expr: _parent.num_column_type
  random_item_tables_chunk:
    seq:
      - id: num_table
        type: u4
      - id: table
        type: random_item_table
        repeat: expr
        repeat-expr: num_table
  random_item_table:
    seq:
      - id: num
        type: u4
      - id: name
        type: w3str
      - id: num_set
        type: u4
      - id: set
        type: item_set
        repeat: expr
        repeat-expr: num_set
  item_set:
    seq:
      - id: num_item
        type: u4
      - id: item
        type: item
        repeat: expr
        repeat-expr: num_item
  item:
    seq:
      - id: chance
        type: u4
        doc: Chance this item will be rolled.
      - id: id
        type: w3id
        doc: FourCC of the item, can be iRND for random item.
enums:
  tileset:
    0x41: ashenvale
    0x42: barrens
    0x43: felwood
    0x44: dungeon
    0x46: lordaeron_fall
    0x47: underground
    0x49: icecrown
    0x4a: dalaran_ruins
    0x4b: black_citadel
    0x4c: lordaeron_summer
    0x4e: northrend
    0x4f: outland
    0x51: village_fall
    0x56: village
    0x57: lordaeron_winter
    0x58: dalaran
    0x59: cityscape
    0x5a: sunken_ruins
  game_data_set:
    0: default
    1: custom
    2: melee
  fog_type:
    0: linear
    1: exp
    2: exp2
  script_language:
    0: jass
    1: lua
  game_data_version:
    0: roc
    1: tft
  player_controller:
    0: none
    1: human
    2: cpu
    3: neutral
    4: rescuable
  player_race:
    0: selectable
    1: human
    2: orc
    3: undead
    4: night_elf
  random_unit_table_column_type:
    0: unit_table
    1: building_table
    2: item_table
instances:
  map_name:
    value: map_name_raw.value
    doc: Name of the map.