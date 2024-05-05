// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'));
  } else {
    root.W3W3e = factory(root.KaitaiStream, root.W3id);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id) {
var W3W3e = (function() {
  W3W3e.Tileset = Object.freeze({
    ASHENVALE: 65,
    BARRENS: 66,
    FELWOOD: 67,
    DUNGEON: 68,
    LORDAERON_FALL: 70,
    UNDERGROUND: 71,
    ICECROWN: 73,
    DALARAN_RUINS: 74,
    BLACK_CITADEL: 75,
    LORDAERON_SUMMER: 76,
    NORTHREND: 78,
    OUTLAND: 79,
    VILLAGE_FALL: 81,
    VILLAGE: 86,
    LORDAERON_WINTER: 87,
    DALARAN: 88,
    CITYSCAPE: 89,
    SUNKEN_RUINS: 90,

    65: "ASHENVALE",
    66: "BARRENS",
    67: "FELWOOD",
    68: "DUNGEON",
    70: "LORDAERON_FALL",
    71: "UNDERGROUND",
    73: "ICECROWN",
    74: "DALARAN_RUINS",
    75: "BLACK_CITADEL",
    76: "LORDAERON_SUMMER",
    78: "NORTHREND",
    79: "OUTLAND",
    81: "VILLAGE_FALL",
    86: "VILLAGE",
    87: "LORDAERON_WINTER",
    88: "DALARAN",
    89: "CITYSCAPE",
    90: "SUNKEN_RUINS",
  });

  function W3W3e(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3e.prototype._read = function() {
    this.fileId = new W3id(this._io, this, null);
    this.fileId._read();
    this.version = this._io.readU4le();
    this.tileset = this._io.readU1();
    this.useCustomTileset = this._io.readU4le();
    this.numTileId = this._io.readU4le();
    this.tileId = [];
    for (var i = 0; i < this.numTileId; i++) {
      var _t_tileId = new W3id(this._io, this, null);
      _t_tileId._read();
      this.tileId.push(_t_tileId);
    }
    this.numCliffTileId = this._io.readU4le();
    this.cliffTileId = [];
    for (var i = 0; i < this.numCliffTileId; i++) {
      var _t_cliffTileId = new W3id(this._io, this, null);
      _t_cliffTileId._read();
      this.cliffTileId.push(_t_cliffTileId);
    }
    this.mapWidth = this._io.readU4le();
    this.mapHeight = this._io.readU4le();
    this.centerOffsetX = this._io.readF4le();
    this.centerOffsetY = this._io.readF4le();
    this.tileNode = [];
    for (var i = 0; i < (this.mapWidth * this.mapHeight); i++) {
      var _t_tileNode = new TileNode(this._io, this, this._root);
      _t_tileNode._read();
      this.tileNode.push(_t_tileNode);
    }
  }

  var TileNode = W3W3e.TileNode = (function() {
    function TileNode(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    TileNode.prototype._read = function() {
      this.groundHeight = this._io.readU2le();
      this.waterHeightAndBoundary = new WaterHeightAndBoundary(this._io, this, this._root);
      this.waterHeightAndBoundary._read();
      this.flagsAndGroundTexture = new FlagsAndGroundTexture(this._io, this, this._root);
      this.flagsAndGroundTexture._read();
      this.groundAndCliffVariation = this._io.readU1();
      this.cliffTextureAndLayerHeight = new CliffTextureAndLayerHeight(this._io, this, this._root);
      this.cliffTextureAndLayerHeight._read();
    }

    return TileNode;
  })();

  var WaterHeightAndBoundary = W3W3e.WaterHeightAndBoundary = (function() {
    function WaterHeightAndBoundary(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    WaterHeightAndBoundary.prototype._read = function() {
      this.waterHeight = this._io.readBitsIntBe(15);
      this.flag = this._io.readBitsIntBe(1) != 0;
    }

    return WaterHeightAndBoundary;
  })();

  var FlagsAndGroundTexture = W3W3e.FlagsAndGroundTexture = (function() {
    function FlagsAndGroundTexture(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    FlagsAndGroundTexture.prototype._read = function() {
      this.boundary2 = this._io.readBitsIntBe(1) != 0;
      this.water = this._io.readBitsIntBe(1) != 0;
      this.blight = this._io.readBitsIntBe(1) != 0;
      this.ramp = this._io.readBitsIntBe(1) != 0;
      this.texture = this._io.readBitsIntBe(4);
    }

    return FlagsAndGroundTexture;
  })();

  var CliffTextureAndLayerHeight = W3W3e.CliffTextureAndLayerHeight = (function() {
    function CliffTextureAndLayerHeight(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    CliffTextureAndLayerHeight.prototype._read = function() {
      this.texture = this._io.readBitsIntBe(4);
      this.layer = this._io.readBitsIntBe(4);
    }

    return CliffTextureAndLayerHeight;
  })();

  return W3W3e;
})();
return W3W3e;
}));
