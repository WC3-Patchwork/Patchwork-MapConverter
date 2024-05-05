export interface VersionedBinaryToJsonConverter<T> {
  canTranslate: (buffer: Buffer) => boolean
  translate: (buffer: Buffer) => T
}
