// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3str'));
  } else {
    root.W3Wgc = factory(root.KaitaiStream, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3str) {
var W3Wgc = (function() {
  W3Wgc.Version = Object.freeze({
    ROC: 0,
    TFT: 1,

    0: "ROC",
    1: "TFT",
  });

  W3Wgc.Race = Object.freeze({
    HUMAN: 1,
    ORC: 2,
    NIGHT_ELF: 4,
    UNDEAD: 8,
    RANDOM: 32,

    1: "HUMAN",
    2: "ORC",
    4: "NIGHT_ELF",
    8: "UNDEAD",
    32: "RANDOM",
  });

  W3Wgc.AiDifficulty = Object.freeze({
    EASY: 0,
    NORMAL: 1,
    HARD: 2,

    0: "EASY",
    1: "NORMAL",
    2: "HARD",
  });

  function W3Wgc(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Wgc.prototype._read = function() {
    this.version = this._io.readU4le();
    this._raw_flags = this._io.readBytes(4);
    var _io__raw_flags = new KaitaiStream(this._raw_flags);
    this.flags = new Flags(_io__raw_flags, this, this._root);
    this.flags._read();
    this.baseGameSpeed = this._io.readU4le();
    this.relativeMapPath = new W3str(this._io, this, null);
    this.relativeMapPath._read();
    this.numPlayer = this._io.readU4le();
    this.player = [];
    for (var i = 0; i < this.numPlayer; i++) {
      var _t_player = new Player(this._io, this, this._root);
      _t_player._read();
      this.player.push(_t_player);
    }
  }

  var Flags = W3Wgc.Flags = (function() {
    function Flags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Flags.prototype._read = function() {
      this.victoryDefeatConditions = this._io.readBitsIntBe(1) != 0;
      this.fogOfWar = this._io.readBitsIntBe(1) != 0;
    }

    return Flags;
  })();

  var Player = W3Wgc.Player = (function() {
    function Player(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Player.prototype._read = function() {
      this.slotIndex = this._io.readU4le();
      this.forceIndex = this._io.readU4le();
      this.race = this._io.readU4le();
      this.color = this._io.readU4le();
      this.handicap = this._io.readU4le();
      this._raw_playerSlotFlags = this._io.readBytes(4);
      var _io__raw_playerSlotFlags = new KaitaiStream(this._raw_playerSlotFlags);
      this.playerSlotFlags = new PlayerSlotFlags(_io__raw_playerSlotFlags, this, this._root);
      this.playerSlotFlags._read();
      this.aiDifficulty = this._io.readU4le();
      this.customAiScriptPath = new W3str(this._io, this, null);
      this.customAiScriptPath._read();
    }

    return Player;
  })();

  var PlayerSlotFlags = W3Wgc.PlayerSlotFlags = (function() {
    function PlayerSlotFlags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayerSlotFlags.prototype._read = function() {
      this.rest = [];
      for (var i = 0; i < 4; i++) {
        this.rest.push(this._io.readBitsIntBe(1) != 0);
      }
      this.aiFilePathIsAbsolute = this._io.readBitsIntBe(1) != 0;
      this.useCustomAiFile = this._io.readBitsIntBe(1) != 0;
      this.isObserver = this._io.readBitsIntBe(1) != 0;
      this.isUser = this._io.readBitsIntBe(1) != 0;
    }

    return PlayerSlotFlags;
  })();

  return W3Wgc;
})();
return W3Wgc;
}));
