interface JSONExportResult<T> {
  result: T
  errors: Error[]
  warnings: Error[]
}
