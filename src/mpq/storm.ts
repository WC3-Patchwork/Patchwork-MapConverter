import { MPQHANDLE, FILEHANDLE, StormNative } from './types';
import { getStormNatives } from './loader';
import { makeError } from './error';

let nats: StormNative;
export class MpqArchive {

    private _archive: MPQHANDLE;
    private _valid: boolean; // wrapper tracker, to prevent stupid shit

    static _init = false;

    private constructor(archiveHandle: MPQHANDLE) {
        this._archive = archiveHandle;
        this._valid = true;
    }

    static Init(){
        if (this._init) return;
        nats = getStormNatives();
    }

    /**
	 *
	 * @param path
	 * @param flags
	 * @see {@link ArchiveOpenFlag} for the flags args
	 */
    static Open(path: string, flags: number){
        const archPtr = [null];
        const r = nats.openMPQ(path, 0, flags, archPtr);

        if (r === true){
            return new MpqArchive(archPtr[0]!);
        }

        throw makeError(nats.errGet());
    }
}