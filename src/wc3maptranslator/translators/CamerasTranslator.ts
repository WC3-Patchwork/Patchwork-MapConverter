import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type WarResult, type JsonResult } from '../CommonInterfaces'
import { type Translator } from './Translator'
import { type Camera } from '../data/Camera'

export class CamerasTranslator implements Translator<Camera[]> {
  private static instance: CamerasTranslator

  private constructor () { }

  public static getInstance (): CamerasTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (cameras: Camera[]): WarResult {
    return this.getInstance().jsonToWar(cameras)
  }

  public static warToJson (buffer: Buffer): JsonResult<Camera[]> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar (cameras: Camera[]): WarResult {
    const output = new HexBuffer()

    output.addInt(0) // file version
    output.addInt(cameras?.length ?? 0) // number of cameras
    cameras?.forEach((camera) => {
      output.addFloat(camera.target[0])
      output.addFloat(camera.target[1])
      output.addFloat(camera.target[2])
      output.addFloat(camera.rotation ?? 0)
      output.addFloat(camera.angleOfAttack)
      output.addFloat(camera.distance)
      output.addFloat(camera.roll ?? 0)
      output.addFloat(camera.fieldOfView)
      output.addFloat(camera.farClipping)
      output.addFloat(camera.float1)
      output.addString(camera.name)
    })

    return {
      errors: [],
      buffer: output.getBuffer()
    }
  }

  public warToJson (buffer: Buffer): JsonResult<Camera[]> {
    const result: Camera[] = []
    const input = new W3Buffer(buffer)

    const fileVersion = input.readInt()
    const numCameras = input.readInt()
    for (let i = 0; i < numCameras; i++) {
      result[i] = {
        target: [input.readFloat(), input.readFloat(), input.readFloat()],
        rotation: input.readFloat(),
        angleOfAttack: input.readFloat(),
        distance: input.readFloat(),
        roll: input.readFloat(),
        fieldOfView: input.readFloat(),
        farClipping: input.readFloat(),
        float1: input.readFloat(),
        name: input.readString()
      }
    }

    return {
      errors: [],
      json: result
    }
  }
}
