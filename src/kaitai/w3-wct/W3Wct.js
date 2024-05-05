// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.W3Wct = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var W3Wct = (function() {
  function W3Wct(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Wct.prototype._read = function() {
    this.version = new Version(this._io, this, this._root);
    this.version._read();
    if (this.version.val == 1) {
      this.headComment = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
    }
    if (this.version.val == 1) {
      this.headTrigger = new Trigger(this._io, this, this._root);
      this.headTrigger._read();
    }
    this.numTrigger = this._io.readU4le();
    this.trigger = [];
    for (var i = 0; i < this.numTrigger; i++) {
      var _t_trigger = new Trigger(this._io, this, this._root);
      _t_trigger._read();
      this.trigger.push(_t_trigger);
    }
  }

  var Version = W3Wct.Version = (function() {
    function Version(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Version.prototype._read = function() {
      this.firstVersion = this._io.readU4le();
      if (this.firstVersion == 2147483652) {
        this.secondVersion = this._io.readU4le();
      }
    }
    Object.defineProperty(Version.prototype, 'val', {
      get: function() {
        if (this._m_val !== undefined)
          return this._m_val;
        this._m_val = (this.firstVersion == 2147483652 ? this.secondVersion : this.firstVersion);
        return this._m_val;
      }
    });

    return Version;
  })();

  var Trigger = W3Wct.Trigger = (function() {
    function Trigger(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Trigger.prototype._read = function() {
      this.length = this._io.readU4le();
      this.content = KaitaiStream.bytesToStr(this._io.readBytes(this.length), "UTF-8");
    }

    return Trigger;
  })();

  return W3Wct;
})();
return W3Wct;
}));
