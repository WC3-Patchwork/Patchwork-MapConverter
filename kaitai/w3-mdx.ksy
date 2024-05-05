meta:
  id: w3_mdx
  file-extension: mdx
  endian: le
  imports:
    - w3id
seq:
  - id: magic
    type: w3id
  - id: chunk
    type: chunk_router
    repeat: expr
    repeat-expr: 14
types:
  chunk_router:
    seq:
      - id: magic
        type: w3id
      - id: size
        type: u4
      - id: chunk_data
        type:
          switch-on: magic.value
          cases:
            '"VERS"': chunk_vers
            '"MODL"': chunk_modl
            '"SEQS"': chunk_seqs
            '"GLBS"': chunk_glbs
            '"MTLS"': chunk_mtls(size)
            '"TEXS"': chunk_texs
            '"GEOS"': chunk_geos
            '"GEOA"': chunk_geoa
            '"BONE"': chunk_bone
            '"HELP"': chunk_help
            '"ATCH"': chunk_atch
            '"PIVT"': chunk_pivt
            '"EVTS"': chunk_evts
            '"CLID"': chunk_clid
            '"PRE2"': chunk_pre2
            '"LITE"': chunk_lite
            '"CAMS"': chunk_cams
            _: error
        size: size
    instances:
      version:
        value: 0x44c
  error:
    seq:
      - id: rest
        type: u1
        repeat: eos
      - id: more
        type: str
        encoding: ASCII
        size: 100
  chunk_cams:
    seq:
      - id: camera
        type: camera
        repeat: eos
  chunk_lite:
    seq:
      - id: light
        type: light
        repeat: eos
  chunk_pre2:
    seq:
      - id: particle_emitter2
        type: particle_emitter2
        repeat: eos
  chunk_clid:
    seq:
      - id: collision_shape
        type: collision_shape
        repeat: eos
  collision_shape:
    seq:
      - id: node
        type: node
      - id: type
        type: u4
      - id: vertex
        type: f4_3
        repeat: expr
        repeat-expr: type == 2 ? 1 : 2
      - id: radius
        type: f4
        if: type == 2 or type == 3
  chunk_evts:
    seq:
      - id: event_object
        type: event_object
        repeat: eos
  chunk_pivt:
    seq:
      - id: point
        type: f4_3
        repeat: eos
  chunk_atch:
    seq:
      - id: attachment
        type: attachment
        repeat: eos
  chunk_help:
    seq:
      - id: helper
        type: helper
        repeat: eos
  helper:
    seq:
      - id: node
        type: node
  chunk_bone:
    seq:
      - id: bone
        type: bone
        repeat: eos
  chunk_geos:
    seq:
      - id: geoset
        type: geoset
        repeat: eos
  chunk_geoa:
    seq:
      - id: geoset_anim
        type: geoset_anim
        repeat: eos
  chunk_texs:
    seq:
      #- id: a
      #  type: u4
      - id: texs_tex
        type: texs_tex
        repeat: eos
  texs_tex:
    seq:
      - id: id
        type: u4
      - id: path
        type: str
        encoding: UTF-8
        size: 260
      - id: flags
        type: u4
  chunk_vers:
    seq:
      - id: version
        type: u4
  chunk_modl:
    seq:
      - id: name
        type: str
        encoding: UTF-8
        size: 80
      - id: anim_file_name
        type: str
        encoding: UTF-8
        size: 260
      - id: extent
        type: extent
      - id: blend_time
        type: u4
  chunk_seqs:
    seq:
      - id: sequence
        type: sequence
        repeat: expr
        repeat-expr: _parent.size / 132
  chunk_glbs:
    seq:
      - id: global_sequence
        type: u4
        repeat: expr
        repeat-expr: _parent.size / 4
  chunk_mtls:
    params:
      - id: size
        type: u4
    seq:
      #- id: inclusive_size
      #  type: u4
      - id: material
        type: material(0)
        repeat: eos
  material:
    params:
      - id: index
        type: u4
    seq:
      - id: inclusive_size
        type: u4
      - id: payload
        type: material_payload(index)
        size: inclusive_size - 4
  material_payload:
    params:
      - id: index
        type: u4
    seq:
      - id: priority_plane
        type: u4
      - id: flags
        type: u4
      - id: shader
        type: str
        encoding: UTF-8
        size: 80
        if: _root.chunk[0].version > 800 and _root.chunk[0].version < 1100
      - id: lays_magic
        type: w3id
      - id: num_layer
        type: u4
      - id: layer
        type: layer(index)
        repeat: expr
        repeat-expr: num_layer
  layer:
    params:
      - id: index
        type: u4
    seq:
      - id: inclusive_size
        type: u4
      - id: layer_payload
        type: layer_payload(index)
        size: inclusive_size - 4
  layer_payload:
    params:
      - id: index
        type: u4
    seq:
      - id: filter_mode
        type: u4
      - id: shading_flags
        type: u4
      - id: texture_id
        type: u4
      - id: texture_anim_id
        type: u4
      - id: texture_coord_id
        type: u4
      - id: alpha
        type: f4
      - id: emissive_gain
        type: f4
        if: _root.chunk[0].version > 800
      - id: fresnel_color
        type: f4
        repeat: expr
        repeat-expr: 3
        if: _root.chunk[0].version > 800
      - id: fresnel_opacity
        type: f4
        if: _root.chunk[0].version > 800
      - id: fresnel_team_color
        type: f4
        if: _root.chunk[0].version > 800
      - id: hd
        type: u4
      - id: num_tex
        type: u4
      - id: tex_element
        type: tex_element
        repeat: eos
      #  if: index == 0
      #  if: index == 2
      #- id: kmte_chunk
      #  type: kmte_chunk
      #  repeat: eos
      #  if: _root.chunk[0].version > 800
      #- id: kfc3_chunk
      #  type: kfc3_chunk
      #  repeat: eos
      #  if: _root.chunk[0].version > 900
      #- id: kfca_chunk
      #  type: kfca_chunk
      #  repeat: eos
      #  if: _root.chunk[0].version > 900
      #- id: kfct_chunk
      #  type: kfct_chunk
      #  repeat: eos
      #  if: _root.chunk[0].version > 900
  tex_element:
    seq:
      - id: discriminator
        size: 4
      - id: payload
        type:
          switch-on: discriminator.to_s(ASCII)
          cases:
            "'KMTF'": kmtf_chunk
            "'KMTA'": kmta_chunk
            "'KMTE'": kmte_chunk
            _: u4
    instances:
      id:
        value: discriminator[0]
        if: discriminator[0] != 75 # K
      index:
        value: payload
        if: discriminator[0] != 75 # K
      track_magic:
        value: discriminator.to_s(ASCII)
        if: discriminator[0] == 75 # K
  texture_anim:
    seq:
      - id: inclusive_size
        type: u4
      - id: ktat_chunk
        type: ktat_chunk
      - id: ktar_chunk
        type: ktar_chunk
      - id: ktas_chunk
        type: ktas_chunk
  extent:
    seq:
      - id: bounds_radius
        type: f4
      - id: minimum
        type: f4
        repeat: expr
        repeat-expr: 3
      - id: maximum
        type: f4
        repeat: expr
        repeat-expr: 3
  sequence:
    seq:
      - id: name
        type: str
        encoding: UTF-8
        size: 80
      - id: interval
        type: u4
        repeat: expr
        repeat-expr: 2
      - id: move_speed
        type: f4
      - id: flags
        type: u4
        # 0 looping 1 non-looping
      - id: rarity
        type: f4
      - id: sync_point
        type: u4
      - id: extent
        type: extent
  geoset:
    seq:
      - id: inclusive_size
        type: u4
      - id: geoset_payload
        type: geoset_payload
        size: inclusive_size - 4
  geoset_payload:
    seq:
      - id: vrtx_magic
        type: w3id
      - id: num_vertex_position
        type: u4
      - id: vertex_position
        type: vertex_position
        repeat: expr
        repeat-expr: num_vertex_position
      - id: nrms_magic
        type: w3id
      - id: num_vertex_normal
        type: u4
      - id: vertex_normal
        type: vertex_normal
        repeat: expr
        repeat-expr: num_vertex_normal
      - id: ptyp_magic
        type: w3id
      - id: num_face_type_group
        type: u4
      - id: face_type_group
        type: u4
        repeat: expr
        repeat-expr: num_face_type_group
      - id: pcnt_magic
        type: w3id
      - id: num_face_group
        type: u4
      - id: face_group
        type: u4
        repeat: expr
        repeat-expr: num_face_group
      - id: pvtx_magic
        type: w3id
      - id: num_face
        type: u4
      - id: face
        type: u2
        repeat: expr
        repeat-expr: num_face
      - id: gndx_magic
        type: w3id
      - id: num_vertex_group
        type: u4
      - id: vertex_group
        type: u1
        repeat: expr
        repeat-expr: num_vertex_group
      - id: mtgc_magic
        type: w3id
      - id: num_matrix_group
        type: u4
      - id: matrix_group
        type: u4
        repeat: expr
        repeat-expr: num_matrix_group
      - id: mats_magic
        type: w3id
      - id: num_matrix_index
        type: u4
      - id: matrix_index
        type: u4
        repeat: expr
        repeat-expr: num_matrix_index
      - id: material_id
        type: w3id
      - id: selection_group
        type: u4
      - id: selection_flags
        type: u4
      - id: lod
        type: u4
        if: _root.chunk[0].version > 800
      - id: lod_name
        type: str
        encoding: UTF-8
        size: 80
        if: _root.chunk[0].version > 800
      - id: extent
        type: extent
      - id: num_sequence_extent
        type: u4
      - id: sequence_extent
        type: extent
        repeat: expr
        repeat-expr: num_sequence_extent
      - id: tangent_chunk
        type: tangent_chunk
        if: _root.chunk[0].version > 800 and _root.chunk[0].version < 1200
      - id: skin_chunk
        type: skin_chunk
        if: _root.chunk[0].version > 800 and _root.chunk[0].version < 1200
      - id: uvas_magic
        type: w3id
      - id: num_texture_coordinate_set
        type: u4
      - id: texture_coordinate_set
        type: texture_coordinate_set
        repeat: expr
        repeat-expr: num_texture_coordinate_set
  vertex_position:
    seq:
      - id: x
        type: f4
      - id: y
        type: f4
      - id: z
        type: f4
  vertex_normal:
    seq:
      - id: value
        type: f4
        repeat: expr
        repeat-expr: 3
  tangent_chunk:
    seq:
      - id: magic
        type: w3id
      - id: num_tangent
        type: u4
      - id: tantent
        type: tangent
        repeat: expr
        repeat-expr: num_tangent
  tangent:
    seq:
      - id: value
        type: f4
        repeat: expr
        repeat-expr: 4
  skin_chunk:
    seq:
      - id: magic
        type: w3id
      - id: num_skin
        type: u4
      - id: skin
        type: u1
        repeat: expr
        repeat-expr: num_skin
  texture_coordinate_set:
    seq:
      - id: magic
        type: w3id
      - id: num_texture_coordinate
        type: u4
      - id: texture_coordinate
        type: texture_coordinate
        repeat: expr
        repeat-expr: num_texture_coordinate
  texture_coordinate:
    seq:
      - id: x
        type: f4
      - id: y
        type: f4
  geoset_anim:
    seq:
      - id: inclusive_size
        type: u4
      - id: geoset_anim_payload
        type: geoset_anim_payload
        size: inclusive_size - 4
  geoset_anim_payload:
    seq:
      - id: alpha
        type: f4
      - id: flags
        type: u4
      - id: color1
        type: f4
      - id: color2
        type: f4
      - id: color3
        type: f4
      - id: geoset_id
        type: u4
      - id: track_chunk
        type: geoset_anim_track_chunk_router
        repeat: eos
  geoset_anim_track_chunk_router:
    seq:
      - id: magic
        type: w3id
      - id: chunk
        type:
          switch-on: magic.value
          cases:
            '"KGAO"': kgao_chunk
            '"KGAC"': kgac_chunk
  kgao_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4")
  kgac_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4_3")
  bone:
    seq:
      - id: node
        type: node
      - id: geoset_id
        type: u4
      - id: geoset_anim_id
        type: u4
  light:
    seq:
      - id: inclusive_size
        type: u4
      - id: light_payload
        type: light_payload
        size: inclusive_size - 4
  light_payload:
    seq:
      - id: node
        type: node
      - id: type
        type: u4
      - id: attenuation_start
        type: f4
      - id: attenuation_end
        type: f4
      - id: color1
        type: f4
      - id: color2
        type: f4
      - id: color3
        type: f4
      - id: intensity
        type: f4
      - id: ambient_color1
        type: f4
      - id: ambient_color2
        type: f4
      - id: ambient_color3
        type: f4
      - id: ambient_intensity
        type: f4
      - id: light_track_chunk_router
        type: light_track_chunk_router
        repeat: eos
  light_track_chunk_router:
    seq:
      - id: magic
        type: w3id
      - id: chunk
        type:
          switch-on: magic.value
          cases:
            '"KLAS"': klas_chunk
            '"KLAE"': klae_chunk
            '"KLAC"': klac_chunk
            '"KLAI"': klai_chunk
            '"KLBI"': klbi_chunk
            '"KLBC"': klbc_chunk
            '"KLAV"': klav_chunk
  helper:
    seq:
      - id: node
        type: node
  attachment:
    seq:
      - id: inclusive_size
        type: u4
      - id: attachment_payload
        type: attachment_payload
        size: inclusive_size - 4
  attachment_payload:
    seq:
      - id: node
        type: node
      - id: path
        type: str
        encoding: UTF-8
        size: 260
      - id: attachment_id
        type: u4
      - id: track_chunk
        type: attachment_track_router
        repeat: eos
  attachment_track_router:
    seq:
      - id: magic
        type: w3id
      - id: chunk
        type:
          switch-on: magic.value
          cases:
            '"KATV"': katv_chunk
  particle_emitter:
    seq:
      - id: inclusive_size
        type: u4
      - id: node
        type: node
      - id: emission_rate
        type: f4
      - id: gravity
        type: f4
      - id: longitude
        type: f4
      - id: latitude
        type: f4
      - id: spawn_model_file_name
        type: str
        encoding: UTF-8
        size: 260
      - id: lifespan
        type: f4
      - id: initial_velocity
        type: f4
      - id: kpee_chunk
        type: kpee_chunk
      - id: kpeg_chunk
        type: kpeg_chunk
      - id: kpln_chunk
        type: kpln_chunk
      - id: kplt_chunk
        type: kplt_chunk
      - id: kpel_chunk
        type: kpel_chunk
      - id: kpes_chunk
        type: kpes_chunk
      - id: kpev_chunk
        type: kpev_chunk
  particle_emitter2:
    seq:
      - id: inclusive_size
        type: u4
      - id: particle_emitter2_payload
        type: particle_emitter2_payload
        size: inclusive_size - 4
  particle_emitter2_payload:
    seq:
      - id: node
        type: node
      - id: speed
        type: f4
      - id: variation
        type: f4
      - id: latitude
        type: f4
      - id: gravity
        type: f4
      - id: lifespan
        type: f4
      - id: emission_rate
        type: f4
      - id: length
        type: f4
      - id: width
        type: f4
      - id: filter_mode
        type: u4
      - id: num_row
        type: u4
      - id: num_column
        type: u4
      - id: head_or_tail
        type: u4
      - id: tail_length
        type: f4
      - id: time
        type: f4
      - id: segment_color
        type: segment_color
        repeat: expr
        repeat-expr: 3
      - id: segment1_alpha
        type: u1
      - id: segment2_alpha
        type: u1
      - id: segmen3t_alpha
        type: u1
      - id: segment1_scale
        type: f4
      - id: segment2_scale
        type: f4
      - id: segment3_scale
        type: f4
      - id: segment1_head_interval
        type: u4
      - id: segment2_head_interval
        type: u4
      - id: segment3_head_interval
        type: u4
      - id: segment1_head_decay_interval
        type: u4
      - id: segment2_head_decay_interval
        type: u4
      - id: segment3_head_decay_interval
        type: u4
      - id: segment1_tail_interval
        type: u4
      - id: segment2_tail_interval
        type: u4
      - id: segment3_tail_interval
        type: u4
      - id: segment1_tail_decay_interval
        type: u4
      - id: segment2_tail_decay_interval
        type: u4
      - id: segment3_tail_decay_interval
        type: u4
      - id: texture_id
        type: u4
      - id: squirt
        type: u4
      - id: priority_plane
        type: u4
      - id: replaceable_id
        type: u4
      - id: particle_emitter2_track_chunk_router
        type: particle_emitter2_track_chunk_router
        repeat: eos
  particle_emitter2_track_chunk_router:
    seq:
      - id: magic
        type: w3id
      - id: chunk
        type:
          switch-on: magic.value
          cases:
            '"KP2S"': kp2s_chunk
            '"KP2R"': kp2r_chunk
            '"KP2L"': kp2l_chunk
            '"KP2G"': kp2g_chunk
            '"KP2E"': kp2e_chunk
            '"KP2N"': kp2n_chunk
            '"KP2W"': kp2w_chunk
            '"KP2V"': kp2v_chunk
  ribbon_emitter:
    seq:
      - id: inclusive_size
        type: u4
      - id: node
        type: node
      - id: height_above
        type: f4
      - id: height_below
        type: f4
      - id: alpha
        type: f4
      - id: color1
        type: f4
      - id: color2
        type: f4
      - id: color3
        type: f4
      - id: lifespan
        type: f4
      - id: texture_slot
        type: u4
      - id: emission_rate
        type: u4
      - id: num_row
        type: u4
      - id: num_column
        type: u4
      - id: material_id
        type: u4
      - id: gravity
        type: f4
      - id: krha_chunk
        type: krha_chunk
      - id: krhb_chunk
        type: krhb_chunk
      - id: kral_chunk
        type: kral_chunk
      - id: krco_chunk
        type: krco_chunk
      - id: krtx_chunk
        type: krtx_chunk
      - id: krvs_chunk
        type: krvs_chunk
  event_object:
    seq:
      - id: node
        type: node
      - id: kevt_magic
        type: w3id
      - id: num_track
        type: u4
      - id: global_sequence_id
        type: u4
      - id: track_chunk
        type: u4
        repeat: expr
        repeat-expr: num_track
  segment_color:
    seq:
      - id: color1
        type: f4
      - id: color2
        type: f4
      - id: color3
        type: f4
  camera:
    seq:
      - id: inclusive_size
        type: u4
      - id: camera_payload
        type: camera_payload
        size: inclusive_size - 4
  camera_payload:
    seq:
      - id: name
        type: str
        encoding: UTF-8
        size: 80
      - id: position1
        type: f4
      - id: position2
        type: f4
      - id: position3
        type: f4
      - id: field_of_view
        type: f4
      - id: far_clipping_plane
        type: f4
      - id: near_clipping_plane
        type: f4
      - id: target_position1
        type: f4
      - id: target_position2
        type: f4
      - id: target_position3
        type: f4
      - id: camera_track_chunk_router
        type: camera_track_chunk_router
        repeat: eos
  camera_track_chunk_router:
    seq:
      - id: magic
        type: w3id
      - id: chunk
        type:
          switch-on: magic.value
          cases:
            '"KCTR"': kctr_chunk
            '"KTTR"': kttr_chunk
            '"KCRL"': kcrl_chunk
  collision_shape:
    seq:
      - id: node
        type: node
      - id: type
        type: u4
      - id: vertex
        type: f4
        repeat: expr
        repeat-expr: 3
      - id: radius
        type: f4
        if: type == 2 or type == 3
  face_effect:
    seq:
      - id: target
        type: str
        encoding: UTF-8
        size: 80
      - id: path
        type: str
        encoding: UTF-8
        size: 260
  corn_emitter:
    seq:
      - id: inclusive_size
        type: u4
      - id: node
        type: node
      - id: lifespan
        type: f4
      - id: emission_rate
        type: f4
      - id: speed
        type: f4
      - id: color1
        type: f4
      - id: color2
        type: f4
      - id: color3
        type: f4
      - id: color4
        type: f4
      - id: replaceable_id
        type: u4
      - id: path
        type: str
        encoding: UTF-8
        size: 260
      - id: flags
        type: str
        encoding: UTF-8
        size: 260
      - id: kppa_chunk
        type: kppa_chunk
      - id: kppc_chunk
        type: kppc_chunk
      - id: kppe_chunk
        type: kppe_chunk
      - id: kppl_chunk
        type: kppl_chunk
      - id: kpps_chunk
        type: kpps_chunk
      - id: kppv_chunk
        type: kppv_chunk
  kgtr_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4_3") #translation
  kgrt_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4_4") #rotation
  kgsc_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4_3") #scaling
  kmtf_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("u4") #texture_id
  kmta_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4") #alpha, f4
  kmte_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4") #emissive_gain, f4
  kfc3_chunk:
    seq:
      - id: fresnel_color
        type: f4
        repeat: expr
        repeat-expr: 3
  kfca_chunk:
    seq:
      - id: fresnel_alpha
        type: f4
  kfct_chunk:
    seq:
      - id: fresnel_team_color
        type: f4
  ktat_chunk:
    seq:
      - id: translation
        type: f4
        repeat: expr
        repeat-expr: 3
  ktar_chunk:
    seq:
      - id: rotation
        type: f4
        repeat: expr
        repeat-expr: 4
  ktas_chunk:
    seq:
      - id: scaling
        type: f4
        repeat: expr
        repeat-expr: 3
  kgac_chunk:
    seq:
      - id: color
        type: f4
        repeat: expr
        repeat-expr: 3
  klas_chunk:
    seq:
      - id: attenuation_start
        type: f4
  klae_chunk:
    seq:
      - id: attenuation_end
        type: f4
  klac_chunk:
    seq:
      - id: color
        type: f4
        repeat: expr
        repeat-expr: 3
  klai_chunk:
    seq:
      - id: intensity
        type: f4
  klbi_chunk:
    seq:
      - id: ambient_intensity
        type: f4
  klbc_chunk:
    seq:
      - id: ambient_color
        type: f4
        repeat: expr
        repeat-expr: 3
  klav_chunk:
    seq:
      - id: visibility
        type: f4
  katv_chunk:
    seq:
      - id: value
        type: track_chunk_parametric_no_magic("f4") #visibility
  kpee_chunk:
    seq:
      - id: emission_rate
        type: f4
  kpeg_chunk:
    seq:
      - id: gravity
        type: f4
  kpln_chunk:
    seq:
      - id: longitude
        type: f4
  kplt_chunk:
    seq:
      - id: latitude
        type: f4
  kpel_chunk:
    seq:
      - id: lifespan
        type: f4
  kpes_chunk:
    seq:
      - id: speed
        type: f4
  kpev_chunk:
    seq:
      - id: visibility
        type: f4
  kp2e_chunk:
    seq:
      - id: emission_rate
        type: f4
  kp2g_chunk:
    seq:
      - id: gravity
        type: f4
  kp2l_chunk:
    seq:
      - id: latitude
        type: f4
  kp2s_chunk:
    seq:
      - id: speed
        type: f4
  kp2v_chunk:
    seq:
      - id: visibility
        type: f4
  kp2r_chunk:
    seq:
      - id: variation
        type: f4
  kp2n_chunk:
    seq:
      - id: length
        type: f4
  kp2w_chunk:
    seq:
      - id: width
        type: f4
  krvs_chunk:
    seq:
      - id: visibility
        type: f4
  krha_chunk:
    seq:
      - id: height_above
        type: f4
  krhb_chunk:
    seq:
      - id: height_below
        type: f4
  kral_chunk:
    seq:
      - id: alpha
        type: f4
  krco_chunk:
    seq:
      - id: color
        type: f4
        repeat: expr
        repeat-expr: 3
  krtx_chunk:
    seq:
      - id: texture_slot
        type: u4
  kctr_chunk:
    seq:
      - id: translation
        type: f4
        repeat: expr
        repeat-expr: 3
  kcrl_chunk:
    seq:
      - id: rotation
        type: f4
  kttr_chunk:
    seq:
      - id: target_translation
        type: f4
        repeat: expr
        repeat-expr: 3
  kppa_chunk:
    seq:
      - id: alpha
        type: f4
  kppc_chunk:
    seq:
      - id: color
        type: f4
        repeat: expr
        repeat-expr: 3
  kppe_chunk:
    seq:
      - id: emission_rate
        type: f4
  kppl_chunk:
    seq:
      - id: lifespan
        type: f4
  kpps_chunk:
    seq:
      - id: speed
        type: f4
  kppv_chunk:
    seq:
      - id: visibility
        type: f4
  track_chunk:
    #params:
    #  - id: value_type
    #    type: str
    seq:
      - id: magic
        type: w3id
      - id: num_track
        type: u4
      - id: interpolation_type
        type: u4
      - id: global_sequence_id
        type: u4
      - id: track
        type: track("u4", interpolation_type)
        repeat: expr
        repeat-expr: num_track
  track_chunk_parametric:
    params:
      - id: value_type
        type: str
    seq:
      - id: magic
        type: w3id
      - id: num_track
        type: u4
      - id: interpolation_type
        type: u4
      - id: global_sequence_id
        type: u4
      - id: track
        type: track(value_type, interpolation_type)
        repeat: expr
        repeat-expr: num_track
  track_chunk_parametric_no_magic:
    params:
      - id: value_type
        type: str
    seq:
      - id: num_track
        type: u4
      - id: interpolation_type
        type: u4
      - id: global_sequence_id
        type: u4
      - id: track
        type: track(value_type, interpolation_type)
        repeat: expr
        repeat-expr: num_track
  track:
    params:
      - id: value_type
        type: str
      - id: interpolation_type
        type: u4
    seq:
      - id: frame
        type: s4
      - id: value
        type:
          switch-on: value_type
          cases:
            "'u4'": u4
            "'f4'": f4
            "'f4_3'": f4_3
            "'f4_4'": f4_4
            _: u4
      - id: in_tan
        type:
          switch-on: value_type
          cases:
            "'u4'": u4
            "'f4'": f4
            "'f4_3'": f4_3
            "'f4_4'": f4_4
            _: u4
        if: interpolation_type > 1
      - id: out_tan
        type:
          switch-on: value_type
          cases:
            "'u4'": u4
            "'f4'": f4
            "'f4_3'": f4_3
            "'f4_4'": f4_4
            _: u4
        if: interpolation_type > 1
  f4_3:
    seq:
      - id: value
        type: f4
        repeat: expr
        repeat-expr: 3
  f4_4:
    seq:
      - id: value
        type: f4
        repeat: expr
        repeat-expr: 4
  node:
    seq:
      - id: inclusive_size
        type: u4
      - id: node_payload
        type: node_payload
        size: inclusive_size - 4
  node_payload:
    seq:
      - id: name
        type: str
        encoding: UTF-8
        size: 80
      - id: object_id
        type: u4
      - id: parent_id
        type: u4
      - id: flags
        type: u4
      - id: track_chunk
        type: node_track_router
        repeat: eos
  node_track_router:
    seq:
      - id: magic
        type: w3id
      - id: chunk
        type:
          switch-on: magic.value
          cases:
            '"KGTR"': kgtr_chunk
            '"KGRT"': kgrt_chunk
            '"KGSC"': kgsc_chunk
#enum:
  #chunk_magic:
    #"VERS": vers