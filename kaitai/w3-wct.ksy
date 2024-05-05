meta:
  id: w3_wct
  file-extension: wct
  endian: le
seq:
  - id: version
    type: version
  - id: head_comment
    encoding: UTF-8
    type: strz
    if: version.val == 1
  - id: head_trigger
    type: trigger
    if: version.val == 1
  - id: num_trigger
    type: u4
  - id: trigger
    type: trigger
    repeat: expr
    repeat-expr: num_trigger
types:
  version:
    seq:
      - id: first_version
        type: u4
      - id: second_version
        type: u4
        if: first_version == 0x80000004
    instances:
      val:
        value: "(first_version == 0x80000004 ? second_version : first_version)"
  trigger:
    seq:
      - id: length
        type: u4
      - id: content
        encoding: UTF-8
        size: length
        type: str