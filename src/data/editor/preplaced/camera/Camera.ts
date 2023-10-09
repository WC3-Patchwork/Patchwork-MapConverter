/*
  war3map.w3c file format consists of the following:
  [integer] file version
  x = [integer] number of cameras
  for each x do
      [float] camera.target.x
      [float] camera.target.y
      [float] camera.target.z
      [float] rotation (angle)
      [float] aoe (angle)
      [float] distance
      [float] fov (angle)
      [float] farClipping
      [4 bytes - possibly float] unknown (set to 100.00)
      [string] name
  end
*/

import { type angle } from '../../common/Angle'
import { type Value3D } from '../../common/Value3D'

export interface Camera {
  target: Value3D
  rotation: angle
  angleOfAttack: angle
  distance: number
  roll: number
  fieldOfView: angle
  farClipping: number
  name: string
}
