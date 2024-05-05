meta:
  id: w3_w3z
  file-extension: w3z
  endian: le
  imports:
    - w3str
    - w3id
seq:
  - id: map_path
    type: w3str
  - id: fill
    type: str
    encoding: ASCII
    size: 0x415ae
  - id: units_amount
    type: u4
  - id: unit
    type: unit
    repeat: expr
    repeat-expr: 2
types:
  unit:
    seq:
    - id: first_id
      type: w3id
    - id: more_int11
      type: u4
    - id: more_int12
      type: u4
    - id: more_int13
      type: u4
    - id: more_float4
      type: f4
    - id: more_int14
      type: u4
    - id: more_int15
      type: u4
    - id: more_float5
      type: f4
    - id: more_int16
      type: u4
    - id: more_int17
      type: u4
    - id: more_int18
      type: u4
    - id: id
      type: w3id
    - id: prim_int
      type: u4
    - id: name
      type: w3str
    - id: description
      type: w3str
    - id: sound_set
      type: w3str
    - id: model_path
      type: w3str
    - id: portrait_model_path
      type: w3str
    - id: unit_type
      type: u4
    - id: weapon_path
      type: w3str
      if: unit_type > 0
    - id: weapon2_path
      type: w3str
      if: unit_type > 0
    - id: dunno
      type: w3str
      if: unit_type > 1
    - id: ground_texture
      type: w3str
      if: unit_type == 0
    - id: shadow
      type: w3str
    - id: shadow_building
      type: w3str
    - id: selection_scale1
      type: f4
    - id: selection_scale2_not_confirmed
      type: f4
    - id: selection_circle_height
      type: f4
    #- id: less_int1
    #  type: u4
    - id: blargh
      type: u4
    - id: blargh2
      type: f4
      if: blargh > 0
    - id: projectile2_arc
      type: f4
      if: blargh2 > 0
    - id: shadow_center_x
      type: f4
    - id: shadow_center_y
      type: f4
    - id: shadow_center_width
      type: f4
    - id: shadow_center_height
      type: f4
    - id: less_int2
      type: u4
    - id: less_int3
      type: u4
    - id: less_float5
      type: f4
    - id: less_float6
      type: f4
    - id: elevation_pts
      type: u4
    - id: elevation_radius
      type: f4
    - id: less_int5
      type: u4
    - id: red
      type: u1
    - id: green
      type: u1
    - id: blue
      type: u1
    - id: alpha
      type: u1
    - id: replace_float0
      type: f4
    - id: replace_float1
      type: f4
    - id: replace_float2
      type: f4
    - id: anim_walk_speed
      type: f4
    - id: anim_run_speed
      type: f4
    - id: some_int2
      type: u4
    - id: blend_time
      type: f4
    - id: some_float2
      type: f4
    - id: some_int3
      type: u4
    - id: some_float3
      type: f4
    - id: some_int4
      type: u4
    - id: some_flags
      type: u4
    - id: some_float6
      type: u4
    - id: some_float7
      type: u4
    - id: some_int5
      type: u4
    - id: some_float8
      type: u4
    - id: spec
      type: u4
    - id: head
      type: u4
    - id: score_screen_icon_path
      type: w3str
    - id: sound_movement
      type: w3str
    - id: sound_construction
      type: w3str
    - id: sound_fade_in_rate
      type: u4
    - id: sound_fade_out_rate
      type: u4
    - id: sound_random
      type: w3str
    - id: has_caster_upgrade_art
      type: u4
      if: unit_type > 0
    - id: caster_upgrade_art
      type: w3str
      if: unit_type > 0
      
    - id: caster_upgrade_names_amount
      type: u4
      if: unit_type > 0
    - id: caster_upgrade_name
      type: w3str
      repeat: expr
      repeat-expr: caster_upgrade_names_amount
      if: unit_type > 0
      
    - id: caster_upgrades_amount
      type: u4
      if: unit_type > 0
    - id: caster_upgrade
      type: w3str
      repeat: expr
      repeat-expr: caster_upgrades_amount
      if: unit_type > 0
      
    - id: has_special_art
      type: u4
    - id: special_art
      type: w3str
      if: has_special_art == 1
    - id: has_icon
      type: u4
    - id: icon_path
      type: w3str
      if: has_icon == 1
    - id: fill5
      type: u4
    - id: tooltip
      type: w3str
    - id: fill6
      type: u4
    - id: extended_tooltip
      type: w3str
    - id: more_int
      type: u4
    - id: projectile_launch_z
      type: f4
    - id: projectile_launch_z_swim
      type: f4
    - id: projectile_impact_z
      type: f4
    - id: projectile_impact_z_swim
      type: f4
    - id: more_int4
      type: u4
    - id: more_int5
      type: u4
    - id: more_int6
      type: u4
    - id: more_int7
      type: u4
    - id: weapon_sound
      type: w3str
    - id: weapon_sound2
      type: w3str
    - id: has_target_art
      type: u4
    - id: target_art
      type: w3str
      if: has_target_art == 1
    - id: more_rest_int
      type: u4
      repeat: expr
      repeat-expr: 62
    - id: rest
      type: u1
      repeat: expr
      repeat-expr: 1