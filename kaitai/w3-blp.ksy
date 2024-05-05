meta:
  id: w3_blp
  file-extension: blp
  endian: le
  imports:
    - w3id
seq:
  - id: header
    type: header
  - id: mipmap_locator
    type: mipmap_locator
    if: header.magic.version >= 1
  - id: jpg_header
    type: jpg_header
    if: header.content == content::jpg
  - id: direct_header
    type: direct_header
    if: header.content == content::direct
types:
  magic:
    seq:
      - id: head
        type: u1
        repeat: expr
        repeat-expr: 3
      - id: version_raw
        type: u1
    instances:
      version:
        value: version_raw - 48
  header:
    seq:
      - id: magic
        type: magic
      - id: content
        type: u4
        enum: content
      - id: encoding_type
        type: u1
        if: magic.version >= 2
      - id: alpha_bits2
        type: u1
        if: magic.version >= 2
      - id: sample_type
        type: u1
        if: magic.version >= 2
      - id: has_mipmaps2
        type: u1
        if: magic.version >= 2
      - id: alpha_bits
        type: u4
        if: magic.version < 2
      - id: width
        type: u4
      - id: height
        type: u4
      - id: extra
        type: u4
        if: magic.version < 2
      - id: has_mipmaps
        type: u4
        if: magic.version < 2
  mipmap_locator:
    seq:
      - id: mipmap_offset
        type: u4
        repeat: expr
        repeat-expr: 16
      - id: mipmap_size
        type: u4
        repeat: expr
        repeat-expr: 16
  jpg_header:
    seq:
      - id: num_header_chunk
        type: u4
      - id: header_chunk
        type: u1
        repeat: expr
        repeat-expr: num_header_chunk
  direct_header:
    seq:
      - id: cmap
        type: u1
        repeat: expr
        repeat-expr: 256
enums:
  content:
    0: jpg
    1: direct
instances:
  mipmap0:
    pos: mipmap_locator.mipmap_offset[0]
    type: u1
    repeat: expr
    repeat-expr: mipmap_locator.mipmap_size[0]