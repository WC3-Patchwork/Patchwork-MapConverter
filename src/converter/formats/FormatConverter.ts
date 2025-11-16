export interface FormatConverter {
  parse: (str: string) => object
  stringify: (obj: object) => string
}
