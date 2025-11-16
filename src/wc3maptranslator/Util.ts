export function deg2Rad (angleInDegrees: number): number {
  return angleInDegrees * Math.PI / 180
}

export function rad2Deg (angleInRadians: number): number {
  return angleInRadians * 180 / Math.PI
}

export function mergeBoolRecords<T extends Record<string, boolean>> (src: T, backup: T): T {
  if (src == null) {
    return { ...backup }
  } else {
    return { ...backup, ...src }
  }
}
