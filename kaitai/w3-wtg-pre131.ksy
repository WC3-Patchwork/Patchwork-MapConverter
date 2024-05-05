meta:
  id: w3_wtg
  file-extension: wtg
  endian: le
  imports:
    - w3id
    - w3str
seq:
  - id: root
    type: root(true)
types:
  root:
    params:
      - id: use_131
        type: bool
    seq:
      - id: magic
        type: w3id
      - id: magic2
        type: u4
        if: use_131 == true
      - id: version
        type: u4
      - id: unknown
        type: u4
        repeat: expr
        repeat-expr: 4
        if: use_131 == true
      - id: num_category
        type: u4
      - id: num_removed_category
        type: u4
      - id: category
        type: category
        repeat: expr
        repeat-expr: num_category
      - id: subversion
        type: u4
      - id: num_var
        type: u4
      - id: var
        type: var
        repeat: expr
        repeat-expr: num_var
      - id: num_trig
        type: u4
      #- id: trig
      #  type: trig
      #  repeat: expr
      #  repeat-expr: num_trig
  category:
    seq:
      - id: index
        type: u4
      - id: name
        type: w3str
      - id: is_comment
        type: u4
        if: _root.root.version == 7
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
        if: _root.root.version == 7
      - id: use_initial_value
        type: u4
      - id: initial_value
        type: w3str
  trig:
    seq:
      - id: name
        type: w3str
      - id: description
        type: w3str
      - id: is_comment
        type: u4
        if: _root.root.version == 7
      - id: is_activated
        type: u4
      - id: is_custom_text
        type: u4
      - id: is_initially_enabled
        type: u4
      - id: category_index
        type: u4
      - id: num_eca
        type: u4
      - id: eca
        type: eca(false)
        repeat: expr
        repeat-expr: num_eca
  eca:
    params:
      - id: is_child
        type: bool
    seq:
      - id: type
        type: u4
        enum: eca
      - id: group_number
        type: u4
        if: is_child == true
      - id: name
        type: w3str
      - id: is_enabled
        type: u4
      - id: num_param
        type: u4
      - id: param
        type: param
        repeat: expr
        repeat-expr: num_param
      - id: num_eca
        type: u4
      - id: eca
        type: eca(true)
        repeat: expr
        repeat-expr: num_eca
        if: _root.root.version == 7
  param:
    seq:
      - id: test
        type: u4
enums:
  eca:
    0: event
    1: condition
    2: action