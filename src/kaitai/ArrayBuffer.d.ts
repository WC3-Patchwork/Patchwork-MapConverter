interface ArrayBuffer {
    /**
     * If this ArrayBuffer is resizable, returns the maximum byte length given during construction; returns the byte length if not.
     */
    get maxByteLength(): number;
    /**
     * Returns true if this ArrayBuffer can be resized.
     */
    get resizable(): boolean;

    /**
     * Resizes the ArrayBuffer to the specified size (in bytes).
     * @param newByteLength The new length, in bytes, to resize the ArrayBuffer to.
     */
    resize(newByteLength: number): undefined;
}
