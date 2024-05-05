meta:
  id: w3_w3e
  file-extension: w3e
  endian: le
  imports:
    - w3id
seq:
  - id: file_id
    type: w3id
  - id: version
    type: u4
  - id: tileset
    type: u1
    enum: tileset
  - id: use_custom_tileset
    type: u4
  - id: num_tile_id
    type: u4
  - id: tile_id
    type: w3id
    repeat: expr
    repeat-expr: num_tile_id
  - id: num_cliff_tile_id
    type: u4
  - id: cliff_tile_id
    type: w3id
    repeat: expr
    repeat-expr: num_cliff_tile_id
  - id: map_width
    type: u4
  - id: map_height
    type: u4
  - id: center_offset_x
    type: f4
  - id: center_offset_y
    type: f4
  - id: tile_node
    type: tile_node
    repeat: expr
    repeat-expr: map_width * map_height
types:
  tile_node:
    seq:
      - id: ground_height
        type: u2
      - id: water_height_and_boundary
        type: water_height_and_boundary
      - id: flags_and_ground_texture
        type: flags_and_ground_texture
      - id: ground_and_cliff_variation
        type: u1
      - id: cliff_texture_and_layer_height
        type: cliff_texture_and_layer_height
  water_height_and_boundary:
    seq:
      - id: water_height
        type: b15
      - id: flag
        type: b1
  flags_and_ground_texture:
    seq:
      - id: boundary_2
        type: b1
      - id: water
        type: b1
      - id: blight
        type: b1
      - id: ramp
        type: b1
      - id: texture
        type: b4
  cliff_texture_and_layer_height:
    seq:
      - id: texture
        type: b4
      - id: layer
        type: b4
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