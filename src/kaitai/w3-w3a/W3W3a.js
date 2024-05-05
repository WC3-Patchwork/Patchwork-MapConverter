// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3ObjModFile'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3ObjModFile'));
  } else {
    root.W3W3a = factory(root.KaitaiStream, root.W3ObjModFile);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3ObjModFile) {
var W3W3a = (function() {
  function W3W3a(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3a.prototype._read = function() {
    this.objModFile = new W3ObjModFile(this._io, this, null, 1);
    this.objModFile._read();
  }

  return W3W3a;
})();
return W3W3a;
}));
