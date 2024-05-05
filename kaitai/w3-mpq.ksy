meta:
  id: w3_mpq
  file-extension: w3x
  endian: le
  imports:
    - w3id
seq:
  - id: header
    type: header
    size: 512
types:
  header:
    seq:
      - id: file_id
        type: w3id
      - id: header_size
        type: u4
      - id: archive_size
        type: u4
      - id: format_version
        type: u2
      - id: sector_size_shift
        type: u2
      - id: hash_table_offset
        type: u4
      - id: block_table_offset
        type: u4
      - id: num_hash_table_entry
        type: u4
      - id: num_block_table_entry
        type: u4
  block_table:
    seq:
      - id: block_table_entry
        type: block_table_entry
        repeat: expr
        repeat-expr: _root.header.num_block_table_entry
  block_table_entry:
    seq:
      - id: block_offset
        type: u4
      - id: block_size
        type: u4
      - id: file_size
        type: u4
      - id: flags
        type: u4
  hash_table:
    seq:
      - id: hash_table_entry
        type: hash_table_entry
        repeat: expr
        repeat-expr: _root.header.num_hash_table_entry
  hash_table_entry:
    seq:
      - id: file_path_hash_a
        type: u4
      - id: file_path_hash_b
        type: u4
      - id: language
        type: u2
      - id: platform
        type: u2
      - id: file_block_index
        type: u4
  file_data:
    seq:
      - id: abc
        type: u4
instances:
  hash:
    pos: header.hash_table_offset
    type: hash_table
    process: mpq_decrypt("(hash table)", "TABLE")
    size: 16 * _root.header.num_hash_table_entry
  block:
    pos: header.block_table_offset
    type: block_table
    process: mpq_decrypt("(block table)", "TABLE")
    size: 16 * _root.header.num_block_table_entry
enums:
  language:
    0: neutral