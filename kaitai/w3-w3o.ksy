meta:
  id: w3_w3o
  file-extension: w3o
  endian: le
  imports:
    - w3-w3a
    - w3-w3b
    - w3-w3d
    - w3-w3h
    - w3-w3q
    - w3-w3t
    - w3-w3u
seq:
  - id: version
    type: u4
  - id: use_unit
    type: u4
  - id: unit
    type: w3_w3u
    if: use_unit == 1
  - id: use_item
    type: u4
  - id: item
    type: w3_w3t
    if: use_item == 1
  - id: use_destructable
    type: u4
  - id: destructable
    type: w3_w3b
    if: use_destructable == 1
  - id: use_doodad
    type: u4
  - id: doodad
    type: w3_w3d
    if: use_doodad == 1
  - id: use_ability
    type: u4
  - id: ability
    type: w3_w3a
    if: use_ability == 1
  - id: use_buff
    type: u4
  - id: buff
    type: w3_w3h
    if: use_buff == 1
  - id: use_upgrade
    type: u4
  - id: upgrade
    type: w3_w3q
    if: use_upgrade == 1