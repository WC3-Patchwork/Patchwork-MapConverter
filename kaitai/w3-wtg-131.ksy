meta:
  id: w3_wtg_131
  file-extension: wtg
  endian: le
  imports:
    - w3id
    - w3str
seq:
  - id: magic
    type: w3id
  - id: magic2
    type: u4
  - id: version
    type: u4
  - id: num_header
    type: u4
  - id: num_removed_header
    type: u4
  - id: removed_header
    type: removed_header
    repeat: expr
    repeat-expr: num_removed_header
  - id: num_library
    type: u4
  - id: num_removed_library
    type: u4
  - id: removed_library
    type: removed_library
    repeat: expr
    repeat-expr: num_removed_library
  - id: num_category
    type: u4
  - id: num_removed_category
    type: u4
  - id: removed_category
    type: removed_category
    repeat: expr
    repeat-expr: num_removed_category
  - id: num_trig
    type: u4
  - id: num_removed_trig
    type: u4
  - id: removed_trig
    type: removed_trig
    repeat: expr
    repeat-expr: num_removed_trig
  - id: num_comment
    type: u4
  - id: num_removed_comment
    type: u4
  - id: removed_comment
    type: removed_comment
    repeat: expr
    repeat-expr: num_removed_comment
  - id: num_script
    type: u4
  - id: num_removed_script
    type: u4
  - id: removed_script
    type: removed_script
    repeat: expr
    repeat-expr: num_removed_script
  - id: num_var_element
    type: u4
  - id: num_removed_var
    type: u4
  - id: removed_var
    type: removed_var
    repeat: expr
    repeat-expr: num_removed_var
  - id: unknown2
    type: u4
  - id: unknown3
    type: u4
  - id: trig_version
    type: u4
  - id: num_existing_var
    type: u4
  - id: existing_var
    type: var
    repeat: expr
    repeat-expr: num_existing_var
  - id: num_element
    type: u4
  - id: element
    type: element
    repeat: expr
    repeat-expr: num_element
    #repeat-expr: num_header + num_library + num_trig + num_comment + num_script + num_var_element + 1
types:
  removed_header:
    seq:
      - id: id
        type: u4
  removed_library:
    seq:
      - id: id
        type: u4
  removed_category:
    seq:
      - id: id
        type: u4
  removed_trig:
    seq:
      - id: id
        type: u4
  removed_comment:
    seq:
      - id: id
        type: u4
  removed_script:
    seq:
      - id: id
        type: u4
  removed_var:
    seq:
      - id: id
        type: u4
  element:
    seq:
      - id: type
        type: u4
        enum: element_type
      - id: header
        type: header
        if: (type == element_type::header) or (type == element_type::library) or (type == element_type::category)
      #- id: library
      #  type: library
      #  if: (type & 0x2) > 0
      #- id: category
      #  type: category
      #  if: (type & 0x4) > 0
      - id: trig
        type: trig
        if: (type == element_type::trig)
      #- id: comment
      #  type: comment
      #  if: (type & 16) > 0
      #- id: script
      #  type: script
      #  if: (type & 32) > 0
      - id: var
        type: var_element
        if: (type == element_type::var)
  header:
    seq:
      - id: index
        type: u4
      - id: name
        type: w3str
      - id: is_comment
        type: u4
        if: _root.version == 7
      - id: category_has_children
        type: u4
      - id: category_parent_id
        type: u4
  library:
    seq:
      - id: index
        type: u4
      - id: name
        type: w3str
      - id: is_comment
        type: u4
        if: _root.version == 7
      - id: category_has_children
        type: u4
      - id: category_parent_id
        type: u4
  category:
    seq:
      - id: index
        type: u4
      - id: name
        type: w3str
      - id: is_comment
        type: u4
        if: _root.version == 7
      - id: category_has_children
        type: u4
      - id: category_parent_id
        type: u4
  var:
    seq:
      - id: name
        type: w3str
      - id: type
        type: w3str
      - id: unknown
        type: u4
      - id: is_array
        type: u4
      - id: array_size
        type: u4
        if: _root.version == 7
      - id: use_initial_value
        type: u4
      - id: initial_value
        type: w3str
      - id: id
        type: u4
      - id: parent_id
        type: u4
  trig:
    seq:
      - id: name
        type: w3str
      - id: description
        type: w3str
      - id: is_comment
        type: u4
        if: _root.version == 7
      - id: id
        type: u4
      - id: is_activated
        type: u4
      - id: is_custom_script
        type: u4
      - id: is_initially_disabled
        type: u4
      - id: run_on_init
        type: u4
      - id: parent_id
        type: u4
      - id: num_eca
        type: u4
      - id: eca
        type: eca(false, 2)
        repeat: expr
        repeat-expr: num_eca
      #- id: eca2
      #  type: eca(false, 0)
  comment:
    seq:
      - id: name
        type: w3str
      - id: description
        type: w3str
      - id: is_comment
        type: u4
        if: _root.version == 7
      - id: id
        type: u4
      - id: is_activated
        type: u4
      - id: is_custom_script
        type: u4
      - id: is_initially_enabled
        type: u4
      - id: run_on_init
        type: u4
      - id: parent_id
        type: u4
  script:
    seq:
      - id: name
        type: w3str
      - id: description
        type: w3str
      - id: is_comment
        type: u4
        if: _root.version == 7
      - id: id
        type: u4
      - id: is_activated
        type: u4
      - id: is_custom_script
        type: u4
      - id: is_initially_enabled
        type: u4
      - id: run_on_init
        type: u4
      - id: parent_id
        type: u4
  var_element:
    seq:
      - id: id
        type: u4
      - id: name
        type: w3str
      - id: parent_id
        type: u4
  eca:
    params:
      - id: is_child
        type: bool
      - id: num_param
        type: u4
    seq:
      - id: type
        type: u4
        enum: eca_type
      - id: group_number
        type: u4
        if: is_child == true
      - id: func
        type: func
      - id: is_enabled
        type: u4
      - id: param
        type: param
        repeat: expr
        repeat-expr: func.num_param
        #repeat-expr: num_param
      - id: num_child_eca
        type: u4
      - id: child_eca
        type: eca(true, 0)
        repeat: expr
        repeat-expr: num_child_eca
        if: _root.version == 7
  param:
    seq:
      - id: param_type
        type: u4
        enum: param_type
      - id: value
        type: w3str
      - id: has_sub
        type: u4
      - id: sub_param
        type: sub_param
        if: has_sub != 0
      - id: unknown2
        type: u4
        if: (_root.version == 7) and not (has_sub == 0)
      - id: is_array
        type: u4
      - id: array_index
        type: param
        if: is_array != 0
  param2:
    seq:
      - id: param_type
        type: u4
        enum: param_type
      - id: value
        type: w3str
      - id: has_sub
        type: u4
      - id: sub_param
        type: sub_param
        if: has_sub != 0
      - id: unknown2
        type: u4
        if: (_root.version == 7) and not (has_sub == 0)
      - id: is_array
        type: u4
      #- id: array_index
      #  type: param
      #  if: is_array != 0
  sub_param:
    seq:
      - id: sub_type
        type: u4
      - id: func
        type: func
      - id: has_param
        type: u4
      - id: param
        type: param
        repeat: expr
        repeat-expr: func.num_param
  func:
    seq:
      - id: num_arguments_and_name
        type: w3str
        process: wtg_func_lookup
        terminator: 0
    instances:
      num_param:
        io: num_arguments_and_name._io
        pos: 0
        type: u4
      name:
        io: num_arguments_and_name._io
        pos: 4
        type: w3str
enums:
  element_type:
    1: header
    2: library
    4: category
    8: trig
    16: comment
    32: script
    64: var
  param_type:
    0: preset
    1: variable
    2: function
    3: string
  eca_type:
    0: event
    1: condition
    2: action