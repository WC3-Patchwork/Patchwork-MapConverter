// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3DooUnits'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3DooUnits'));
  } else {
    root.W3DooUnits132 = factory(root.KaitaiStream, root.W3DooUnits);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3DooUnits) {
var W3DooUnits132 = (function() {
  function W3DooUnits132(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3DooUnits132.prototype._read = function() {
    this.value = new W3DooUnits(this._io, this, null, 1);
    this.value._read();
  }

  return W3DooUnits132;
})();
return W3DooUnits132;
}));
