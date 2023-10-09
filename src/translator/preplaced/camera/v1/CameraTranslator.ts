import { Service } from 'typedi'
import { type Camera } from '../../../../data/editor/preplaced/camera/Camera'
import { type VersionedBinaryToJsonConverter } from '../../../VersionedBinaryToJsonConverter'
import { W3Buffer } from '../../../W3Buffer'
import { type integer } from '../../../../data/editor/common/DataTypes'

@Service()
export class CameraTranslator implements VersionedBinaryToJsonConverter<Camera[]> {
  private readonly expectedFileVersion: integer = 0

  public canTranslate (buffer: Buffer): boolean {
    const w3Buffer = new W3Buffer(Buffer.from(buffer))
    const fileVersion = w3Buffer.readInt()
    return this.canTranslateFor(fileVersion)
  }

  public translate (buffer: Buffer): JSONTranslationResult<Camera[]> {
    const resultObject: JSONTranslationResult<Camera[]> = {
      result: [],
      errors: [],
      warnings: []
    }
    const outBufferToJSON = new W3Buffer(buffer)

    const fileVersion = outBufferToJSON.readInt() // File version

    if (!this.canTranslateFor(fileVersion)) {
      resultObject.warnings.push((
        new Error(`Attempting to translate with translator not intended for following data: 
              fileVersion: ${fileVersion}\t\tExpected: ${this.expectedFileVersion}`)))
    }

    const numCameras = outBufferToJSON.readInt() // # of cameras
    for (let i = 0; i < numCameras; i++) {
      const camera: Camera = {
        target: {
          x: 0,
          y: 0,
          z: 0
        },
        rotation: 0,
        angleOfAttack: 0,
        distance: 0,
        roll: 0,
        fieldOfView: 0,
        farClipping: 0,
        name: ''
      }

      camera.target.x = outBufferToJSON.readFloat()
      camera.target.y = outBufferToJSON.readFloat()
      camera.target.z = outBufferToJSON.readFloat()
      camera.rotation = outBufferToJSON.readFloat()
      camera.angleOfAttack = outBufferToJSON.readFloat() // angle of attack
      camera.distance = outBufferToJSON.readFloat()
      camera.roll = outBufferToJSON.readFloat()
      camera.fieldOfView = outBufferToJSON.readFloat() // field of view
      camera.farClipping = outBufferToJSON.readFloat()
      outBufferToJSON.readFloat() // consume this unknown float field
      camera.name = outBufferToJSON.readString()

      resultObject.result.push(camera)
    }

    return resultObject
  }

  private canTranslateFor (fileVersion: integer): boolean {
    return fileVersion === this.expectedFileVersion
  }
}
