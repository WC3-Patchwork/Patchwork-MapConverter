// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('./W3str'));
  } else {
    root.W3ObjModFile = factory(root.KaitaiStream, root.W3id, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, W3str) {
var W3ObjModFile = (function() {
  W3ObjModFile.ValueTypes = Object.freeze({
    INT: 0,
    REAL: 1,
    UNREAL: 2,
    STRING: 3,

    0: "INT",
    1: "REAL",
    2: "UNREAL",
    3: "STRING",
  });

  function W3ObjModFile(_io, _parent, _root, useExtended) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;
    this.useExtended = useExtended;

  }
  W3ObjModFile.prototype._read = function() {
    this.version = this._io.readU4le();
    this.defaultObjectsChunk = new ObjectsChunk(this._io, this, this._root);
    this.defaultObjectsChunk._read();
    this.customObjectsChunk = new ObjectsChunk(this._io, this, this._root);
    this.customObjectsChunk._read();
  }

  var Mod = W3ObjModFile.Mod = (function() {
    function Mod(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Mod.prototype._read = function() {
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.valueType = this._io.readU4le();
      if (this._root.useExtended != 0) {
        this.levelOrVariation = this._io.readU4le();
      }
      if (this._root.useExtended != 0) {
        this.dataPointer = this._io.readU4le();
      }
      switch (this.valueType) {
      case W3ObjModFile.ValueTypes.INT:
        this.value = this._io.readU4le();
        break;
      case W3ObjModFile.ValueTypes.REAL:
        this.value = this._io.readF4le();
        break;
      case W3ObjModFile.ValueTypes.UNREAL:
        this.value = this._io.readF4le();
        break;
      default:
        this.value = new W3str(this._io, this, null);
        this.value._read();
        break;
      }
      this.endToken = new W3id(this._io, this, null);
      this.endToken._read();
    }

    return Mod;
  })();

  var Set = W3ObjModFile.Set = (function() {
    function Set(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Set.prototype._read = function() {
      if (this._root.version >= 3) {
        this.setFlag = this._io.readU4le();
      }
      this.numMod = this._io.readU4le();
      this.mod = [];
      for (var i = 0; i < this.numMod; i++) {
        var _t_mod = new Mod(this._io, this, this._root);
        _t_mod._read();
        this.mod.push(_t_mod);
      }
    }

    return Set;
  })();

  var Obj = W3ObjModFile.Obj = (function() {
    function Obj(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Obj.prototype._read = function() {
      this.baseId = new W3id(this._io, this, null);
      this.baseId._read();
      this.newId = new W3id(this._io, this, null);
      this.newId._read();
      this.numSet = new NumSet(this._io, this, this._root);
      this.numSet._read();
      this.set = [];
      for (var i = 0; i < this.numSet.value; i++) {
        var _t_set = new Set(this._io, this, this._root);
        _t_set._read();
        this.set.push(_t_set);
      }
    }

    return Obj;
  })();

  var NumSet = W3ObjModFile.NumSet = (function() {
    function NumSet(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    NumSet.prototype._read = function() {
      if (this._root.version >= 3) {
        this.numSet = this._io.readU4le();
      }
    }
    Object.defineProperty(NumSet.prototype, 'value', {
      get: function() {
        if (this._m_value !== undefined)
          return this._m_value;
        this._m_value = (this._root.version >= 3 ? this.numSet : 1);
        return this._m_value;
      }
    });

    return NumSet;
  })();

  var ObjectsChunk = W3ObjModFile.ObjectsChunk = (function() {
    function ObjectsChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ObjectsChunk.prototype._read = function() {
      this.numObject = this._io.readU4le();
      this.object = [];
      for (var i = 0; i < this.numObject; i++) {
        var _t_object = new Obj(this._io, this, this._root);
        _t_object._read();
        this.object.push(_t_object);
      }
    }

    return ObjectsChunk;
  })();

  return W3ObjModFile;
})();
return W3ObjModFile;
}));
