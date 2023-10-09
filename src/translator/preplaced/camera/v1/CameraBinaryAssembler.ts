import { Service } from 'typedi'
import { type JsonToBinaryConverter } from '../../../JsonToBinaryConverter'
import { type Camera } from '../../../../data/editor/preplaced/camera/Camera'
import { type HexBuffer } from '../../../../wc3maptranslator/HexBuffer'
import { type BinaryTranslationResult } from '../../../BinaryTranslationResult'

@Service()
export class CameraBinaryAssembler implements JsonToBinaryConverter<Camera[]> {
  public canTranslate (...metadata: Array<string | number>): boolean {
    return metadata.length > 1 && metadata[0] === 0
  }

  public translate (outBufferToWar: HexBuffer, data: Camera[], ...metadata: Array<string | number>): BinaryTranslationResult {
    const errors = new Array<Error>()
    const warnings = new Array<Error>()

    /*
    * Header
    */
    outBufferToWar.addInt(0) // file version
    outBufferToWar.addInt(data.length) // number of cameras

    /*
    * Body
    */
    data.forEach((camera) => {
      outBufferToWar.addFloat(camera.target.x)
      outBufferToWar.addFloat(camera.target.y)
      outBufferToWar.addFloat(camera.target.z)
      outBufferToWar.addFloat(camera.rotation != null ? camera.rotation : 0) // optional
      outBufferToWar.addFloat(camera.angleOfAttack)
      outBufferToWar.addFloat(camera.distance)
      outBufferToWar.addFloat(camera.roll != null ? camera.roll : 0)
      outBufferToWar.addFloat(camera.fieldOfView)
      outBufferToWar.addFloat(camera.farClipping)
      outBufferToWar.addFloat(100) // (?) unknown - usually set to 100

      // Camera name - must be null-terminated
      outBufferToWar.addString(camera.name)
    })

    return {
      errors,
      warnings
    }
  }
}
