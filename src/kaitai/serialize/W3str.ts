import W3str from "../w3-imp/W3str";
import KaitaiStream from "kaitai-struct";

W3str.prototype.read = function () {
    this._read();
}

W3str.prototype.write = function (output: Buffer) {

}

W3str.prototype._read = function () {
    this.value = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
}