meta:
  id: w3_w3r
  file-extension: w3r
  endian: le
  imports:
    - w3id
    - w3str
seq:
  - id: version
    type: u4
  - id: num_region
    type: u4
  - id: region
    type: region
    repeat: expr
    repeat-expr: num_region
types:
  region:
    seq:
      - id: left
        type: f4
      - id: bottom
        type: f4
      - id: right
        type: f4
      - id: top
        type: f4
      - id: name
        type: w3str
      - id: id
        type: u4
      - id: weather_id
        type: w3id
      - id: ambient_sound
        type: w3str
      - id: color_blue
        type: u1
      - id: color_green
        type: u1
      - id: color_red
        type: u1
      - id: end_token
        type: u1