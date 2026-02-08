import { KoffiFunction } from 'koffi';

export interface ArchiveCreateOption {
	/**
	 * Size of this option object
	 */
	cbSize: number;
	/**
	 * Always 0
	 */
	mpqVersion: number;
	StreamFlags: number;
	/**
	 * (listfile) file flags, must either be 0xFFFFFFF or 0
	 */
	FileFlags1: number;
	/**
	 * (attributes) file flags, must either be 0xFFFFFFF or 0
	 */
	FileFlags2: number;
	/**
	 * (signature) file flags, must either be 0xFFFFFFF or 0
	 */
	FileFlags3: number;
	/**
	 * Flags for file attribute
	 */
	AttrFlags: number;
	/**
	 * Always 0x100
	 */
	SectorSize: number;
	/**
	 * Always 0
	 */
	RawChunkSize: number;
	MaxFileCount: number;
}

export enum ArchiveCreateFlag {
	/**
	 * Also add the (listfile) file
	 */
	MPQ_CREATE_LISTFILE = 0x00100000,
	/**
	 * Also add the (attributes) file
	 */
	MPQ_CREATE_ATTRIBUTES = 0x00200000,
	/**
	 * Also add the (signature) file
	 */
	MPQ_CREATE_SIGNATURE = 0x00400000,
	/**
	 * Creates archive of version 1 (size up to 4GB)
	 */
	MPQ_CREATE_ARCHIVE_V1 = 0x00000000,
	/**
	 * Mask for archive version
	 */
	MPQ_CREATE_ARCHIVE_VMASK = 0x0f000000,
	/**
	 * The "(attributes)" contains CRC32 for each file
	 */
	MPQ_ATTRIBUTE_CRC32 = 0x00000001,
	/**
	 * The "(attributes)" contains file time for each file
	 */
	MPQ_ATTRIBUTE_FILETIME = 0x00000002,
	/**
	 * The "(attributes)" contains MD5 for each file
	 */
	MPQ_ATTRIBUTE_MD5 = 0x00000004,
	/**
	 * The "(attributes)" contains a patch bit for each file
	 */
	MPQ_ATTRIBUTE_PATCH_BIT = 0x00000008,
	/**
	 * Summary mask
	 */
	MPQ_ATTRIBUTE_ALL = 0x0000000f,
}

export enum ArchiveAddFileFlags {
	/**
	 * The file will be compressed using IMPLODE compression method.
	 *
	 * This flag cannot be used together with MPQ_FILE_COMPRESS.
	 *
	 * If this flag is present, then the dwCompression and dwCompressionNext parameters are ignored.
	 *
	 * @deprecated This flag is obsolete and was used only in Diablo I
	 */
	MPQ_FILE_IMPLODE = 0x00000100,
	/**
	 * The file will be compressed.
	 *
	 * This flag cannot be used together with MPQ_FILE_IMPLODE
	 */
	MPQ_FILE_COMPRESS = 0x00000200,
	/**
	 * The file will be stored as encrypted.
	 */
	MPQ_FILE_ENCRYPTED = 0x00001000,
	/**
	 * The file's encryption key will be adjusted according to file size in the archive.
	 *
	 * This flag must be used together with MPQ_FILE_ENCRYPTED.
	 */
	MPQ_FILE_FIX_KEY = 0x00002000,
	/**
	 * The file will have the deletion marker.
	 */
	MPQ_FILE_DELETE_MARKER = 0x02000000,
	/**
	 * The file will have CRC for each file sector.
	 *
	 * Ignored if the file is not compressed or if the file is stored as single unit.
	 */
	MPQ_FILE_SECTOR_CRC = 0x04000000,
	/**
	 * The file will be added as single unit.
	 *
	 * Files stored as single unit cannot be encrypted, because Blizzard doesn't support them.
	 */
	MPQ_FILE_SINGLE_UNIT = 0x01000000,
	/**
	 * If this flag is specified and the file is already in the MPQ, it will be replaced.
	 */
	MPQ_FILE_REPLACEEXISTING = 0x80000000,
}

export enum ArchiveOpenFlag {
	/**
	 * The MPQ is plain linear file, and is in local file.
	 *
	 * The file can have a block bitmap at the end, indicating that some file blocks may be missing.
	 *
	 * This is the default value.
	 */
	Default = 0,
	/**
	 * The MPQ is stored in partial file.
	 *
	 * Partial files were used by trial version of World of Warcraft (build 10958 - 11685).
	 */
	STREAM_PROVIDER_PARTIAL = 0x10,
	/**
	 * The MPQ is encrypted (.MPQE). Encrypted MPQs are used by Starcraft II and Diablo III installers.
	 *
	 * StormLib attempts to use all known keys. If no key can be used for decrypting the MPQ, the open operation fails.
	 */
	STREAM_PROVIDER_MPQE = 0x20,
	/**
	 * The MPQ divided to multiple blocks and multiple files.
	 *
	 * Size of one block is 0x4000 bytes, maximum number of blocks per file is 0x2000.
	 *
	 * Each block is followed by MD5 hash in plain ANSI text form.
	 *
	 * If the total number of blocks in the archive is greater than 0x2000,
	 * then the archive is split into multiple files.
	 *
	 * These files have decimal numeric extensions in ascending order (.MPQ.0, .MPQ.1, .MPQ.2 and so on).
	 */
	STREAM_PROVIDER_BLOCK4 = 0x30,
	/**
	 * The MPQ is in local file.
	 *
	 * Stormlib will attempt to map the file into memory.
	 *
	 * This speeds up the MPQ operations (reading, verifying),
	 * but has size and operating system limitations.
	 */
	BASE_PROVIDER_MAP = 0x1,
	/**
	 * The MPQ is on a web server available via HTTP protocol.
	 *
	 * The server must support random access. Only supported in Windows.
	 */
	BASE_PROVIDER_HTTP = 0x2,
	/**
	 * This flag causes the file to be open read-only.
	 *
	 * This flag is automatically set for partial and encrypted MPQs,
	 * and also for all MPQs that are not open from BASE_PROVIDER_FILE.
	 */
	STREAM_FLAG_READ_ONLY = 0x100,
	/**
	 * This flag causes the writable MPQ being open for write share.
	 *
	 * Use with caution. If two applications write to an open MPQ simultaneously, the MPQ data get corrupted.
	 */
	STREAM_FLAG_WRITE_SHARE = 0x200,
	/**
	 * This flag tells the file stream handler to respect a file bitmap.
	 *
	 * File bitmap is used by MPQs whose file blocks are downloaded on demand by the game.
	 */
	STREAM_FLAG_USE_BITMAP = 0x400,
	/**
	 * Don't read the "(listfile)" file.
	 */
	MPQ_OPEN_NO_LISTFILE = 0x10000,
	/**
	 * Don't open the "(attributes)" file.
	 */
	MPQ_OPEN_NO_ATTRIBUTES = 0x20000,
	/**
	 * Do not search the header at 0x200 byte offsets.
	 */
	MPQ_OPEN_NO_HEADER_SEARCH = 0x40000,
	/**
	 * Forces the MPQ to be open as MPQ format 1.0, ignoring "wFormatVersion" variable in the header.
	 */
	MPQ_OPEN_FORCE_MPQ_V1 = 0x80000,
	/**
	 * ReadFile will check CRC of each file sector on any file in the archive until the archive is closed.
	 */
	MPQ_OPEN_CHECK_SECTOR_CRC = 0x100000,
}

export enum ErrorCode {
	ERROR_SUCCESS = 0,
	ERROR_FILE_NOT_FOUND = 2,
	ERROR_ACCESS_DENIED = 5,
	ERROR_INVALID_HANDLE = 6,
	ERROR_NOT_ENOUGH_MEMORY = 8,
	ERROR_BAD_FORMAT = 11,
	ERROR_OUTOFMEMORY = 14,
	ERROR_HANDLE_EOF = 38,
	ERROR_INVALID_PARAMETER = 87,
	ERROR_DISK_FULL = 112,
	ERROR_ALREADY_EXISTS = 183,
	ERROR_CAN_NOT_COMPLETE = 1003,
	ERROR_FILE_CORRUPT = 1386,
	ERROR_AVI_FILE = 10000,
	ERROR_UNKNOWN_FILE_KEY = 10001,
	ERROR_CHECKSUM_ERROR = 10002,
	ERROR_INTERNAL_FILE = 10003,
	ERROR_BASE_FILE_MISSING = 10004,
	ERROR_MARKED_FOR_DELETE = 10005,
	ERROR_FILE_INCOMPLETE = 10006,
	ERROR_UNKNOWN_FILE_NAMES = 10007,
	ERROR_CANT_FIND_PATCH_PREFIX = 10008,
	ERROR_FAKE_MPQ_HEADER = 10009,
	ERROR_FILE_DELETED = 100,
}

export enum MPQCompressFlag {
	/**
	 * Use Huffman compression. This bit can only be combined with MPQ_COMPRESSION_ADPCM_MONO or MPQ_COMPRESSION_ADPCM_STEREO.
	 */
	MPQ_COMPRESSION_HUFFMANN = 0x01,
	/**
	 * Use ZLIB compression library. This bit cannot be combined with MPQ_COMPRESSION_BZIP2 or MPQ_COMPRESSION_LZMA.
	 */
	MPQ_COMPRESSION_ZLIB = 0x02,
	/**
	 * Use Pkware Data Compression Library. This bit cannot be combined with MPQ_COMPRESSION_LZMA.
	 */
	MPQ_COMPRESSION_PKWARE = 0x08,
	/**
	 * Use BZIP2 compression library. This bit cannot be combined with MPQ_COMPRESSION_ZLIB or MPQ_COMPRESSION_LZMA.
	 */
	MPQ_COMPRESSION_BZIP2 = 0x10,
	/**
	 * Use SPARSE compression. This bit cannot be combined with MPQ_COMPRESSION_LZMA.
	 */
	MPQ_COMPRESSION_SPARSE = 0x20,
	/**
	 * Use IMA ADPCM compression for 1-channel (mono) WAVE files. This bit can only be combined with MPQ_COMPRESSION_HUFFMANN. This is lossy compression and should only be used for compressing WAVE files.
	 */
	MPQ_COMPRESSION_ADPCM_MONO = 0x40,
	/**
	 * Use IMA ADPCM compression for 2-channel (stereo) WAVE files. This bit can only be combined with MPQ_COMPRESSION_HUFFMANN. This is lossy compression and should only be used for compressing WAVE files.
	 */
	MPQ_COMPRESSION_ADPCM_STEREO = 0x80,
	/**
	 * Use LZMA compression. This value can not be combined with any other compression method.
	 */
	MPQ_COMPRESSION_LZMA = 0x12,
}

export enum ArchiveCompactWorkType {
	/**
	 * Checking if all files in the archive are known.
	 */
	CBC_CHECKING_FILE = 1,
	/**
	 * Checking hash table of the archive.
	 */
	CBC_CHECKING_HASH_TABLE,
	/**
	 * Copying non-MPQ that precede the archive itself.
	 */
	CCB_COPYING_NON_MPQ_DATA,
	/**
	 * Writing the files to the new MPQ.
	 */
	CCB_COMPACTING_FILES,
	/**
	 * Closing the MPQ.
	 */
	CCB_CLOSING_ARCHIVE,
}

export type CBCCallback = (workType: ArchiveCompactWorkType, bytesProcessed: bigint, totalBytes: bigint) => void;

export interface StormLib {
	/**
	 *
	 * @param path
	 * @param flags
	 * @see {@link ArchiveOpenFlag} for the flags args
	 * @returns An opaque "pointer" to a handle, it SHALL NOT BE MODIFIED, it SHALL ONLY BE PASSED TO OTHER STORM FUNCTION
	 */
	OpenArchive(path: string, flags: number): MPQHANDLE;
	CreateArchive(name: string, flags: number, maxFileCount: bigint): MPQHANDLE;
	CreateArchiveEx(name: string, options: ArchiveCreateOption): MPQHANDLE;
	ArchiveFlush(archive: MPQHANDLE): true;
	ArchiveClose(archive: MPQHANDLE): true;
	ArchiveSetMaxFile(archive: MPQHANDLE, count: bigint): void;
	ArchiveGetMaxFile(archive: MPQHANDLE): number | bigint;
	ArchiveCompact(archive: MPQHANDLE, listfile?: string, callback?: CBCCallback): void;
	/**
	 * Open a file on MPQ
	 * @param archive
	 * @param fileName
	 * @returns
	 */
	ArchiveOpenFile(archive: HANDLE, fileName: string): FILEHANDLE;
	/**
	 * It's up to you to decide what is the underlying data of this file
	 * @param file
	 * @returns
	 */
	ArchiveFileReadFile(file: FILEHANDLE): Buffer;
	ArchiveFileCloseFile(file: FILEHANDLE): void;
	ArchiveHasFile(archive: MPQHANDLE, fileName: string): boolean;
	/**
	 * Create a new empty file within the MPQ
	 * @param archive
	 * @param storePath
	 * @param filetime
	 * @param size
	 * @param flags
	 * @param locale
	 * @returns
	 */
	CreateFile(archive: MPQHANDLE, storePath: string, size: number, flags: number, locale?: number): FILEHANDLE;
	CreateFileEx(archive: MPQHANDLE, storePath: string, data: Buffer, flags: number, locale?: number): void;
	/**
	 * Write data to a newly created empty file within the MPQ
	 * @param file
	 * @param data
	 */
	ArchiveFileWriteFile(file: FILEHANDLE, data: Buffer): void;
	ArchiveFileFinishWriteFile(file: FILEHANDLE): void;
	ArchiveAddFile(mpq: MPQHANDLE, from: string, storePath: string, flags?: number): void;
	ArchiveRemoveFile(mpq: MPQHANDLE, fileName: string): void;
	ArchiveRenameFile(mpq: MPQHANDLE, oldName: string, newName: string): void;
}

export interface StormNative {
	openMPQ: KoffiFunction;
	createMPQ: KoffiFunction;
	createMPQ2: KoffiFunction;
	flushMPQ: KoffiFunction;
	closeMPQ: KoffiFunction;
	setMaxFile: KoffiFunction;
	getMaxFile: KoffiFunction;
	compactArchive: KoffiFunction;
	compactCallback: KoffiFunction;
	fileOpen: KoffiFunction;
	fileSize: KoffiFunction;
	fileSetPtr: KoffiFunction;
	fileRead: KoffiFunction;
	fileClose: KoffiFunction;
	fileExist: KoffiFunction;
	fileGetName: KoffiFunction;
	fileCreate: KoffiFunction;
	fileWrite: KoffiFunction;
	fileWriteFinish: KoffiFunction;
	fileAdd: KoffiFunction;
	fileRem: KoffiFunction;
	fileRen: KoffiFunction;
	errGet: KoffiFunction;
}

// we have to disable that rule, because we want the types to be FIXED, UNABLE TO MODIFY
// using interface will allow user to add shit to the types which is NOT EXPECTED
/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare const __handle_marker: unique symbol;
export type HANDLE = { readonly __brandH: 'HANDLE'; readonly [__handle_marker]?: never };
export type FILEHANDLE = { readonly __brandFH: 'FILEHANDLE'; readonly [__handle_marker]?: never } & HANDLE;
export type MPQHANDLE = { readonly __brandMH: 'MPQHANDLE'; readonly [__handle_marker]?: never } & HANDLE;
/* eslint-enable @typescript-eslint/consistent-type-definitions */
