/**
 * @type angle - An angle is measured in degrees, 0 <= angle < 360
 * War3 binaries have angles written in Radians, while JSON will have them in positive degrees
 */
export type angle = number

function truncateDegrees (angleDegrees: angle): angle {
  return angleDegrees % 360
}

function makeDegreesPositive (angleDegrees: angle): angle {
  if (angleDegrees < 0) {
    return 360 + truncateDegrees(angleDegrees)
  } else {
    return truncateDegrees(angleDegrees)
  }
}

function truncateRadians (angleRadians: angle): angle {
  return angleRadians % (2 * Math.PI)
}

function makeRadiansPositive (angleRadians: angle): angle {
  if (angleRadians < 0) {
    return (2 * Math.PI) + truncateRadians(angleRadians)
  } else {
    return truncateRadians(angleRadians)
  }
}

export function deg2Rad (angleInDegrees: number): number {
  return makeRadiansPositive(angleInDegrees * Math.PI / 180)
}

export function rad2Deg (angleInRadians: number): number {
  return makeDegreesPositive(angleInRadians * 180 / Math.PI)
}
