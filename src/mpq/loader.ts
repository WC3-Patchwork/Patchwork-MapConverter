import ffi from 'koffi';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { type HANDLE, type ArchiveCreateOption, type CBCCallback, type FILEHANDLE, type MPQHANDLE, ArchiveAddFileFlags, StormNative, StormLib } from './types';
import assert from 'node:assert';
import { makeError } from './error';

let STORMLIB_IS_LOADED = false;
let storm: ffi.IKoffiLib;

/**
 * TS Wrapper interface for stormlib (ts wrapper - ffi wrapper - native calls)
 * This wrapper convert stormlib silent error into js throw error
 */
let lib: StormLib | undefined;
/**
 * FFI wrapper interface (ffi wrapper - native calls)
 * There is no type-hints here
 */
let natives: StormNative | undefined;

const uint32_max = BigInt('4294967294');



function mapStormLib() {
	// map stormlib function
	const DWORD = ffi.alias('DWORD', 'uint32_t');
	const TCHAR = ffi.alias('TCHAR', 'char');
	const ULONGLONG = ffi.alias('ULONGLONG', 'unsigned long long');
	const LONG = ffi.alias('LONG', 'long');
	const LCID = ffi.alias('LCID', 'unsigned int');
	const HANDLE = ffi.pointer('HANDLE', ffi.opaque());
	const VOIDP = ffi.opaque('void');
	const SFILE_COMPACT_CALLBACK = ffi.proto(
		`void WINAPI SFILE_COMPACT_CALLBACK(void * pvUserData, DWORD dwWorkType, ULONGLONG BytesProcessed, ULONGLONG TotalBytes)`
	);
	const SFILE_CREATE_MPQ = ffi.struct('SFILE_CREATE_MPQ', {
		cbSize: 'DWORD',
		dwMpqVersion: 'DWORD',
		pvUserData: 'void*',
		cbUserData: 'DWORD',
		dwStreamFlags: 'DWORD',
		dwFileFlags1: 'DWORD',
		dwFileFlags2: 'DWORD',
		dwFileFlags3: 'DWORD',
		dwAttrFlags: 'DWORD',
		dwSectorSize: 'DWORD',
		dwRawChunkSize: 'DWORD',
		dwMaxFileCount: 'DWORD',
	});

	const openMPQ = storm.func(
		`bool WINAPI SFileOpenArchive(const TCHAR * szMpqName, DWORD dwPriority, DWORD dwFlags, _Out_ HANDLE * phMPQ)`
	);
	const createMPQ = storm.func(
		`bool WINAPI SFileCreateArchive(const TCHAR * szMpqName, DWORD dwCreateFlags, DWORD dwMaxFileCount, _Out_ HANDLE * phMPQ)`
	);
	const createMPQ2 = storm.func(
		`bool WINAPI SFileCreateArchive2(const TCHAR * szMpqName, PSFILE_CREATE_MPQ pCreateInfo, _Out_ HANDLE * phMPQ)`
	);

	const flushMPQ = storm.func(`bool WINAPI SFileFlushArchive(HANDLE hMPQ)`);
	const closeMPQ = storm.func(`bool WINAPI SFileCloseArchive(HANDLE hMPQ)`);

	const setMaxFile = storm.func(`bool WINAPI SFileSetMaxFileCount(HANDLE hMPQ, DWORD dwMaxFileCount)`);
	const getMaxFile = storm.func(`DWORD WINAPI SFileGetMaxFileCount(HANDLE hMPQ)`);
	const compactArchive = storm.func(`bool WINAPI SFileCompactArchive(HANDLE hMPQ, const TCHAR * szListFile, bool bReserved)`);
	const compactCallback = storm.func(
		`bool WINAPI SFileSetCompactCallback(HANDLE hMPQ, SFILE_COMPACT_CALLBACK pfnCompactCB, void * pvUserData)`
	);

	// file
	const fileOpen = storm.func(
		`bool WINAPI SFileOpenFileEx(HANDLE hMPQ, const TCHAR * szFileName, DWORD dwSearchScope, _Out_ HANDLE* phFile)`
	);
	const fileSize = storm.func(`DWORD WINAPI SFileGetFileSize(HANDLE hFile, _Out_ DWORD * pdwFileSizeHigh)`);
	const fileSetPtr = storm.func(
		`DWORD WINAPI SFileSetFilePointer(HANDLE hFile, LONG lFilePos, _Inout_ LONG * plFilePosHigh, DWORD dwMoveMethod)`
	);
	const fileRead = storm.func(
		`bool WINAPI SFileReadFile(HANDLE hFile, _Out_ void * lpBuffer, DWORD dwToRead, _Out_ DWORD * pdwRead, void * lpOverlapped)`
	);
	const fileClose = storm.func(`bool WINAPI SFileCloseFile(HANDLE hFile)`);
	const fileExist = storm.func(`bool WINAPI SFileHasFile(HANDLE hMPQ, const TCHAR * szFileName)`);
	const fileGetName = storm.func(`bool WINAPI SFileGetFileName(HANDLE hFile, _Out_ char * szFileName)`);

	const fileCreate = storm.func(
		`bool WINAPI SFileCreateFile(HANDLE hMPQ, const TCHAR * szArchivedName, ULONGLONG FileTime, DWORD dwFileSize, LCID lcLocale, DWORD dwFlags, HANDLE * phFile)`
	);
	const fileWrite = storm.func(`bool WINAPI SFileWriteFile(HANDLE hFile, const void * pvData, DWORD dwSize, DWORD dwCompression)`);
	const fileWriteFinish = storm.func(`bool WINAPI SFileFinishFile(HANDLE hFile)`);

	const fileAdd = storm.func(
		`bool WINAPI SFileAddFileEx(HANDLE hMPQ, const TCHAR * szFileName, const TCHAR * szArchivedName, DWORD dwFlags, DWORD dwCompresion, DWORD dwCompressionNext)`
	);
	const fileRem = storm.func(`bool WINAPI SFileRemoveFile(HANDLE hMPQ, const TCHAR * szFileName, DWORD dwSearchScope)`);
	const fileRen = storm.func(`bool WINAPI SFileRenameFile(HANDLE hMPQ, const TCHAR * szOldFileName, const TCHAR * szNewFileName)`);

	const errGet = storm.func(`DWORD SErrGetLastError()`);

	const cbcWrap = (usercallback: CBCCallback) => {
		return function (_: null, workType: number, bytesProcessed: bigint, totalsBytes: bigint) {
			try {
				usercallback(workType, bytesProcessed, totalsBytes);
			} catch (e) {
				//
			}
		};
	};

	// time to map and simplify and shit
	lib = {
		OpenArchive: function (path: string, flags: number): MPQHANDLE {
			const archivePtr = [null];
			const result = openMPQ(path, 0, flags, archivePtr);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}

			return archivePtr[0]!;
		},
		CreateArchive: function (name: string, flags: number, maxFileCount: bigint): MPQHANDLE {
			assert(maxFileCount < uint32_max, 'Max file count exceed uint32_t limit');

			const archivePtr = [null];
			const result = createMPQ(name, flags, maxFileCount, archivePtr);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}

			return archivePtr[0]!;
		},
		CreateArchiveEx: function (name: string, options: ArchiveCreateOption): MPQHANDLE {
			const archivePtr = [null];
			const result = createMPQ2(name, options, archivePtr);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}

			return archivePtr[0]!;
		},
		ArchiveFlush: function (archive: MPQHANDLE) {
			const result = flushMPQ(archive);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}

			return true;
		},
		ArchiveClose: function (archive: MPQHANDLE) {
			const result = closeMPQ(archive);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}

			return true;
		},
		ArchiveSetMaxFile: function (archive: MPQHANDLE, count: bigint) {
			assert(count < uint32_max, 'Max file count is too large (more than uint32_t)');

			const result = setMaxFile(archive, count);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}
		},
		ArchiveGetMaxFile: function (archive: MPQHANDLE) {
			const result = getMaxFile(archive);

			return result;
		},
		ArchiveCompact: function (archive: MPQHANDLE, listfile?: string, callback?: CBCCallback) {
			if (callback !== null && callback !== undefined) {
				const cbResult = compactCallback(archive, cbcWrap(callback), [null]);

				if (cbResult !== true) {
					const err = makeError(errGet());
					throw err;
				}
			}

			const result = compactArchive(archive, listfile);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}
		},
		ArchiveOpenFile: function (archive: HANDLE, fileName: string): FILEHANDLE {
			const filePtr = [null];
			const result = fileOpen(archive, fileName, 0, filePtr);

			if (result !== true) {
				const err = makeError(errGet());
				throw err;
			}

			return filePtr[0]!;
		},
		ArchiveFileReadFile: function (file: FILEHANDLE) {
			const size = fileSize(file, null);

			if (size === 0xffffffff) {
				// what the fuck?
				throw makeError(size);
			}

			const buf = Buffer.allocUnsafe(size);
			const ptrResult = fileSetPtr(file, 0, null, 0);

			if (ptrResult !== size && ptrResult === 0xffffffff) {
				throw makeError(errGet());
			}

			const byteRead = [0];
			const readResult = fileRead(file, buf, byteRead, null);

			if (readResult === true) {
				return buf;
			}

			// we actually read less then size?
			const err = errGet();
			if (err != 38) {
				throw makeError(errGet()); // god bless
			}

			// we did some how magically read less then file size
			const newBuf = Buffer.allocUnsafe(byteRead[0]!);
			buf.copy(newBuf, 0, 0, byteRead[0]!);
			return newBuf;
		},
		ArchiveFileCloseFile: function (file: FILEHANDLE) {
			const closed = fileClose(file);
			if (closed !== true) {
				throw makeError(errGet());
			}
		},
		ArchiveHasFile: function (archive: MPQHANDLE, fileName: string) {
			const r = fileExist(archive, fileName);

			if (r === true) {
				return true;
			}

			const err = errGet();
			if (err != 2) {
				throw makeError(err);
			}

			return false;
		},
		CreateFile: function (archive: MPQHANDLE, storePath: string, size: number, flags: number, locale?: number): FILEHANDLE {
			const filePtr = [null];
			const r = fileCreate(archive, storePath, 0, size, locale ?? 0, flags, filePtr);

			if (r === true) {
				return filePtr[0]!;
			}

			const err = errGet();
			throw makeError(err);
		},
		CreateFileEx: function (archive: MPQHANDLE, storePath: string, data: Buffer<ArrayBuffer>, flags: number, locale?: number) {
			const filePtr = [null];
			const dataLength = data.length;
			const r = fileCreate(archive, storePath, 0, dataLength, locale ?? 0, flags, filePtr);

			if (r !== true) {
				throw makeError(errGet());
			}

			const wr = fileWrite(filePtr[0], data, dataLength, 0x02);

			if (wr != true) {
				throw makeError(errGet());
			}

			const fr = fileWriteFinish(filePtr[0]);

			if (r !== true) {
				throw makeError(errGet());
			}
		},
		ArchiveFileWriteFile: function (file: FILEHANDLE, data: Buffer<ArrayBuffer>) {
			const r = fileWrite(file, data, data.length, 0x02);

			if (r === true) return;

			const err = errGet();
			if (err === 0x70) {
				throw new Error(`STORM_ERR: Attempting to write more data than the file size!`);
			}

			throw makeError(err);
		},
		ArchiveFileFinishWriteFile: function (file: FILEHANDLE) {
			const r = fileWriteFinish(file);

			if (r === true) return;

			throw makeError(errGet());
		},
		ArchiveAddFile: function (mpq: MPQHANDLE, from: string, storePath: string, flags?: number) {
			const flag = !flags ? ArchiveAddFileFlags.MPQ_FILE_COMPRESS | ArchiveAddFileFlags.MPQ_FILE_SECTOR_CRC : flags;

			// 0x02 = compress zlib, 2^32-1 = compress next same
			const r = fileAdd(mpq, from, storePath, flag, 0x02, 0xffffffff);

			if (r === true) return;

			throw makeError(errGet());
		},
		ArchiveRemoveFile: function (mpq: MPQHANDLE, fileName: string) {
			const r = fileRem(mpq, fileName, null);

			if (r === true) return;

			throw makeError(errGet());
		},
		ArchiveRenameFile: function (mpq: MPQHANDLE, oldName: string, newName: string) {
			const r = fileRen(mpq, oldName, newName);

			if (r === true) return;

			throw makeError(errGet());
		},
	};

	natives = {
		openMPQ: openMPQ,
		createMPQ: createMPQ,
		createMPQ2: createMPQ2,
		flushMPQ: flushMPQ,
		closeMPQ: closeMPQ,
		setMaxFile: setMaxFile,
		getMaxFile: getMaxFile,
		compactArchive: compactArchive,
		compactCallback: compactCallback,
		fileOpen: fileOpen,
		fileSize: fileSize,
		fileSetPtr: fileSetPtr,
		fileRead: fileRead,
		fileClose: fileClose,
		fileExist: fileExist,
		fileGetName: fileGetName,
		fileCreate: fileCreate,
		fileWrite: fileWrite,
		fileWriteFinish: fileWriteFinish,
		fileAdd: fileAdd,
		fileRem: fileRem,
		fileRen: fileRen,
		errGet: errGet
	};
}

function loadStormLib() {
	if (STORMLIB_IS_LOADED) return;

	let kind = 0;
	if (process.platform === 'win32') {
		// check bit
		if (process.arch === 'x64') {
			kind = 1; // 64 bit
		} else if (process.arch === 'ia32') {
			kind = 2; // 32 bit
		} else {
			// what the fuck
			throw new Error('Platform architecture not supported, currently only support normal x86_64 architecture');
		}
	} else {
		throw new Error('Platform not supported, currently only support windows');
	}

	// ensure hash matches
	let base = '';
	switch (kind) {
		case 1: // 64
			base = path.resolve(__dirname, '..', '..', 'external', 'stormlib', 'x64');
			break;
		case 2: // 32
			base = path.resolve(__dirname, '..', '..', 'external', 'stormlib', 'x86');
			break;

		default:
			base = path.resolve(__dirname, '..', '..', 'external', 'stormlib', 'x64');
			break;
	}
	const integrity = path.join(base, 'integrity.sha256');
	const dlls = path.join(base, 'StormLib.dll');

	if (!fs.existsSync(integrity) || !fs.existsSync(dlls)) {
		throw new Error('Can not find a valid StormLib integrity and or dlls files');
	}

	const hash = fs.readFileSync(integrity, 'utf-8').split(' ');
	const file = fs.readFileSync(dlls);
	const fileHash = crypto.hash('sha256', file, 'hex').toUpperCase();

	if (hash[0] != fileHash) {
		throw new Error(
			`FATAL: StormLib hashes mismatch!, all Patchwork MPQ related feature is disabled and can not be used. Expected: ${hash[0]} | Got: ${fileHash}`
		);
	}

	// load
	storm = ffi.load(dlls);
	mapStormLib();

	STORMLIB_IS_LOADED = true;
}

/**
 * Get the TS Wrapper interfaces
 *
 * This interface have type hints!
 * @returns
 */
export function getStormLib(): StormLib {
	if (STORMLIB_IS_LOADED === true) return lib!;

	loadStormLib();

	return lib!;
}

/**
 * Get the FFI Wrapper interfaces.
 *
 * This interface have no type hints!
 * @returns FFI Wrapper interfaces of stormlib
 */
export function getStormNatives() {
	if (STORMLIB_IS_LOADED === true) return natives!;

	loadStormLib();

	return natives!;
}
