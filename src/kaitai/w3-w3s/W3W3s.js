// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3str'));
  } else {
    root.W3W3s = factory(root.KaitaiStream, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3str) {
var W3W3s = (function() {
  W3W3s.Channel = Object.freeze({
    DEFAULT: -1,
    GENERAL: 0,
    UNIT_SELECTION: 1,
    UNIT_ACKNOWLEDGEMENT: 2,
    UNIT_MOVEMENT: 3,
    UNIT_READY: 4,
    COMBAT: 5,
    ERROR: 6,
    MUSIC: 7,
    USER_INTERFACE: 8,
    MOVEMENT_LOOPING: 9,
    AMBIENT: 10,
    ANIMATION: 11,
    BUILDING: 12,
    BIRTH: 13,
    FIRE: 14,

    "-1": "DEFAULT",
    0: "GENERAL",
    1: "UNIT_SELECTION",
    2: "UNIT_ACKNOWLEDGEMENT",
    3: "UNIT_MOVEMENT",
    4: "UNIT_READY",
    5: "COMBAT",
    6: "ERROR",
    7: "MUSIC",
    8: "USER_INTERFACE",
    9: "MOVEMENT_LOOPING",
    10: "AMBIENT",
    11: "ANIMATION",
    12: "BUILDING",
    13: "BIRTH",
    14: "FIRE",
  });

  function W3W3s(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3s.prototype._read = function() {
    this.version = this._io.readU4le();
    this.numSound = this._io.readU4le();
    this.sound = [];
    for (var i = 0; i < this.numSound; i++) {
      var _t_sound = new Sound(this._io, this, this._root);
      _t_sound._read();
      this.sound.push(_t_sound);
    }
  }

  var Sound = W3W3s.Sound = (function() {
    function Sound(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Sound.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.path = new W3str(this._io, this, null);
      this.path._read();
      this.eax = new W3str(this._io, this, null);
      this.eax._read();
      this._raw_flags = this._io.readBytes(4);
      var _io__raw_flags = new KaitaiStream(this._raw_flags);
      this.flags = new Flags(_io__raw_flags, this, this._root);
      this.flags._read();
      this.fadeInRate = this._io.readU4le();
      this.fadeOutRate = this._io.readU4le();
      this.volume = this._io.readS4le();
      this.pitch = this._io.readF4le();
      this.pitchVariance = this._io.readF4le();
      this.priority = this._io.readS4le();
      this.channel = this._io.readS4le();
      this.minDistance = this._io.readF4le();
      this.maxDistance = this._io.readF4le();
      this.cutoffDistance = this._io.readF4le();
      this.coneInside = this._io.readF4le();
      this.coneOutside = this._io.readF4le();
      this.coneOutsideVolume = this._io.readS4le();
      this.coneOrientationX = this._io.readF4le();
      this.coneOrientationY = this._io.readF4le();
      this.coneOrientationZ = this._io.readF4le();
      if (this._root.version >= 2) {
        this.varName = new W3str(this._io, this, null);
        this.varName._read();
      }
      if (this._root.version >= 2) {
        this.internalSoundName = new W3str(this._io, this, null);
        this.internalSoundName._read();
      }
      if (this._root.version >= 2) {
        this.soundPath = new W3str(this._io, this, null);
        this.soundPath._read();
      }
      if (this._root.version >= 2) {
        this.unknown9 = this._io.readS4le();
      }
      if (this._root.version >= 2) {
        this.unknown10 = new W3str(this._io, this, null);
        this.unknown10._read();
      }
      if (this._root.version >= 2) {
        this.unknown11 = this._io.readS4le();
      }
      if (this._root.version >= 2) {
        this.unknown12 = new W3str(this._io, this, null);
        this.unknown12._read();
      }
      if (this._root.version >= 2) {
        this.unknown13 = this._io.readS4le();
      }
      if (this._root.version >= 2) {
        this.unknown14 = new W3str(this._io, this, null);
        this.unknown14._read();
      }
      if (this._root.version >= 2) {
        this.unknown15 = new W3str(this._io, this, null);
        this.unknown15._read();
      }
      if (this._root.version >= 2) {
        this.unknown16 = new W3str(this._io, this, null);
        this.unknown16._read();
      }
      if (this._root.version >= 2) {
        this.unknown17 = new W3str(this._io, this, null);
        this.unknown17._read();
      }
      if (this._root.version >= 3) {
        this.unknown18 = this._io.readS4le();
      }
    }

    return Sound;
  })();

  var Flags = W3W3s.Flags = (function() {
    function Flags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Flags.prototype._read = function() {
      this.rest = [];
      for (var i = 0; i < 3; i++) {
        this.rest.push(this._io.readBitsIntBe(1) != 0);
      }
      this.isImported = this._io.readBitsIntBe(1) != 0;
      this.isMusic = this._io.readBitsIntBe(1) != 0;
      this.stopWhenOutOfRange = this._io.readBitsIntBe(1) != 0;
      this.is3d = this._io.readBitsIntBe(1) != 0;
      this.isLooping = this._io.readBitsIntBe(1) != 0;
    }

    return Flags;
  })();

  return W3W3s;
})();
return W3W3s;
}));
