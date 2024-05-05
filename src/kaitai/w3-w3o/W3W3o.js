// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3W3q', './W3W3h', './W3W3a', './W3W3d', './W3W3b', './W3W3u', './W3W3t'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3W3q'), require('./W3W3h'), require('./W3W3a'), require('./W3W3d'), require('./W3W3b'), require('./W3W3u'), require('./W3W3t'));
  } else {
    root.W3W3o = factory(root.KaitaiStream, root.W3W3q, root.W3W3h, root.W3W3a, root.W3W3d, root.W3W3b, root.W3W3u, root.W3W3t);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3W3q, W3W3h, W3W3a, W3W3d, W3W3b, W3W3u, W3W3t) {
var W3W3o = (function() {
  function W3W3o(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3o.prototype._read = function() {
    this.version = this._io.readU4le();
    this.useUnit = this._io.readU4le();
    if (this.useUnit == 1) {
      this.unit = new W3W3u(this._io, this, null);
      this.unit._read();
    }
    this.useItem = this._io.readU4le();
    if (this.useItem == 1) {
      this.item = new W3W3t(this._io, this, null);
      this.item._read();
    }
    this.useDestructable = this._io.readU4le();
    if (this.useDestructable == 1) {
      this.destructable = new W3W3b(this._io, this, null);
      this.destructable._read();
    }
    this.useDoodad = this._io.readU4le();
    if (this.useDoodad == 1) {
      this.doodad = new W3W3d(this._io, this, null);
      this.doodad._read();
    }
    this.useAbility = this._io.readU4le();
    if (this.useAbility == 1) {
      this.ability = new W3W3a(this._io, this, null);
      this.ability._read();
    }
    this.useBuff = this._io.readU4le();
    if (this.useBuff == 1) {
      this.buff = new W3W3h(this._io, this, null);
      this.buff._read();
    }
    this.useUpgrade = this._io.readU4le();
    if (this.useUpgrade == 1) {
      this.upgrade = new W3W3q(this._io, this, null);
      this.upgrade._read();
    }
  }

  return W3W3o;
})();
return W3W3o;
}));
