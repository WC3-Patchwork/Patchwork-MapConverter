// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3str'));
  } else {
    root.W3Imp = factory(root.KaitaiStream, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3str) {
var W3Imp = (function() {
  function W3Imp(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Imp.prototype._read = function() {
    this.version = this._io.readU4le();
    this.numImportObj = this._io.readU4le();
    this.importObj = [];
    for (var i = 0; i < this.numImportObj; i++) {
      var _t_importObj = new ImportObj(this._io, this, this._root);
      _t_importObj._read();
      this.importObj.push(_t_importObj);
    }
  }

  var ImportObj = W3Imp.ImportObj = (function() {
    function ImportObj(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ImportObj.prototype._read = function() {
      this.flags = this._io.readU1();
      this.path = new W3str(this._io, this, null);
      this.path._read();
    }

    return ImportObj;
  })();

  return W3Imp;
})();
return W3Imp;
}));
