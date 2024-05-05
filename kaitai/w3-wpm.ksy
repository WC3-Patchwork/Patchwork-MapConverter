meta:
  id: w3_wpm
  file-extension: wpm
  endian: le
  imports:
    - w3id
seq:
  - id: file_id
    type: w3id
  - id: version
    type: u4
  - id: width
    type: u4
  - id: height
    type: u4
  - id: pathing_node
    type: u1
    repeat: expr
    repeat-expr: width * height