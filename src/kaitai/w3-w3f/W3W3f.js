// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3str'));
  } else {
    root.W3W3f = factory(root.KaitaiStream, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3str) {
var W3W3f = (function() {
  W3W3f.VariableDifficultyLevelsFlagAndExpansionFlag = Object.freeze({
    FIXED: 0,
    VARIABLE: 1,
    FIXED_W3X: 2,
    VARIABLE_W3X: 3,

    0: "FIXED",
    1: "VARIABLE",
    2: "FIXED_W3X",
    3: "VARIABLE_W3X",
  });

  W3W3f.MapVisibility = Object.freeze({
    INVISIBLE: 0,
    VISIBLE: 1,

    0: "INVISIBLE",
    1: "VISIBLE",
  });

  function W3W3f(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3f.prototype._read = function() {
    this.version = this._io.readU4le();
    this.saves = this._io.readU4le();
    this.editorVersion = this._io.readU4le();
    this.name = new W3str(this._io, this, null);
    this.name._read();
    this.difficulty = new W3str(this._io, this, null);
    this.difficulty._read();
    this.author = new W3str(this._io, this, null);
    this.author._read();
    this.description = new W3str(this._io, this, null);
    this.description._read();
    this.variableDifficultyLevelsFlagAndExpansionFlag = this._io.readU4le();
    this.backgroundScreenIndex = this._io.readU4le();
    this.backgroundScreenPath = new W3str(this._io, this, null);
    this.backgroundScreenPath._read();
    this.minimapPicturePath = new W3str(this._io, this, null);
    this.minimapPicturePath._read();
    this.ambientSoundIndex = this._io.readU4le();
    this.customAmbientSoundPath = new W3str(this._io, this, null);
    this.customAmbientSoundPath._read();
    this.useTerrainFog = this._io.readU4le();
    this.fogZHeight = this._io.readF4le();
    this.fogZEnd = this._io.readF4le();
    this.fogDensity = this._io.readF4le();
    this.fogRed = this._io.readU1();
    this.fogGreen = this._io.readU1();
    this.fogBlue = this._io.readU1();
    this.fogAlpha = this._io.readU1();
    this.cursorRaceIndex = this._io.readU4le();
    this.numMap = this._io.readU4le();
    this.map = [];
    for (var i = 0; i < this.numMap; i++) {
      var _t_map = new W3Map(this._io, this, this._root);
      _t_map._read();
      this.map.push(_t_map);
    }
    this.numMapOrder = this._io.readU4le();
    this.mapOrder = [];
    for (var i = 0; i < this.numMapOrder; i++) {
      var _t_mapOrder = new W3MapOrder(this._io, this, this._root);
      _t_mapOrder._read();
      this.mapOrder.push(_t_mapOrder);
    }
  }

  var W3Map = W3W3f.W3Map = (function() {
    function W3Map(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    W3Map.prototype._read = function() {
      this.visibility = this._io.readU4le();
      this.chapterTitle = new W3str(this._io, this, null);
      this.chapterTitle._read();
      this.mapTitle = new W3str(this._io, this, null);
      this.mapTitle._read();
      this.path = new W3str(this._io, this, null);
      this.path._read();
    }

    return W3Map;
  })();

  var W3MapOrder = W3W3f.W3MapOrder = (function() {
    function W3MapOrder(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    W3MapOrder.prototype._read = function() {
      this.unknown = new W3str(this._io, this, null);
      this.unknown._read();
      this.path = new W3str(this._io, this, null);
      this.path._read();
    }

    return W3MapOrder;
  })();

  return W3W3f;
})();
return W3W3f;
}));
