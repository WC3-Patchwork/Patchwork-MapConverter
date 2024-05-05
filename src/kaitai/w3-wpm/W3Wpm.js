// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'));
  } else {
    root.W3Wpm = factory(root.KaitaiStream, root.W3id);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id) {
var W3Wpm = (function() {
  function W3Wpm(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Wpm.prototype._read = function() {
    this.fileId = new W3id(this._io, this, null);
    this.fileId._read();
    this.version = this._io.readU4le();
    this.width = this._io.readU4le();
    this.height = this._io.readU4le();
    this.pathingNode = [];
    for (var i = 0; i < (this.width * this.height); i++) {
      this.pathingNode.push(this._io.readU1());
    }
  }

  return W3Wpm;
})();
return W3Wpm;
}));
