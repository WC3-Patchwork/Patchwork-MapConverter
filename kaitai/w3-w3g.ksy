meta:
  id: w3_w3g
  file-extension: w3g
  endian: le
seq:
  - id: version_or_smth
    type: u4
  - id: player
    type: player(1)
  - id: game_name
    type: strz
    encoding: UTF-8
  - id: null_byte
    type: u1
  - id: compressed_area
    type: compressed_area
  - id: player_count
    type: u4
  - id: game_type
    type: u1
  - id: priv
    type: u1
  - id: unknown
    type: u2
  - id: language_id
    type: u4
  - id: player_or_0x19
    type: player_or_0x19
  - id: slot_records_header
    type: slot_records_header
  - id: slot_record
    type: slot_record_chunk(slot_records_header.slot_record_size, slot_records_header.num_slot_record)
    size: slot_records_header.slot_record_size * slot_records_header.num_slot_record
  - id: random_seed
    type: u4
  - id: select_mode
    type: u1
  - id: num_start_position
    type: u1
  - id: block
    type: block
    repeat: eos
instances:
  priv_public:
    value: priv
    enum: private_public_enum
types:
  compressed_area:
    seq:
      - id: content
        terminator: 0
        process: blizzard_decompress
  block:
    seq:
      - id: block_id
        type: u1
      - id: leave_game
        type: leave_game
        if: block_id == 0x17
      - id: block_0x1a_0x1b_0x1c_skip
        type: u1
        repeat: expr
        repeat-expr: 4
        if: block_id == 0x1A or block_id == 0x1B or block_id == 0x1C
      - id: time_slot
        type: time_slot
        if: block_id == 0x1E or block_id == 0x1F
      - id: chat
        type: chat
        if: block_id == 0x20
      - id: block_0x22_skip
        type: u1
        repeat: expr
        repeat-expr: 5
        if: block_id == 0x22
      - id: block_0x23_skip
        type: u1
        repeat: expr
        repeat-expr: 11
        if: block_id == 0x23
      - id: countdown
        type: countdown
        if: block_id == 0x2F
  leave_game:
    seq:
      - id: reason
        type: u4
        enum: reason
      - id: player_id
        type: u1
      - id: res
        type: u4
      - id: unknown_flag
        type: u4
  time_slot:
    seq:
      - id: n
        type: u2
      - id: time_increment_ms
        type: u2
      - id: command_data
        type: command_data
        size: n - 2
        if: n > 2
  command_data:
    seq:
      - id: player_id
        type: u1
      - id: len_action_block
        type: u2
      - id: action_block
        type: action_block
        size: len_action_block
  action_block:
    seq:
      - id: action
        type: action
        repeat: eos
  action:
    seq:
      - id: action_id
        type: u1
        enum: action_id
      - id: action_payload
        type:
          switch-on: action_id
          cases:
            action_id::pause_game: action_pause_game_payload
            action_id::resume_game: action_resume_game_payload
            action_id::set_game_speed: action_set_game_speed_payload
            action_id::increase_game_speed: action_increase_game_speed_payload
            action_id::decrease_game_speed: action_decrease_game_speed_payload
            action_id::save_game: action_save_game_payload
            action_id::save_game_finished: action_save_game_finished_payload
            action_id::unit_building_ability: action_unit_building_ability_payload
            action_id::unit_building_ability_with_target_position: action_unit_building_ability_with_target_position
            action_id::unit_building_ability_with_target_position_and_object: action_unit_building_ability_with_target_position_and_object_payload
            action_id::give_or_drop_item: action_give_or_drop_item_payload
            action_id::unit_building_ability_with_two_target_positions_and_two_item_ids: action_unit_building_ability_with_two_target_positions_and_two_item_ids_payload
            action_id::change_selection: action_change_selection_payload
            action_id::assign_group_hotkey: action_assign_group_hotkey_payload
            action_id::select_group_hotkey: action_select_group_hotkey_payload
            action_id::select_subgroup: action_select_subgroup_payload
            action_id::unknown_0x1b: action_unknown_0x1b_payload
            action_id::select_ground_item: action_select_ground_item_payload
            action_id::cancel_hero_revival: action_cancel_hero_revival_payload
            action_id::remove_unit_from_building_queue: action_remove_unit_from_building_queue_payload
            action_id::cheat_the_dude_abides: action_cheat_the_dude_abides_payload
            action_id::unknown_0x21: action_unknown_0x21_payload
            action_id::cheat_somebody_set_up_us_the_bomb: action_cheat_somebody_set_up_us_the_bomb_payload
            action_id::cheat_warp_ten: action_cheat_warp_ten_payload
            action_id::cheat_iocaine_powder: action_cheat_iocaine_powder_payload
            action_id::cheat_whos_your_daddy: action_cheat_whos_your_daddy_payload
            action_id::cheat_keyser_soze: action_cheat_keyser_soze_payload
            action_id::cheat_leafit_to_me: action_cheat_leafit_to_me_payload
            action_id::cheat_there_is_no_spoon: action_cheat_there_is_no_spoon_payload
            action_id::cheat_it_vexes_me: action_cheat_it_vexes_me_payload
            action_id::cheat_who_is_john_galt: action_cheat_who_is_john_galt_payload
            action_id::cheat_greed_is_good: action_cheat_greed_is_good_payload
            action_id::cheat_day_light_savings: action_cheat_day_light_savings_payload
            action_id::cheat_i_see_dead_people: action_cheat_i_see_dead_people_payload
            action_id::cheat_synergy: action_cheat_synergy_payload
            action_id::cheat_sharp_and_shiny: action_cheat_sharp_and_shiny_payload
            action_id::cheat_all_your_base_are_belong_to_us: action_cheat_all_your_base_are_belong_to_us_payload
            action_id::change_ally_options: action_change_ally_options_payload
            action_id::transfer_resources: action_transfer_resources_payload
            action_id::esc_pressed: action_esc_pressed_payload
            action_id::scenario_trigger: action_scenario_trigger_payload
            action_id::enter_choose_hero_skill_submenu: action_enter_choose_hero_skill_submenu_payload
            action_id::enter_choose_building_submenu: action_enter_choose_building_submenu_payload
            action_id::minimap_signal: action_minimap_signal_payload
            action_id::continue_game_after_win_or_defeat: action_continue_game_after_win_or_defeat_payload
            action_id::continue_game_after_win_or_defeat2: action_continue_game_after_win_or_defeat2_payload
            action_id::unknown_0x75: action_unknown_0x75_payload
            action_id::unknown_0x7b: action_unknown_0x7b_payload
            _: action_nothing_take_rest
  action_pause_game_payload:
    seq:
      - id: nothing
        size: 0
  action_resume_game_payload:
    seq:
      - id: nothing
        size: 0
  action_set_game_speed_payload:
    seq:
      - id: speed
        type: u1
        enum: set_game_speed_speed
  action_increase_game_speed_payload:
    seq:
      - id: nothing
        size: 0
  action_decrease_game_speed_payload:
    seq:
      - id: nothing
        size: 0
  action_save_game_payload:
    seq:
      - id: name
        type: strz
        encoding: UTF-8
  action_save_game_finished_payload:
    seq:
      - id: unknown
        type: u4
  action_unit_building_ability_payload:
    seq:
      - id: ability_flags
        type: u2
      - id: order_id
        type: order_id
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
  action_unit_building_ability_with_target_position:
    seq:
      - id: ability_flags
        type: u2
      - id: order_id
        type: order_id
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
      - id: x
        type: f4
      - id: y
        type: f4
  action_unit_building_ability_with_target_position_and_object_payload:
    seq:
      - id: ability_flags
        type: u2
      - id: order_id
        type: order_id
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
      - id: x
        type: f4
      - id: y
        type: f4
      - id: object_id_1
        type: u4
      - id: object_id_2
        type: u4
  action_give_or_drop_item_payload:
    seq:
      - id: ability_flags
        type: u2
      - id: order_id
        type: order_id
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
      - id: x
        type: f4
      - id: y
        type: f4
      - id: target_object_id_1
        type: u4
      - id: target_object_id_2
        type: u4
      - id: item_object_id_1
        type: u4
      - id: item_object_id_2
        type: u4
  action_unit_building_ability_with_two_target_positions_and_two_item_ids_payload:
    seq:
      - id: ability_flags
        type: u2
      - id: order_id_a
        type: order_id
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
      - id: x_a
        type: f4
      - id: y_a
        type: f4
      - id: order_id_b
        type: order_id
      - id: unknown
        type: u1
        repeat: expr
        repeat-expr: 9
      - id: x_b
        type: f4
      - id: y_b
        type: f4
  action_change_selection_payload:
    seq:
      - id: mode
        type: u1
        enum: change_selection_mode
      - id: num_unit
        type: u2
      - id: unit
        type: action_change_selection_payload_unit
        repeat: expr
        repeat-expr: num_unit
  action_assign_group_hotkey_payload:
    seq:
      - id: group_index
        type: u1
      - id: num_item
        type: u2
      - id: item
        type: action_assign_group_hotkey_payload_item
        repeat: expr
        repeat-expr: num_item
  action_assign_group_hotkey_payload_item:
    seq:
      - id: object_id_1
        type: u4
      - id: object_id_2
        type: u4
  action_select_group_hotkey_payload:
    seq:
      - id: group_index
        type: u1
      - id: unknown
        type: u1
  action_change_selection_payload_unit:
    seq:
      - id: object_id_1
        type: u4
      - id: object_id_2
        type: u4
        if: not _io.eof
  action_select_subgroup_payload:
    seq:
      - id: item_id
        type: str
        encoding: ASCII
        size: 4
      - id: object_id_1
        type: u4
      - id: object_id_2
        type: u4
  action_pre_subselection_payload:
    seq:
      - id: nothing
        size: 0
  action_unknown_0x1b_payload:
    seq:
      - id: a
        type: u1
      - id: b
        type: u4
      - id: c
        type: u4
  action_select_ground_item_payload:
    seq:
      - id: unknown
        type: u1
      - id: object_id_1
        type: u4
      - id: object_id_2
        type: u4
  action_cancel_hero_revival_payload:
    seq:
      - id: unit_id_1
        type: u4
      - id: unit_id_2
        type: u4
  action_remove_unit_from_building_queue_payload:
    seq:
      - id: slot_index
        type: u1
      - id: item_id
        type: u4
  action_cheat_the_dude_abides_payload:
    seq:
      - id: nothing
        size: 0
  action_unknown_0x21_payload:
    seq:
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
  action_cheat_somebody_set_up_us_the_bomb_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_warp_ten_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_iocaine_powder_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_point_break_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_whos_your_daddy_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_keyser_soze_payload:
    seq:
      - id: unknown
        type: u1
      - id: amount
        type: u4
  action_cheat_leafit_to_me_payload:
    seq:
      - id: unknown
        type: u1
      - id: amount
        type: u4
  action_cheat_there_is_no_spoon_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_strength_and_honor_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_it_vexes_me_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_who_is_john_galt_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_greed_is_good_payload:
    seq:
      - id: unknown
        type: u1
      - id: amount
        type: u4
  action_cheat_day_light_savings_payload:
    seq:
      - id: time
        type: f4
  action_cheat_i_see_dead_people_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_synergy_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_sharp_and_shiny_payload:
    seq:
      - id: nothing
        size: 0
  action_cheat_all_your_base_are_belong_to_us_payload:
    seq:
      - id: nothing
        size: 0
  action_change_ally_options_payload:
    seq:
      - id: player_slot_index
        type: u1
      - id: flags
        type: change_ally_options_flags
        size: 4
  change_ally_options_flags:
    seq:
      - id: allied_with_player
        type: b1
        repeat: expr
        repeat-expr: 5
      - id: vision_shared
        type: b1
      - id: shared_control
        type: b1
      - id: unknown
        type: b1
        repeat: expr
        repeat-expr: 3
      - id: allied_victory
        type: b1
  action_transfer_resources_payload:
    seq:
      - id: player_slot_index
        type: u1
      - id: gold_amount
        type: u4
      - id: lumber_amount
        type: u4
  action_map_trigger_chat_command_payload:
    seq:
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
      - id: chat_command_or_trigger_name
        type: strz
        encoding: UTF-8
  action_esc_pressed_payload:
    seq:
      - id: nothing
        size: 0
  action_scenario_trigger_payload:
    seq:
      - id: unknown_a
        type: u4
      - id: unknown_b
        type: u4
      - id: unknown_counter
        type: u4
  action_enter_choose_building_submenu_payload:
    seq:
      - id: nothing
        size: 0
  action_enter_choose_hero_skill_submenu_payload:
    seq:
      - id: nothing
        size: 0
  action_minimap_signal_payload:
    seq:
      - id: x
        type: f4
      - id: y
        type: f4
      - id: unknown
        type: u4
  action_continue_game_after_win_or_defeat_payload:
    seq:
      - id: a
        type: u4
      - id: b
        type: u4
      - id: c
        type: u4
      - id: d
        type: u4
  action_continue_game_after_win_or_defeat2_payload:
    seq:
      - id: a
        type: u4
      - id: b
        type: u4
      - id: c
        type: u4
      - id: d
        type: u4
  action_unknown_0x75_payload:
    seq:
      - id: unknown
        type: u1
  action_unknown_0x7b_payload:
    seq:
      - id: x
        type: u4
      - id: y
        type: u4
      - id: order_id_1
        type: order_id
      - id: order_id_2
        type: order_id
  action_nothing_take_rest:
    seq:
      - id: nothing
        size-eos: true
  ability_flags:
    seq:
      - id: queue_command
        type: u1
      - id: apply_to_all_units_in_subgroup
        type: u1
      - id: area_effect
        type: u1
      - id: apply_to_all_units_in_selection
        type: u1
      - id: move_group_without_formation
        type: u1
      - id: unknown
        type: u1
      - id: subgroup_command
        type: u1
      - id: unknown2
        type: u1
      - id: autocast
        type: u1
  order_id:
    seq:
      - id: raw_bytes
        size: 4
    instances:
      order_id:
        value: raw_bytes[3] * 256 * 256 * 256 + raw_bytes[2] * 256 * 256 + raw_bytes[1] * 256 + raw_bytes[0]
      ability_id:
        value: raw_bytes.to_s(ascii).reverse
        if: raw_bytes[3] > 0
  chat:
    seq:
      - id: player_sender_id
        type: u1
      - id: size
        type: u2
      - id: flags
        type: u1
      - id: chat_recipient_index
        type: u4
        if: flags != 0x10
      - id: message
        type: strz
        encoding: UTF-8
  countdown:
    seq:
      - id: pre
        type: u1
      - id: mode
        type: u4
      - id: secs
        type: u4
  slot_records_header:
    seq:
      - id: num_start_bytes
        type: u2
      - id: num_slot_record
        type: u1
    instances:
      slot_record_size:
        value: (num_start_bytes - 4 - 3) / num_slot_record
  slot_record_chunk:
    params:
      - id: slot_record_size
        type: u2
      - id: num_slot_record
        type: u2
    seq:
      - id: slot_record
        type: slot_record(slot_record_size)
        repeat: expr
        repeat-expr: num_slot_record
  slot_record:
    params:
      - id: slot_record_size
        type: u2
    seq:
      - id: player_id
        type: u1
      - id: map_download_percent
        type: u1
      - id: status
        type: u1
        enum: slot_status
      - id: controller
        type: u1
        enum: slot_controller
      - id: team
        type: u1
      - id: color
        type: u1
      - id: race
        type: u1
      - id: ai_strength
        type: u1
        enum: slot_ai_strength
        if: 8 <= slot_record_size
      - id: handicap
        type: u1
        if: 9 <= slot_record_size
  player_or_0x19:
    seq:
      - id: player_or_0x19_loop
        type: player_or_0x19_loop(0)
  player_or_0x19_loop:
    params:
      - id: count
        type: u1
    seq:
      - id: discriminator
        type: u1
      - id: player
        type: player(0)
        if: discriminator == 0x16
      - id: padding
        type: u4
        if: discriminator == 0x16
      - id: next
        type: player_or_0x19_loop(count+1)
        if: discriminator == 0x16
      - id: player_meta_data_chunk
        type: player_meta_data_chunk
        if: discriminator != 0x16 and discriminator != 0x19
  player:
    params:
      - id: use_host
        type: u1
    seq:
      - id: non_host
        type: u1
        if: use_host != 0
      - id: player_id
        type: u1
      - id: name
        type: strz
        encoding: UTF-8
      - id: custom_or_ladder_index
        type: u1
      - id: custom_or_ladder_skip
        size: custom_or_ladder_index
      - id: runtime
        type: u4
        if: custom_or_ladder_index == 0x08
      - id: race_index
        type: u4
        if: custom_or_ladder_index == 0x08
    instances:
      custom_or_ladder_enum:
        value: custom_or_ladder_index
        enum: custom_or_ladder
      race:
        value: race_index
        enum: race
  player_meta_data_chunk:
    seq:
      - id: skip_to_meta
        type: u1
        repeat: expr
        repeat-expr: 11
      - id: player_meta_data_loop
        type: player_meta_data_loop(0)
  player_meta_data_loop:
    params:
      - id: count
        type: u1
    seq:
      - id: discriminator
        type: u1
      - id: player_meta_data
        type: player_meta_data
        if: discriminator != 0x19
      - id: next
        type: player_meta_data_loop(count+1)
        if: discriminator != 0x19
  player_meta_data:
    seq:
      - id: len_player_meta_data_content
        type: u1
      - id: player_meta_data_content
        type: player_meta_data_content
        size: len_player_meta_data_content
  player_meta_data_content:
    seq:
      - id: size
        type: u1
      - id: id
        type: u1
      - id: unknown
        type: u1
      - id: len_int_name
        type: u1
      - id: name
        type: str
        size: len_int_name
        encoding: UTF-8
      - id: terminator
        type: u1
      - id: len_int_clan
        type: u1
      - id: clan
        type: str
        size: len_int_clan
        encoding: UTF-8
      - id: clan_terminator
        type: u1
      - id: len_int_extra
        type: u1
enums:
  custom_or_ladder:
    0x00: custom0
    0x01: custom1
    0x02: custom2
    0x03: custom3
    0x04: custom4
    0x05: custom5
    0x06: custom6
    0x07: custom7
    0x08: ladder
  private_public_enum:
    0x00: public
    0x08: private
  reason:
    0x01: remote
    0x0C: local
    #default: unknown
  chat_target:
    0x00: all
    0x01: allies
    0x02: observers_or_referees
  action_id:
    0x01: pause_game
    0x02: resume_game
    0x03: set_game_speed
    0x04: increase_game_speed
    0x05: decrease_game_speed
    0x06: save_game
    0x07: save_game_finished
    0x10: unit_building_ability
    0x11: unit_building_ability_with_target_position
    0x12: unit_building_ability_with_target_position_and_object
    0x13: give_or_drop_item
    0x14: unit_building_ability_with_two_target_positions_and_two_item_ids
    0x16: change_selection
    0x17: assign_group_hotkey
    0x18: select_group_hotkey
    0x19: select_subgroup
    0x1A: pre_subselection
    0x1B: unknown_0x1b
    0x1C: select_ground_item
    0x1D: cancel_hero_revival
    0x1E: remove_unit_from_building_queue
    0x20: cheat_the_dude_abides
    0x21: unknown_0x21
    0x22: cheat_somebody_set_up_us_the_bomb
    0x23: cheat_warp_ten
    0x24: cheat_iocaine_powder
    0x25: cheat_point_break
    0x26: cheat_whos_your_daddy
    0x27: cheat_keyser_soze
    0x28: cheat_leafit_to_me
    0x29: cheat_there_is_no_spoon
    0x2A: cheat_strength_and_honor
    0x2B: cheat_it_vexes_me
    0x2C: cheat_who_is_john_galt
    0x2D: cheat_greed_is_good
    0x2E: cheat_day_light_savings
    0x2F: cheat_i_see_dead_people
    0x30: cheat_synergy
    0x31: cheat_sharp_and_shiny
    0x32: cheat_all_your_base_are_belong_to_us
    # cheat_motherland
    0x50: change_ally_options
    0x51: transfer_resources
    0x60: map_trigger_chat_command
    0x61: esc_pressed
    0x62: scenario_trigger
    0x66: enter_choose_hero_skill_submenu
    0x67: enter_choose_building_submenu
    0x68: minimap_signal
    0x69: continue_game_after_win_or_defeat
    0x6A: continue_game_after_win_or_defeat2
    0x75: unknown_0x75
    0x7b: unknown_0x7b #new
  change_selection_mode:
    0x01: add
    0x02: remove
  set_game_speed_speed:
    0x00: slow
    0x01: normal
    0x02: fast
  race:
    0x00: none
    0x01: human
    0x02: orc
    0x04: nightelf
    0x08: undead
    0x10: demon
    0x20: random
    0x40: selectable_or_fixed
  slot_status:
    0x00: empty
    0x01: closed
    0x02: used
  slot_controller:
    0x00: human
    0x01: computer
  slot_ai_strength:
    0x00: easy
    0x01: normal
    0x02: insane