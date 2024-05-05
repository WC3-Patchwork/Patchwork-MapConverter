// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.W3Shd = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var W3Shd = (function() {
  function W3Shd(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Shd.prototype._read = function() {
    this.shadowNode = [];
    var i = 0;
    while (!this._io.isEof()) {
      this.shadowNode.push(this._io.readU1());
      i++;
    }
  }

  return W3Shd;
})();
return W3Shd;
}));
