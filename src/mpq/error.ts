function stormlibErrorToText(code: number) {
    switch (code) {
        case 0:
            return ['ERROR_SUCCESS', 'The operation completed successfully.'];
        case 2:
            return ['ERROR_FILE_NOT_FOUND', 'The system cannot find the file specified.'];
        case 5:
            return ['ERROR_ACCESS_DENIED', 'Access is denied.'];
        case 6:
            return ['ERROR_INVALID_HANDLE', 'The handle is invalid']
        case 8:
            return ['ERROR_NOT_ENOUGH_MEMORY', 'Not enough memory resources are available to process this command.'];
        case 11:
            return ['ERROR_BAD_FORMAT', 'An attempt was made to load a program with an incorrect format.'];
        case 14:
            return ['ERROR_OUTOFMEMORY','Not enough storage is available to complete this operation.'];
        case 38:
            return ['ERROR_HANDLE_EOF', 'The handle is at the end of the file.'];
        case 87:
            return ['ERROR_INVALID_PARAMETER', 'The parameter is incorrect.'];
        case 112:
            return ['ERROR_DISK_FULL', 'There is not enough space on the disk.'];
        case 183:
            return ['ERROR_ALREADY_EXISTS', 'Cannot create a file when that file already exists.'];
        case 1003:
            return ['ERROR_CAN_NOT_COMPLETE', 'Cannot complete the requested operation.'];
        case 1386:
            return ['ERROR_FILE_CORRUPT', 'The file or directory is corrupted and unreadable.'];
        case 10000:
            return ['ERROR_AVI_FILE', 'Not a MPQ file, but an AVI file.'];
        case 10001:
            return ['ERROR_UNKNOWN_FILE_KEY', "Can't find file key."];
        case 10002:
            return ['ERROR_CHECKSUM_ERROR', "Sector CRC doesn't match."];
        case 10003:
            return ['ERROR_INTERNAL_FILE', 'The given operation is not allowed on internal file.'];
        case 10004:
            return ['ERROR_BASE_FILE_MISSING', 'The file is present as incremental patch file, but base file is missing.'];
        case 10005:
            return ['ERROR_MARKED_FOR_DELETE', 'The file was marked as "deleted" in the MPQ.'];
        case 10006:
            return ['ERROR_FILE_INCOMPLETE', 'The required file part is missing.'];
        case 10007:
            return ['ERROR_UNKNOWN_FILE_NAMES', 'A name of at least one file is unknown.'];
        case 10008:
            return ['ERROR_CANT_FIND_PATCH_PREFIX', 'StormLib was unable to find patch prefix for the patches.'];
        case 10009:
            return ['ERROR_FAKE_MPQ_HEADER', 'The header at this position is fake header.'];
        case 10010:
            return ['ERROR_FILE_DELETED', 'The file is present but contains delete marker.'];
        case 0xffffffff:
            return [
                'SFILE_INVALID_SIZE/POS/ATTRIBUTES',
                'File handle is either too large, has or moving to an invalid position, or has invalid attributes.',
            ];
        default:
            return ['???', `The error code ${code} does not exist in the library error code to text helper, please search it on the web.`];
    }
}

export function makeError(code: number) {
    const kinds = stormlibErrorToText(code);
    if (code === 0){
        // this is not supposed to happen
        return new Error(`Execution is done and finished, but somehow stormlib say that it is failed to do so`);
    }

    return new Error(`FATAL: stormlib execution error, code: ${code} - ${kinds[0]} | info: ${kinds[1]}`);
}