export const ArrayManipulationUtils = {
  splitLargeArrayIntoWidthArrays<T>(array: T[], width: number): T[][] {
    const rows: T[][] = []
    for (let i = 0; i < array.length / width; i++) {
      rows.push(array.slice(i * width, (i + 1) * width))
    }
    return rows
  },

  convertArrayOfArraysIntoFlatArray<T>(arr: T[][]): T[] {
    return arr.reduce((a: T[], b: T[]) => {
      return [...a, ...b]
    })
  }
}
