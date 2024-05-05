// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.W3Mmp = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var W3Mmp = (function() {
  W3Mmp.IconType = Object.freeze({
    GOLD_MINE: 0,
    HOUSE: 1,
    PLAYER_START: 2,
    NEUTRAL: 3,
    NEUTRAL_SMALL: 4,

    0: "GOLD_MINE",
    1: "HOUSE",
    2: "PLAYER_START",
    3: "NEUTRAL",
    4: "NEUTRAL_SMALL",
  });

  function W3Mmp(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Mmp.prototype._read = function() {
    this.version = this._io.readU4le();
    this.iconsChunk = new IconsChunk(this._io, this, this._root);
    this.iconsChunk._read();
  }

  var IconsChunk = W3Mmp.IconsChunk = (function() {
    function IconsChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    IconsChunk.prototype._read = function() {
      this.numIcon = this._io.readU4le();
      this.icon = [];
      for (var i = 0; i < this.numIcon; i++) {
        var _t_icon = new Icon(this._io, this, this._root);
        _t_icon._read();
        this.icon.push(_t_icon);
      }
    }

    return IconsChunk;
  })();

  var Icon = W3Mmp.Icon = (function() {
    function Icon(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Icon.prototype._read = function() {
      this.iconType = this._io.readU4le();
      this.x = this._io.readU4le();
      this.y = this._io.readU4le();
      this.color = new Color(this._io, this, this._root);
      this.color._read();
    }

    return Icon;
  })();

  var Color = W3Mmp.Color = (function() {
    function Color(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Color.prototype._read = function() {
      this.blue = this._io.readU1();
      this.green = this._io.readU1();
      this.red = this._io.readU1();
      this.alpha = this._io.readU1();
    }

    return Color;
  })();

  return W3Mmp;
})();
return W3Mmp;
}));
