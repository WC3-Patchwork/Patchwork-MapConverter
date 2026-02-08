import { TextDecoder } from 'node:util';
import { isUtf8, isAscii, constants } from 'node:buffer';
import type { FILEHANDLE, StormNative } from './types';
import { MpqArchive } from './archive';
import { getStormNatives } from './loader';
import { makeError } from './error';

const decoder = new TextDecoder('utf-8');

const EMPTY_READONLY_BUFFER = Buffer.from(new ArrayBuffer(0, { maxByteLength: 0 }));

let nats: StormNative;

export class MpqFile {
	private static _init = false;
	private _handle: FILEHANDLE | null = null;
	private _buf: Buffer<ArrayBuffer> = EMPTY_READONLY_BUFFER;
	private _str: string | null = null;
	private _name: string;
	private _isReadableFile = false;
	private _parent: MpqArchive | null;
	private _deleted = false;
	private _renamed = false;
	private _oldName: string | null = null;
	private _preload = false; // this file was a preload file (prepared for reading)
	private _valid = false; // track if the handle is valid or not
	private _cursor = 0; // the current position of the reader/writer
	private _size = 0; // this is the buffer max size, placed here to "shorten" the call

	/**
	 * Return null if the file does not contain readable text
	 *
	 * Or if the file data has not been read
	 */
	get text() {
		if (this._preload) throw new Error('Attempt to get a MPQ file text data when it data has not yet read');
		return this._str;
	}

	/**
	 * Does nothing if the file was not a readable file
	 *
	 * Also does nothing if the file data was not read
	 */
	set text(value) {
		if (this._preload) throw new Error('Setting a prepared MPQ file data is now allowed');
		if (!this._isReadableFile) {
			return;
		}

		this._str = value;
		this._buf = value === null ? EMPTY_READONLY_BUFFER : Buffer.from(value);
	}

	/**
	 * Get the binary data of the file
	 *
	 * You can modify the buffer returned by this getter instead of giving it a new buffer in the setter
	 *
	 * @note Will return a 'effectively' readonly buffer if the file was marked as deleted or it data has not been read
	 */
	get binary() {
		if (this._deleted || this._preload) return EMPTY_READONLY_BUFFER;

		return this._buf;
	}

	/**
	 * Does nothing if the file data has not been read
	 */
	set binary(v) {
		if (this._preload) return;

		this._buf = v;
	}

	/**
	 * Always return 0 if the file was marked as deleted or it data has not been read
	 */
	get byteLength() {
		if (this._deleted || this._preload) return 0; // File was 'deleted', we return 0 incase user try to do stupid shit

		return this._buf.byteLength;
	}

	/**
	 * Get file internal buffer size
	 */
	get size() {
		return this._size;
	}

	/**
	 * Get the reader/writer position
	 */
	get pos() {
		return this._cursor;
	}

	/**
	 * Set the reader/writer position
	 */
	set pos(v) {
		this._cursor = Math.min(this._size, Math.max(v, 0));
	}

	/**
	 * Get file name
	 */
	get name() {
		return this._name;
	}

	/**
	 * Get the MpqArchive that this file came from
	 *
	 * Can be null if there is no parent
	 */
	get parent() {
		return this._parent;
	}

	/**
	 * Is the file deleted?
	 */
	get isDeleted() {
		return this._deleted;
	}

	/**
	 * Is the file renamed?
	 */
	get isRenamed() {
		return this._renamed;
	}

	/**
	 * Get the old name of the file before it was renamed
	 */
	get oldName() {
		return this._oldName;
	}

	/**
	 * Have the file data has been read and cached?
	 */
	get isRead() {
		return this._preload;
	}

	private static init() {
		if (MpqFile._init) {
			return;
		}

		MpqFile._init = true;
		nats = getStormNatives();
	}

	private tryParseTextFromBuffer() {
		const arr = this._buf.buffer;
		if (arr.detached) {
			return;
		}

		if (isUtf8(arr) || isAscii(arr)) {
			this._str = decoder.decode(arr);
			this._isReadableFile = true;
		}
	}

	private grow(desiredMinimum: number) {
		let nsize = this._size * 2;
		while (nsize < desiredMinimum) {
			nsize *= 2;
		}

		if (nsize >= constants.MAX_LENGTH)
			throw new Error(`OUT_OF_MEMORY: Can not allocate a buffer larger than ${constants.MAX_LENGTH} (attempted to allocate: ${nsize})`);

		const nbuff = Buffer.allocUnsafe(nsize);

		nbuff.set(this._buf);
		this._buf = nbuff;
	}

	private constructor(
		name: string,
		parent: MpqArchive | null = null,
		handle: FILEHANDLE | null = null,
		dataBuffer: Buffer<ArrayBuffer> | null = null,
		dataText: string | null = null
	) {
		if (dataBuffer != null) {
			const buff = Buffer.allocUnsafe(dataBuffer.length);
			dataBuffer.copy(buff, 0, 0, dataBuffer.length);
			this._buf = buff;
			this._size = buff.length;

			this.tryParseTextFromBuffer();
		} else if (dataText != null) {
			this._buf = Buffer.from(dataText);
			this._str = dataText;
			this._size = this._buf.length;
			this._isReadableFile = true;
		} else if (handle != null) {
			this._handle = handle;
			this._valid = true;
			this._preload = true;
		} else {
			this._buf = EMPTY_READONLY_BUFFER;
		}

		this._name = name;
		this._parent = parent;
	}

	/**
	 * Prepare a file from it handle
	 * @param name
	 * @param handle
	 * @returns
	 */
	static fromHandle(name: string, handle: FILEHANDLE) {
		if (!MpqFile._init) MpqFile.init();
		return new MpqFile(name, null, handle);
	}

	/**
	 * Prepare a file from it handle
	 * @param name
	 * @param handle
	 * @returns
	 */
	static fromHandleEx(name: string, parent: MpqArchive, handle: FILEHANDLE) {
		if (!MpqFile._init) MpqFile.init();
		return new MpqFile(name, parent, handle);
	}

	/**
	 * Get a file object directly from it archive
	 * @param archive
	 * @param name
	 */
	static fromArchive(archive: MpqArchive, name: string) {
		if (!MpqFile._init) MpqFile.init();
		const fileptr = [null];
		const openResult = nats.fileOpen(archive.handle, name, 0, fileptr);
		if (openResult != true) {
			throw makeError(nats.errGet());
		}

		return MpqFile.fromHandleEx(name, archive, fileptr[0]!);
	}

	/**
	 * Make a standalone file from the buffer data
	 *
	 * File created this way will not have it parent
	 * @param name
	 * @param buffer Buffer to be copied to the classes internal field
	 * @returns
	 */
	static fromBuffer(name: string, buffer: Buffer<ArrayBuffer>) {
		if (!MpqFile._init) MpqFile.init();
		return new MpqFile(name, null, null, buffer);
	}

	/**
	 * Make a known file from the buffer
	 * @param name
	 * @param parent
	 * @param buffer Buffer to be copied to the classes internal field
	 * @returns
	 */
	static fromBufferEx(name: string, parent: MpqArchive, buffer: Buffer<ArrayBuffer>) {
		if (!MpqFile._init) MpqFile.init();
		return new MpqFile(name, parent, null, buffer);
	}

	/**
	 * Make a standalone file from the text
	 *
	 * File created this way will not have it parent
	 * @param name
	 * @param buffer
	 * @returns
	 */
	static fromText(name: string, text: string) {
		if (!MpqFile._init) MpqFile.init();
		return new MpqFile(name, null, null, null, text);
	}

	/**
	 * Make a known file from the text
	 * @param name
	 * @param parent
	 * @param text
	 * @returns
	 */
	static fromTextEx(name: string, parent: MpqArchive, text: string) {
		if (!MpqFile._init) MpqFile.init();
		return new MpqFile(name, parent, null, null, text);
	}

	/**
	 * Create an empty known file of the target MpqArchive
	 * @param name
	 * @param parent
	 */
	static create(name: string, parent: MpqArchive) {
		if (!MpqFile._init) MpqFile.init();
		return new MpqFile(name, parent);
	}

	private rawRead() {
		const fileSize = nats.fileSize(this._handle, null);
		if (fileSize > 0xffffffff) {
			throw makeError(nats.errGet());
		}

		const buf = Buffer.allocUnsafe(fileSize);
		const setResult = nats.fileSetPtr(this._handle, 0, null, 0);
		if (setResult != true) {
			throw makeError(nats.errGet());
		}

		const byteRead = [0];
		const readResult = nats.fileRead(this._handle, buf, fileSize, byteRead, null);
		if (readResult === true) {
			this._buf = buf;
			this.tryParseTextFromBuffer();
			return buf;
		}

		const e = nats.errGet();
		if (e != 38) throw makeError(e);

		const newBuf = Buffer.allocUnsafe(byteRead[0]!);
		buf.copy(newBuf, 0, 0, byteRead[0]!);

		this._buf = newBuf;
		this.tryParseTextFromBuffer();

		return newBuf;
	}

	/**
	 * Read data from this file and return the binary data
	 *
	 * May read less then requested size if it exceed the file length
	 */
	read(type: 'binary', size: number, offset: number, offsetType: 'begin' | 'current' | 'end', padding: boolean): Buffer<ArrayBuffer>;
	/**
	 * Read data from this file and return the text
	 *
	 * If the file is not a readable file, return null instead
	 */
	read(type: 'text', size: number, offset: number, offsetType: 'begin' | 'current' | 'end', padding: boolean): string | null;
	/**
	 * Read raw data from this file, caching it and return nothing
	 */
	read(type: 'raw'): void;
	/**
	 * Read data from this file, and return either buffer or text based on it `type` param
	 */
	read(type: string, size = 0, offset = 0, offsetType: 'begin' | 'current' | 'end' = 'current', padding = false) {
		if (type === 'raw' || this._preload) {
			this.rawRead();

			if (type === 'raw') return;
		}

		let readPos = this._cursor;
		if (offsetType === 'begin') {
			readPos = Math.min(0, Math.max(offset, this._size));
		} else if (offsetType === 'current') {
			readPos = Math.min(0, Math.max(this._cursor + offset, this._size));
		} else if (offsetType === 'end') {
			readPos = Math.min(0, Math.max(this._size + offset, this._size));
		}

		if (size <= 0) throw new Error('ERR_OUT_OF_RANGE');

		const data = Buffer.allocUnsafe(size);
		this._buf.copy(data, 0, readPos, readPos + size);

		if (type === 'binary') {
			return data;
		}

		if (type === 'text') {
			if (!this._isReadableFile) return null;

			return decoder.decode(data);
		}
	}

	/**
	 * Write the given content to the file
	 * @param content Buffer contain the data that will be used to wrote to the file
	 * @param offset The offset to write the content to
	 * @param offsetType Where to start the offset at
	 * @param overwrite Override the data when the content overlap with the existing data?
	 * @returns It own instance to chain execution
	 */
	write(content: string, offset: number, offsetType: 'begin' | 'current' | 'end'): MpqFile;
	/**
	 * Write the given content to the file
	 * @param content Buffer contain the data that will be used to wrote to the file
	 * @param offset The offset to write the content to
	 * @param offsetType Where to start the offset at
	 * @param overwrite Override the data when the content overlap with the existing data?
	 * @returns It own instance to chain execution
	 */
	write(content: Buffer<ArrayBuffer>, offset: number, offsetType: 'begin' | 'current' | 'end'): MpqFile;
	/**
	 * Write the given content to the file
	 * @param content Buffer contain the data that will be used to wrote to the file
	 * @param offset The offset to write the content to
	 * @param offsetType Where to start the offset at
	 * @param overwrite Override the data when the content overlap with the existing data?
	 * @returns It own instance to chain execution
	 */
	write(
		content: string | Buffer<ArrayBuffer> | Uint8Array,
		offset = 0,
		offsetType: 'begin' | 'current' | 'end' = 'current'
	) {
		if (typeof content !== 'string' && typeof content !== 'object') {
			throw new Error('INVALID_PARAMETER');
		}

		const data = Buffer.isBuffer(content) ? content : Buffer.from(content);
		const writeLength = data.byteLength;
		let pos = 0;
		if (offsetType === 'begin') {
			pos = Math.min(0, Math.max(offset, this._size));
		} else if (offsetType === 'current') {
			pos = Math.min(0, Math.max(this._cursor + offset, this._size));
		} else if (offsetType === 'end') {
			pos = Math.min(0, Math.max(this._size + offset, this._size));
		}

		const excess = pos + writeLength - this._size;
		if (excess > 0) {
			this.grow(excess);
		}

		this._buf.set(data, pos);

		return this;
	}

	/**
	 * Rename this file in the parent MPQ (if it parent exist)
	 *
	 * Does nothing if it doesnt belong in any MPQ
	 * @param newName The new name of this file
	 */
	rename(newName: string) {
		if (this._renamed) {
			// was recently renamed, so we only have to change the 'new name'
			this._name = newName;

			return;
		}

		this._renamed = true;
		this._oldName = this._name;
		this._name = newName;
	}

	/**
	 * Remove this file from it parent MPQ (if it parent exist),
	 * if the file was "removed" before then this will revert it
	 *
	 * Otherwise this function does nothing
	 */
	remove() {
		if (this._parent === null) return;

		this._deleted = !this._deleted;
	}

	/**
	 * Close and free the class internal file handle
	 *
	 * Does nothing if the handle was already freed
	 */
	close() {
		if (!this._valid) return;

		const r = nats.fileClose(this._handle);

		if (r !== true) {
			throw makeError(nats.errGet());
		}
	}

	/**
	 * Close and flush the file handle
	 *
	 * Does nothing if the handle was already freed
	 */
	flush() {
		if (!this._valid) return;

		if (this._buf.byteLength <= 0) return;
	}

	/**
	 * INTERNAL. DO NOT CALL
	 *
	 * Clean the object so it look like new
	 */
	clean(){
		if (!this._valid){
			// it was freed, dont do shit
			// it also meant that this object is for holding a living file handle
			return;
		}
		this._renamed = false;
		this._deleted = false;
		this._oldName = null;
	}
}
