interface JSONTranslationResult<T> {
  result: T
  errors: Error[]
  warnings: Error[]
}
