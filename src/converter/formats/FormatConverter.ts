export interface FormatConverter {
  parse: (str: string) => unknown
  stringify: (obj: unknown) => string
}
