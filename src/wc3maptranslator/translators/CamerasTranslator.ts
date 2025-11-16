import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type integer } from '../CommonInterfaces'
import { type Camera } from '../data/Camera'
import { LoggerFactory } from '../../logging/LoggerFactory'

const log = LoggerFactory.createLogger('CamerasTranslator')

export function jsonToWar (cameras: Camera[], [formatVersion, editorVersion]: [integer, integer]): Buffer {
  if (formatVersion !== 0) {
    throw new Error(`Unknown file format version=${formatVersion} for cameras file, expected 0.`)
  }
  const output = new HexBuffer()

  output.addInt(formatVersion) // file version
  output.addInt(cameras?.length ?? 0) // number of cameras
  cameras?.forEach((camera) => {
    output.addFloat(camera.targetX)
    output.addFloat(camera.targetY)
    output.addFloat(camera.offsetZ)
    output.addFloat(camera.rotation)
    output.addFloat(camera.angleOfAttack)
    output.addFloat(camera.distance)
    output.addFloat(camera.roll)
    output.addFloat(camera.fieldOfView)
    output.addFloat(camera.farClipping)
    output.addFloat(camera.nearClipping)
    if (editorVersion >= 6071) { // if editor version is 1.30+
      output.addFloat(camera.localPitch ?? 0)
      output.addFloat(camera.localYaw ?? 0)
      output.addFloat(camera.localRoll ?? 0)
    }
    output.addString(camera.name)
  })

  return output.getBuffer()
}

export function warToJson (buffer: Buffer, editorVersion: integer): Camera[] {
  const input = new W3Buffer(buffer)
  const fileVersion = input.readInt()
  if (fileVersion !== 0) {
    log.warn(`Unknown camera file format version ${fileVersion} will attempt at reading...`)
  }

  const result: Camera[] = []
  const numCameras = input.readInt()
  for (let i = 0; i < numCameras; i++) {
    const targetX = input.readFloat()
    const targetY = input.readFloat()
    const offsetZ = input.readFloat()
    const rotation = input.readFloat()
    const angleOfAttack = input.readFloat()
    const distance = input.readFloat()
    const roll = input.readFloat()
    const fieldOfView = input.readFloat()
    const farClipping = input.readFloat()
    const nearClipping = input.readFloat()
    let localPitch = 0
    let localYaw = 0
    let localRoll = 0
    if (editorVersion >= 6071) { // if editor version is 1.30+
      localPitch = input.readFloat()
      localYaw = input.readFloat()
      localRoll = input.readFloat()
    }
    const name = input.readString()
    result[i] = { targetX, targetY, offsetZ, rotation, angleOfAttack, distance, roll, fieldOfView, farClipping, nearClipping, localPitch, localRoll, localYaw, name }
  }

  return result
}
