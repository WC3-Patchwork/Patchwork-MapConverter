meta:
  id: w3_imp
  file-extension: imp
  endian: le
  imports:
    - w3str
seq:
  - id: version
    type: u4
  - id: num_import_obj
    type: u4
  - id: import_obj
    type: import_obj
    repeat: expr
    repeat-expr: num_import_obj
types:
  import_obj:
    seq:
      - id: flags
        type: u1
      - id: path
        type: w3str