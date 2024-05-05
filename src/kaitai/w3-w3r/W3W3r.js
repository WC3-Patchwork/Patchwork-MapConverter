// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('./W3str'));
  } else {
    root.W3W3r = factory(root.KaitaiStream, root.W3id, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, W3str) {
var W3W3r = (function() {
  function W3W3r(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3r.prototype._read = function() {
    this.version = this._io.readU4le();
    this.numRegion = this._io.readU4le();
    this.region = [];
    for (var i = 0; i < this.numRegion; i++) {
      var _t_region = new Region(this._io, this, this._root);
      _t_region._read();
      this.region.push(_t_region);
    }
  }

  var Region = W3W3r.Region = (function() {
    function Region(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Region.prototype._read = function() {
      this.left = this._io.readF4le();
      this.bottom = this._io.readF4le();
      this.right = this._io.readF4le();
      this.top = this._io.readF4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.id = this._io.readU4le();
      this.weatherId = new W3id(this._io, this, null);
      this.weatherId._read();
      this.ambientSound = new W3str(this._io, this, null);
      this.ambientSound._read();
      this.colorBlue = this._io.readU1();
      this.colorGreen = this._io.readU1();
      this.colorRed = this._io.readU1();
      this.endToken = this._io.readU1();
    }

    return Region;
  })();

  return W3W3r;
})();
return W3W3r;
}));
