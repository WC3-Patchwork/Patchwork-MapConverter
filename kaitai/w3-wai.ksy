meta:
  id: w3_wai
  file-extension: wai
  endian: le
  imports:
    - w3str
    - w3id
    - w3-w3o
seq:
  - id: version
    type: u4
  - id: name
    type: w3str
  - id: race
    type: u4
    enum: ai_race
  - id: flags
    type: flags
    size: 4
  - id: num_peons_and_buildings
    type: u4
  - id: gold_worker
    type: w3id
  - id: lumber_worker
    type: w3id
  - id: base_building
    type: w3id
  - id: mine_building
    type: w3id
  - id: num_condition
    type: u4
  - id: unknown
    type: u4
  - id: condition
    type: condition
    repeat: expr
    repeat-expr: num_condition
  - id: first_hero
    type: w3id
  - id: second_hero
    type: w3id
  - id: third_hero
    type: w3id
  - id: training_chance_first_second_third
    type: u4
  - id: training_chance_first_third_second
    type: u4
  - id: training_chance_second_first_third
    type: u4
  - id: training_chance_second_third_first
    type: u4
  - id: training_chance_third_first_second
    type: u4
  - id: training_chance_third_second_first
    type: u4
  - id: skill_chunk
    type: skill_chunk
  - id: num_build_priority
    type: u4
  - id: build_priority
    type: build_priority
    repeat: expr
    repeat-expr: num_build_priority
  - id: num_harvest_priority
    type: u4
  - id: harvest_priority
    type: harvest_priority
    repeat: expr
    repeat-expr: num_harvest_priority
  - id: num_target_priority
    type: u4
  - id: target_priority
    type: target_priority
    repeat: expr
    repeat-expr: num_target_priority
  - id: repeat_waves
    type: u4
  - id: minimum_forces_attack_group_index
    type: u4
  - id: initial_delay
    type: u4
  - id: num_attack_group
    type: u4
  - id: attack_group
    type: attack_group
    repeat: expr
    repeat-expr: num_attack_group
  - id: num_attack_wave
    type: u4
  - id: attack_wave
    type: attack_wave
    repeat: expr
    repeat-expr: num_attack_wave
  - id: unknown2
    type: u4
  - id: game_options
    type: game_options
  - id: regular_game_speed
    type: u4
  - id: map_path
    type: w3str
  - id: num_player
    type: u4
  - id: player
    type: player
    repeat: expr
    repeat-expr: num_player
  - id: use_import_obj
    type: u4
  - id: import_obj
    type: import_obj
  - id: w3o
    type: w3_w3o
types:
  flags:
    seq:
      - id: defend_users
        type: b1
      - id: random_paths
        type: b1
      - id: set_player_name
        type: b1
      - id: remove_injuries
        type: b1
      - id: smart_artillery
        type: b1
      - id: allow_home_changes
        type: b1
      - id: slow_harvesting
        type: b1
      - id: take_items
        type: b1
      - id: ignore_injuries
        type: b1
      - id: have_no_mercy
        type: b1
      - id: groups_flee
        type: b1
      - id: units_flee
        type: b1
      - id: heroes_flee
        type: b1
      - id: repair_structures
        type: b1
      - id: target_heroes
        type: b1
      - id: melee
        type: b1
      - id: rest
        type: b1
        repeat: expr
        repeat-expr: 15
      - id: buy_items
        type: b1
  skill_chunk:
    seq:
      - id: first_as_first
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: first_as_second
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: first_as_third
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: second_as_first
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: second_as_second
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: second_as_third
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: third_as_first
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: third_as_second
        type: w3id
        repeat: expr
        repeat-expr: 10
      - id: third_as_third
        type: w3id
        repeat: expr
        repeat-expr: 10
  build_priority:
    seq:
      - id: priority_type
        type: u4
      - id: tech_type
        type: u4
        enum: build_priority_tech_type
      - id: tech
        type: w3id
        #enum: build_priority_tech
      - id: target
        type: u4
        enum: build_priority_target
      - id: condition_index
        type: u4
        enum: build_priority_condition_index
      - id: fill
        type: u1
        repeat: expr
        repeat-expr: 5
      #- id: condition_without_index
      #  type: condition_without_index
  condition:
    seq:
      - id: index
        type: u4
      - id: rest
        type: condition_without_index
  condition_without_index:
    seq:
      - id: name
        type: strz
        encoding: UTF-8
      - id: type
        type: u4
        enum: condition_type
      - id: operator_function_name
        type: w3str
        if: type == condition_type::used
      - id: begin_function
        type: u4
      - id: parameter_list
        type:
          switch-on: operator_function_name.value
          cases:
            '"OperatorCompareBoolean"': parameter_list(3)
            '"OperatorCompareInteger"': parameter_list(3)
            '"GetBooleanAnd"': parameter_list(2)
            '"GetBooleanOr"': parameter_list(2)
      - id: end_function
        type: u4
  parameter_list:
    params:
      - id: num_parameter
        type: u2
    seq:
      - id: parameter
        type: parameter
        repeat: expr
        repeat-expr: num_parameter
  parameter:
    seq:
      - id: type
        type: u4
        enum: parameter_type
      - id: value
        type: w3str
      - id: begin_function
        type: u4
      - id: parameter_list
        type: parameter_list(1)
        if: type == parameter_type::function and value.value == ""
      - id: function_parameter_ext
        type: function_parameter_ext
        if: type == parameter_type::function and value.value != ""
      #- id: end_function_func
      #  type: u4
      #  if: type == parameter_type::function and value.value == ""
      - id: parameter_list_op
        type: parameter_list(3)
        if: type == parameter_type::operator_function
      #- id: end_function_op
      #  type: u4
      #  if: type == parameter_type::operator_function
      #- id: operator_function_parameter_ext
      #  type: operator_function_parameter_ext
      #  if: parameter_type == parameter_type::operator_function
      - id: end_function
        type: u4
  function_parameter_ext:
    seq:
      - id: type
        type: u4
      - id: value
        type: w3str
      - id: begin_function
        type: u4
      - id: parameter_list
        type:
          switch-on: _parent.value.value
          cases:
            '"OperatorInt"': parameter_list(3)
            '"GetUpgradeGoldCost"': parameter_list(1)
            '"GetUpgradeWoodCost"': parameter_list(1)
            '"GetUpgradeLevel"': parameter_list(1)
            '"GetUnitBuildTime"': parameter_list(1)
            '"GetUnitGoldCost"': parameter_list(1)
            '"GetUnitWoodCost"': parameter_list(1)
            '"GetTownUnitCount"': parameter_list(3)
            '"GetUnitCount"': parameter_list(1)
            '"GetUnitCountDone"': parameter_list(1)
            '"GetNextExpansion"': parameter_list(0)
            '"TownWithMine"': parameter_list(0)
            '"GetMinesOwned"': parameter_list(0)
            '"GetFoodMade"': parameter_list(1)
            '"TotalFoodProduced"': parameter_list(0)
            '"FoodUsed"': parameter_list(0)
            '"GetGold"': parameter_list(0)
            '"GetWood"': parameter_list(0)
            '"GetGoldOwned"': parameter_list(0)
            '"MeleeDifficulty"': parameter_list(0)
            '"CurrentAttackWave"': parameter_list(0)
            '"CaptainGroupSize"': parameter_list(0)
            '"CaptainReadinessHP"': parameter_list(0)
            '"CaptainReadinessMa"': parameter_list(0)
            '"CommandsWaiting"': parameter_list(0)
            '"CheckLastCommand"': parameter_list(1)
            '"CheckLastCommandData"': parameter_list(1)
            '"ExpansionNeeded"': parameter_list(0)
            '"TownHasHall"': parameter_list(1)
            '"TownHasMine"': parameter_list(1)
            '"TownThreatened"': parameter_list(0)
            '"CreepsOnMap"': parameter_list(0)
            '"CaptainInCombat"': parameter_list(1)
            '"CaptainAtGoal"': parameter_list(0)
            '"CaptainRetreating"': parameter_list(0)
            '"CaptainIsEmpty"': parameter_list(0)
            '"CaptainIsFull"': parameter_list(0)
            '"CaptainIsHome"': parameter_list(0)
            _: parameter_list(0)
      - id: end_function
        type: u4
  operator_function_parameter_ext:
    seq:
      - id: begin_function
        type: u4
      - id: parameter_list
        type:
          switch-on: begin_function
          cases:
            _: parameter_list(0)
      - id: end_function
        type: u4
  harvest_priority:
    seq:
      - id: harvest_priority_type
        type: u4
      - id: harvest_type
        type: u4
        enum: harvest_type
      - id: target
        type: u4
        enum: build_priority_target
      - id: workers
        type: u4
        # 0xFFFFFFFF: all
        # 0xFFFFFFFE: all not attacking
      - id: condition_index
        type: u4
        enum: build_priority_condition_index
      - id: fill
        type: u1
        repeat: expr
        repeat-expr: 5
      #- id: condition_without_index
      #  type: condition_without_index
  target_priority:
    seq:
      - id: priority_type
        type: u4
      - id: target
        type: u4
        enum: target
      - id: creep_min_strength
        type: u4
      - id: creep_max_strength
        type: u4
        if: target == target::creep_camp
      - id: allow_flyers
        type: u4
        enum: allow_flyers
        if: target == target::creep_camp
      - id: condition_index
        type: u4
        enum: build_priority_condition_index
      - id: fill2
        type: u1
        repeat: expr
        repeat-expr: 4
        if: target == target::creep_camp
      - id: fill
        type: u1
        repeat: expr
        repeat-expr: 1
      #- id: condition_without_index
      #  type: condition_without_index
  attack_group:
    seq:
      - id: index
        type: u4
      - id: name
        type: w3str
      - id: num_current_group
        type: u4
      - id: current_group
        type: current_group
        repeat: expr
        repeat-expr: num_current_group
  current_group:
    seq:
      - id: unit
        type: w3id
      - id: quantity
        type: u4
        # 0xFFFFFFFF: all
      - id: max_quantity
        type: u4
        # 0xFFFFFFFF: all
      - id: condition_index
        type: u4
        enum: build_priority_condition_index
      - id: fill
        type: u1
        repeat: expr
        repeat-expr: 5
      #- id: condition_without_index
      #  type: condition_without_index
  attack_wave:
    seq:
      - id: attack_group_index
        type: u4
      - id: delay
        type: u4
  game_options:
    seq:
      - id: rest
        type: b1
        repeat: expr
        repeat-expr: 6
      - id: disable_victory_defeat_conditions
        type: b1
      - id: disable_fog_of_war
        type: b1
      - id: rest2
        type: b1
        repeat: expr
        repeat-expr: 24
  player:
    seq:
      - id: index
        type: u4
      - id: team_number
        type: u4
      - id: race
        type: u4
        enum: player_race
      - id: color
        type: u4
      - id: handicap
        type: u4
      - id: ai
        type: u4
        enum: ai
      - id: ai_difficulty
        type: u4
        enum: ai_difficulty
      - id: ai_script_path
        type: w3str
  import_obj:
    seq:
      - id: path
        type: w3str
      - id: import_time
        type: w3str
enums:
  ai_race:
    0: custom
    1: human
    2: orc
    3: undead
    4: night_elf
  build_priority_tech_type:
    0: unit
    1: upgrade
    2: expansion_town
  #build_priority_tech:
    #"\X\E\I\A": expansion_town
  build_priority_target:
    0: main
    1: expansion_1
    2: expansion_2
    3: expansion_3
    4: expansion_4
    5: expansion_5
    6: expansion_6
    7: expansion_7
    8: expansion_8
    9: expansion_9
    0xFFFFFFFD: mine_1
    0xFFFFFFFC: mine_2
    0xFFFFFFFB: mine_3
    0xFFFFFFFA: mine_4
    0xFFFFFFF9: mine_5
    0xFFFFFFF8: mine_6
    0xFFFFFFF7: mine_7
    0xFFFFFFF6: mine_8
    0xFFFFFFF5: mine_9
    0xFFFFFFFF: any
  build_priority_condition_index:
    0xFFFFFFFF: none
    0xFFFFFFFE: custom
  condition_type:
    0: none
    1: used
  parameter_type:
    0: preset
    1: operator_function
    2: function
    3: string
  harvest_type:
    0: gold
    1: lumber
  target:
    0: common_alliance_target
    1: new_expansion_location
    2: enemy_major_assault
    3: enemy_expansion
    4: enemy_any_town
    5: creep_camp
    6: purchase_goblin_zeppelin
  allow_flyers:
    0: false
    1: true
  player_race:
    0: human
    2: orc
    8: undead
    4: night_elf
    20: random
  ai:
    0: standard
    1: user
    4: custom
    12: current
  ai_difficulty:
    0: easy
    1: normal
    2: insane