import { HexBuffer } from '../HexBuffer'
import { W3Buffer } from '../W3Buffer'
import { type WarResult, type JsonResult, type color } from '../CommonInterfaces'
import { type Translator } from './Translator'
import { type Region } from '../data/Region'

export class RegionsTranslator implements Translator<Region[]> {
  private static instance: RegionsTranslator

  private constructor () {}

  public static getInstance (): RegionsTranslator {
    if (this.instance == null) {
      this.instance = new this()
    }
    return this.instance
  }

  public static jsonToWar (regions: Region[]): WarResult {
    return this.getInstance().jsonToWar(regions)
  }

  public static warToJson (buffer: Buffer): JsonResult<Region[]> {
    return this.getInstance().warToJson(buffer)
  }

  public jsonToWar (regionsJson: Region[]): WarResult {
    const output = new HexBuffer()
    output.addInt(5) // file version
    output.addInt(regionsJson?.length ?? 0) // number of regions
    regionsJson?.forEach(region => {
      output.addFloat(region.position.left)
      output.addFloat(region.position.bottom)
      output.addFloat(region.position.right)
      output.addFloat(region.position.top)
      output.addString(region.name)
      output.addInt(region.id)
      output.addChars(region.weatherEffect ?? '\0\0\0\0')
      output.addString(region.ambientSound ?? '') // May be empty string
      // Careful! The order in .w3r is BB GG RR AA, whereas the JSON spec order is [AA, RR, GG, BB]
      output.addByte(region.color[3]) // blue
      output.addByte(region.color[2]) // green
      output.addByte(region.color[1]) // red
      output.addByte(region.color[0]) // alpha
    })

    return {
      errors: [],
      buffer: output.getBuffer()
    }
  }

  public warToJson (buffer: Buffer): JsonResult<Region[]> {
    const result: Region[] = []
    const input = new W3Buffer(buffer)
    const fileVersion = input.readInt() // File version
    const numRegions = input.readInt() // # of regions
    for (let i = 0; i < numRegions; i++) {
      result[i] = {
        position: {
          left: input.readFloat(),
          bottom: input.readFloat(),
          right: input.readFloat(),
          top: input.readFloat()
        },
        name: input.readString(),
        id: input.readInt(),
        weatherEffect: input.readChars(4),
        ambientSound: input.readString(),
        // json wants it in ARGB, but .w3r file stores it as BB GG RR AA
        color: [input.readByte(), input.readByte(), input.readByte(), input.readByte()].reverse() as color
      }
    }

    return {
      errors: [],
      json: result
    }
  }
}
