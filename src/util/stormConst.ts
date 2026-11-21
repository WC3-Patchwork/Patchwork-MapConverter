export const StormInvalid = 0xffffffff;

export const enum MpqCreateFlag {
    listfile = 0x00100000,
    attributes = 0x00200000,
    signature = 0x00400000,
    v1 = 0x00000000,
    v2 = 0x01000000,
    v3 = 0x02000000,
    v4 = 0x03000000,
}
export const MpqCreateVersionMask = 0x0f000000;

export const enum MpqOpenFlag {
    from_mpq = 0x00000000,
    check_exist = 0xfffffffc,
    base_file = 0xfffffffd,
    any_locale = 0xfffffffe,
    local_file = 0xffffffff,
}

export const enum MpqFileFlag {
    implode = 0x00000100,
    compress = 0x00000200,
    encrypted = 0x00010000,
    fix_key = 0x00020000,
    patch_file = 0x00100000,
    single_unit = 0x01000000,
    delete_marker = 0x02000000,
    sector_crc = 0x04000000,
    signature = 0x10000000,
    exists = 0x80000000,
    replace_existing = 0x80000000,
}

export const enum MpqCompressionType {
    huffman = 0x01,
    zlib = 0x02,
    pkware = 0x08,
    bzip2 = 0x10,
    sparse = 0x20,
    adpcm_mono = 0x40,
    adpcm_stereo = 0x80,
    lzma = 0x12,
    next_same = 0xffffffff,
}

export const enum MpqWaveQuality {
    high = 0,
    medium = 1,
    low = 2,
}

export const enum MpqAttributeFlag {
    crc32 = 0x00000001,
    file_time = 0x00000002,
    md5 = 0x00000004,
    patch_bit = 0x00000008,
    all = 0x0000000f,
}

export const enum MpqBaseProvider {
    file = 0x00000000,
    map = 0x00000001,
    mpq = 0x00000002,
    http = 0x00000003,
}
export const MpqBaseProviderMask = 0x0000000f;

export const enum MpqStreamProvider {
    flat = 0x00000000,
    partial = 0x00000010,
    mpqe = 0x00000020,
    block4 = 0x00000030,
}
export const MpqStreamProviderMask = 0x000000f0;

export const enum SeekMethod {
    begin = 0,
    current = 1,
    end = 2,
}

export const enum SFileInfoClass {
    MpqFileName = 0,
    MpqStreamBitmap = 1,
    MpqUserDataOffset = 2,
    MpqUserDataHeader = 3,
    MpqUserData = 4,
    MpqHeaderOffset = 5,
    MpqHeaderSize = 6,
    MpqHeader = 7,
    MpqHetTableOffset = 8,
    MpqHetTableSize = 9,
    MpqHetHeader = 10,
    MpqHetTable = 11,
    MpqBetTableOffset = 12,
    MpqBetTableSize = 13,
    MpqBetHeader = 14,
    MpqBetTable = 15,
    MpqHashTableOffset = 16,
    MpqHashTableSize64 = 17,
    MpqHashTableSize = 18,
    MpqHashTable = 19,
    MpqBlockTableOffset = 20,
    MpqBlockTableSize64 = 21,
    MpqBlockTableSize = 22,
    MpqBlockTable = 23,
    MpqHiBlockTableOffset = 24,
    MpqHiBlockTableSize64 = 25,
    MpqHiBlockTable = 26,
    MpqSignatures = 27,
    MpqStrongSignatureOffset = 28,
    MpqStrongSignatureSize = 29,
    MpqStrongSignature = 30,
    MpqArchiveSize64 = 31,
    MpqArchiveSize = 32,
    MpqMaxFileCount = 33,
    MpqFileTableSize = 34,
    MpqSectorSize = 35,
    MpqNumberOfFiles = 36,
    MpqRawChunkSize = 37,
    MpqStreamFlags = 38,
    MpqFlags = 39,
    InfoPatchChain = 40,
    InfoFileEntry = 41,
    InfoHashEntry = 42,
    InfoHashIndex = 43,
    InfoNameHash1 = 44,
    InfoNameHash2 = 45,
    InfoNameHash3 = 46,
    InfoLocale = 47,
    InfoFileIndex = 48,
    InfoByteOffset = 49,
    InfoFileTime = 50,
    InfoFileSize = 51,
    InfoCompressedSize = 52,
    InfoFlags = 53,
    InfoEncryptionKey = 54,
    InfoEncryptionKeyRaw = 55,
    InfoCRC32 = 56,
    InfoMD5 = 57,
}

export const enum MpqLang {
    Neutral = 0,
    Chinese = 0x404,
    English = 0x409,
    Russian = 0x419,
    EnglishUK = 0x809,
}
