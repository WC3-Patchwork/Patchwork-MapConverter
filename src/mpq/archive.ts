import { MPQHANDLE, FILEHANDLE, StormNative, ArchiveCreateOption, ArchiveCreateFlag, ErrorCode, ArchiveAddFileFlags, MPQCompressFlag } from './types';
import { getStormNatives } from './loader';
import { makeError } from './error';
import { MpqFile } from './file';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert';
import ffi from 'koffi';

const uint32_max = BigInt('4294967294');
let nats: StormNative;

/**
 * Friendly stormlib wrapper
 */
export class MpqArchive {
	private _archive: MPQHANDLE;
	private _valid: boolean; // wrapper tracker, to prevent stupid shit
	private _maxFile = 0n;
	private _files = new Map<string, MpqFile>(); // file cache

	// tracker for modified files
	private _added: MpqFile[] = [];
	private _renamed: MpqFile[] = [];
	private _removed: MpqFile[] = [];

	get maxFile() {
		return this._maxFile;
	}

	set maxFile(value) {
		if (value > uint32_max) {
			value = uint32_max - 1n;
		}

		this._maxFile = value;
	}

	/**
	 * Get this archive handle
	 */
	get handle(){
		return this._archive;
	}

	static _init = false;

	isHandleValid() {
		if (!this._valid) {
			throw makeError(ErrorCode.ERROR_INVALID_HANDLE);
		}
	}

	private constructor(handle: MPQHANDLE) {
		this._archive = handle;
		this._valid = true;

		this._maxFile = BigInt(nats.getMaxFile(handle));
	}

	private static init() {
		if (this._init) return;
		nats = getStormNatives();
	}

	/**
	 * Open a MPQ archive
	 * @param mpqPath Path to the MPQ archive, including the file name and it extension
	 * @param flags
	 * @param preload A list of file name in the MPQ to be opened right after the archive is opened
	 * @see {@link ArchiveOpenFlag} for the flags args
	 */
	static Open(mpqPath: string, flags: number, preload: string[] | null = null) {
		if (!MpqArchive._init) MpqArchive.init();

		const p = path.resolve(mpqPath);

		if (!fs.existsSync(p)) {
			throw new Error('File doesnt exists');
		}

		const archPtr = [null];
		const r = nats.openMPQ(path, 0, flags, archPtr);
		if (r !== true) {
			throw makeError(nats.errGet());
		}

		const arch = new MpqArchive(archPtr[0]!);
		if (preload !== null && preload !== undefined && preload.length > 0) {
			arch.FilePreload(preload);
		}
		return arch;
	}

	/**
	 * Create a new MPQ archive
	 * @param name
	 * @param flags
	 * @param maxFile
	 * @returns
	 */
	static Create(name: string, maxFile: bigint) {
		assert(maxFile < uint32_max, 'maxFile exceed 32-bit unsigned integer!');

		if (!MpqArchive._init) MpqArchive.init();

		const archivePtr = [null];
		const flags =
			ArchiveCreateFlag.MPQ_ATTRIBUTE_CRC32 |
			ArchiveCreateFlag.MPQ_ATTRIBUTE_MD5 |
			ArchiveCreateFlag.MPQ_ATTRIBUTE_FILETIME |
			ArchiveCreateFlag.MPQ_CREATE_LISTFILE |
			ArchiveCreateFlag.MPQ_CREATE_ATTRIBUTES |
			ArchiveCreateFlag.MPQ_CREATE_ARCHIVE_V1;
		const result = nats.createMPQ(name, flags, maxFile, archivePtr);

		if (result !== true) {
			const err = makeError(nats.errGet());
			throw err;
		}

		return new MpqArchive(archivePtr[0]!);
	}

	/**
	 * Create a new MPQ archive with more control over your options
	 *
	 * DO NOT USE if you dont know what you are doing
	 * @param name
	 * @param options
	 * @returns
	 */
	static CreateEx(name: string, options: ArchiveCreateOption) {
		if (options.cbSize <= 0) {
			options.cbSize = ffi.sizeof('SFILE_CREATE_MPQ');
		}
		const archivePtr = [null];
		const result = nats.createMPQ2(name, options, archivePtr);

		if (result !== true) {
			const err = makeError(nats.errGet());
			throw err;
		}

		return new MpqArchive(archivePtr[0]!);
	}

	private processAddedFile(){
		let f = this._added.pop();
		const flags =
			ArchiveAddFileFlags.MPQ_FILE_COMPRESS | ArchiveAddFileFlags.MPQ_FILE_SECTOR_CRC | ArchiveAddFileFlags.MPQ_FILE_REPLACEEXISTING;
		const comp = MPQCompressFlag.MPQ_COMPRESSION_ZLIB;
		while (f != undefined){
			const sz = f.byteLength;
			const nm = f.name;
			const fh = [null];
			let r = nats.fileCreate(this._archive, nm, 0, sz, 0, flags, fh);
			if (r !== true){
				throw makeError(nats.errGet());
			}
			const fp = fh[0]!;

			const buff = f.binary;
			r = nats.fileWrite(fp, buff, buff.byteLength, comp);
			if (r !== true){
				throw makeError(nats.errGet());
			}
			r = nats.fileWriteFinish(fp);
			if (r !== true){
				throw makeError(nats.errGet());
			}

			f.clean()
			f = this._added.pop();
		}
	}

	private processRenamedFile(){
		let f = this._renamed.pop();
		while (f != undefined){
			const r = nats.fileRen(this._archive, f.oldName, f.name);
			if (r !== true){
				throw makeError(nats.errGet());
			}

			f.clean();
			f = this._renamed.pop();
		}
	}

	private processRemovedFile(){
		let f = this._removed.pop();
		while (f != undefined){
			const r = nats.fileRem(this._archive, f.name);
			if (r !== true){
				throw makeError(nats.errGet());
			}
			this._files.delete(f.name);
			f.clean();
			f = this._removed.pop();
		}
	}

	private applyChange(){
		// apply modification
		let needCompact = false;
		if (this._removed.length > 0){
			this.processRemovedFile();
			needCompact = true;
		}
		if (this._added.length > 0){
			this.processAddedFile();
			needCompact = true;
		}
		if (this._renamed.length > 0) this.processRenamedFile();

		// cleanup cache
		if (needCompact){
			const r = nats.compactArchive(this._archive, null, 0);
			if (r !== true){
				throw makeError(nats.errGet());
			}
		}

	}

	/**
	 * Close the MPQ archive and and apply all modification that made to this archive
	 */
	Close() {
		this.isHandleValid();

		this.applyChange();

		this._valid = false;
		const r = nats.closeMPQ(this._archive);
		if (r !== true){
			throw makeError(nats.errGet());
		}
	}

	/**
	 * Apply all modification that made to this archive (FILE WRITE, RENAME, REMOVE)
	 */
	Flush() {
		this.isHandleValid();

		this.applyChange();

		const r = nats.flushMPQ(this._archive);
		if (r !== true){
			throw makeError(nats.errGet());
		}
	}

	/**
	 * Get a file within the MPQ
	 *
	 * This function will read the file instead of prepare it (if the file was not cached)
	 * @param name The name of the file, including it own path within the mpq
	 * @throws When file size exceed 2GB, or not exist, or cant read the file
	 */
	FileGetEx(name: string): MpqFile {
		this.isHandleValid();
		if (name.length <= 0 || name === '') throw new Error(`There is no file within the MPQ named 'empty' and never will be`);
		if (this._files.has(name)) return this._files.get(name)!;

		const file = MpqFile.fromArchive(this, name);
		file.read('raw');
		this._files.set(name, file);

		return file;
	}

	/**
	 * Get a file from the archive
	 * @param name The name of the file, including it own path within the mpq
	 */
	FileGet(name: string): MpqFile {
		if (name.length <= 0 || name === '') throw new Error(`There is no file within the MPQ named 'empty' and never will be`);
		if (this._files.has(name)) return this._files.get(name)!;

		const f = MpqFile.fromArchive(this, name);
		this._files.set(name, f);

		return f;
	}

	/**
	 * Add a new file to this MPQ
	 * @param name
	 * @param data Data to add to that file, if empty return an empty handle
	 * @returns The file handle that is already added to the MPQ
	 */
	FileAdd(name: string, data?: Buffer<ArrayBuffer>){
		if (name.length <= 0 || name === '') throw new Error(`Can not add an empty name file to MPQ`);
		if (this._files.has(name)) throw new Error("Can not add file that are already exists");

		let f: MpqFile;
		if (data){
			f = MpqFile.fromBufferEx(name, this, data);
		} else {
			f = MpqFile.create(name, this);
		}

		this._files.set(name, f);
		this._added.push(f);

		return f;
	}


	/**
	 * Attempt to preload a list of known file
	 * @param name An array of file name, with each name also include it own path within the mpq
	 * @returns A boolean state that the operation was a success or did not succeed
	 */
	FilePreload(nameList: string[]): { state: boolean; reason: string } {
		this.isHandleValid();

		const le = nameList.length;
		let preloaded = 0;
		for (let i = 0; i < le; i++) {
			const name = nameList[i];
			if (name === null || name === undefined || name.length <= 0 || name === '') continue;
			if (this._files.has(name)) continue; // already loaded

			const fileptr = [null];
			const openResult = nats.fileOpen(this._archive, name, 0, fileptr);
			if (openResult != true) {
				throw makeError(nats.errGet());
			}

			this._files.set(name, MpqFile.fromHandleEx(name, this, fileptr[0]!));
			preloaded++;
		}

		if (preloaded == le) {
			return { state: true, reason: `Operation success` };
		}

		if (preloaded < le && preloaded > 0) {
			return { state: false, reason: `Some file were already preloaded` };
		}

		return { state: false, reason: `All of the file were already preloaded` };
	}

	/**
	 * Attempt to prepare a single file that is going to be read
	 * @param name The name of the file, including it own path within the mpq
	 * @returns A boolean state that the operation was a success or did not succeed
	 */
	FilePreloadSingle(name: string): { state: boolean; reason: string } {
		this.isHandleValid();
		if (name === null || name === undefined || name.length <= 0 || name === '')
			return { state: false, reason: `There will never be any file with an empty file name` };
		if (this._files.has(name)) return { state: false, reason: `File already cached, and probably already read` };

		const fileptr = [null];
		const openResult = nats.fileOpen(this._archive, name, 0, fileptr);
		if (openResult != true) {
			throw makeError(nats.errGet());
		}

		this._files.set(name, MpqFile.fromHandleEx(name, this, fileptr[0]!));

		return { state: true, reason: `Operation success` };
	}

	/**
	 * Remove a file within the MPQ archive
	 *
	 * Does nothing if that file doesnt exist
	 * @param name The name of the file, including it own path within the mpq
	 */
	FileRemove(name: string) {
		this.isHandleValid();
		if (name.length <= 0 || name === '') throw new Error(`There is no file within the MPQ named 'empty', and never will be`);

		if (!this._files.has(name)) {
			const has = nats.fileExist(this._archive, name);
			if (!has) return;

			this.FilePreloadSingle(name);
		}

		const file = this._files.get(name)!;
		if (file.isDeleted) return;

		file.remove();
		this._removed.push(file);
	}

	/**
	 * Rename a file within the MPQ
	 *
	 * Does nothing if that file doesnt exist
	 * @param name The file name to be renamed
	 * @param newName The new name for that file
	 */
	FileRename(name: string, newName: string){
		this.isHandleValid();
		if (name.length <= 0 || name === '') throw new Error(`There is no file within the MPQ named 'empty', and never will be`);

		if (!this._files.has(name)) {
			const has = nats.fileExist(this._archive, name);
			if (!has) return;

			this.FilePreloadSingle(name);
		}

		const file = this._files.get(name)!;

		file.rename(newName);
		this._renamed.push(file);

		this._files.set(newName, file);
		this._files.delete(name);
	}
}
