meta:
  id: w3_w3v
  file-extension: w3v
  endian: le
  imports:
    - w3str
    - w3id
seq:
  - id: version
    type: u4
  - id: num_game_cache
    type: u4
  - id: game_cache
    type: game_cache
    repeat: expr
    repeat-expr: num_game_cache
types:
  game_cache:
    seq:
      - id: name
        type: w3str
      - id: reserved
        type: u4
      - id: num_category
        type: u4
      - id: category
        type: category
        repeat: expr
        repeat-expr: num_category
  category:
    seq:
      - id: name
        type: w3str
      - id: reserved_var_types
        type: u1
        repeat: expr
        repeat-expr: 5
      - id: filler
        type: u1
        repeat: expr
        repeat-expr: 15
      - id: num_int_entry
        type: u4
      - id: int_entry
        type: int_entry
        repeat: expr
        repeat-expr: num_int_entry
      - id: num_real_entry
        type: u4
      - id: real_entry
        type: real_entry
        repeat: expr
        repeat-expr: num_real_entry
      - id: num_boolean_entry
        type: u4
      - id: boolean_entry
        type: boolean_entry
        repeat: expr
        repeat-expr: num_boolean_entry
      - id: num_unit_entry
        type: u4
      - id: unit_entry
        type: unit_entry
        repeat: expr
        repeat-expr: num_unit_entry
      - id: num_string_entry
        type: u4
      - id: string_entry
        type: string_entry
        repeat: expr
        repeat-expr: num_string_entry
  int_entry:
    seq:
      - id: name
        type: w3str
      - id: value
        type: u4
  real_entry:
    seq:
      - id: name
        type: w3str
      - id: value
        type: f4
  boolean_entry:
    seq:
      - id: name
        type: w3str
      - id: value
        type: u4
  string_entry:
    seq:
      - id: name
        type: w3str
      - id: value
        type: w3str
  unit_entry:
    seq:
      - id: name
        type: w3str
      - id: unit_id
        type: w3id
      - id: num_inventory_slot
        type: u4
      - id: inventory_slot
        type: inventory_slot
        repeat: expr
        repeat-expr: num_inventory_slot
      - id: experience
        type: u4
      - id: level_minus_one
        type: u4
      - id: unused_skill_points
        type: u4
      - id: hero_proper_name_index
        type: u2
      - id: unknown_hero_proper_name_index2
        type: u2
      - id: str
        type: u4
      - id: str_plus
        type: f4
      - id: agi
        type: u4
      - id: move_speed_increment_from_agi
        type: f4
      - id: attack_speed_increment_from_agi
        type: f4
      - id: agi_plus
        type: f4
      - id: intelligence
        type: u4
      - id: int_plus
        type: f4
      - id: num_hero_skill
        type: u4
      - id: hero_skill
        type: hero_skill
        repeat: expr
        repeat-expr: num_hero_skill
      - id: unknown4
        type: u4
        if: false
        repeat: expr
        repeat-expr: 5
      - id: life_increment
        type: f4
      - id: mana_increment
        type: f4
      - id: sight_range_day
        type: f4
      - id: unknown7
        type: u1
        repeat: expr
        repeat-expr: 4
      - id: atk_increment1
        type: u4
      - id: atk_increment2
        type: u4
      - id: armor_increment
        type: f4
      - id: unknown8
        type: u1
        repeat: expr
        repeat-expr: 2
  inventory_slot:
    seq:
      - id: item_id
        type: w3id
      - id: charges
        type: u4
      - id: flags
        type: item_flags
        size: 1
      - id: flags2
        type: item_flags2
        size: 1
      - id: flags3
        type: u1
      - id: flags4
        type: u1
  item_flags:
    seq:
      - id: drop_upon_death
        type: b1
      - id: perishable
        type: b1
      - id: flag5
        type: b1
      - id: flag4
        type: b1
      - id: invulnerable
        type: b1
      - id: flag2
        type: b1
      - id: flag1
        type: b1
      - id: flag0
        type: b1
  item_flags2:
    seq:
      - id: flag7
        type: b1
      - id: flag6
        type: b1
      - id: pawnable
        type: b1
      - id: flag4
        type: b1
      - id: use_automatically_when_acquired
        type: b1
      - id: droppable
        type: b1
      - id: actively_used
        type: b1
      - id: flag0
        type: b1
  hero_skill:
    seq:
      - id: ability_id
        type: w3id
      - id: current_level
        type: u4