// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('./W3str'));
  } else {
    root.W3Wtg = factory(root.KaitaiStream, root.W3id, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, W3str) {
var W3Wtg = (function() {
  W3Wtg.Eca = Object.freeze({
    EVENT: 0,
    CONDITION: 1,
    ACTION: 2,

    0: "EVENT",
    1: "CONDITION",
    2: "ACTION",
  });

  function W3Wtg(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Wtg.prototype._read = function() {
    this.root = new Root(this._io, this, this._root, true);
    this.root._read();
  }

  var Root = W3Wtg.Root = (function() {
    function Root(_io, _parent, _root, use131) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.use131 = use131;

    }
    Root.prototype._read = function() {
      this.magic = new W3id(this._io, this, null);
      this.magic._read();
      if (this.use131 == true) {
        this.magic2 = this._io.readU4le();
      }
      this.version = this._io.readU4le();
      if (this.use131 == true) {
        this.unknown = [];
        for (var i = 0; i < 4; i++) {
          this.unknown.push(this._io.readU4le());
        }
      }
      this.numCategory = this._io.readU4le();
      this.numRemovedCategory = this._io.readU4le();
      this.category = [];
      for (var i = 0; i < this.numCategory; i++) {
        var _t_category = new Category(this._io, this, this._root);
        _t_category._read();
        this.category.push(_t_category);
      }
      this.subversion = this._io.readU4le();
      this.numVar = this._io.readU4le();
      this.var = [];
      for (var i = 0; i < this.numVar; i++) {
        var _t_var = new Var(this._io, this, this._root);
        _t_var._read();
        this.var.push(_t_var);
      }
      this.numTrig = this._io.readU4le();
    }

    return Root;
  })();

  var Param = W3Wtg.Param = (function() {
    function Param(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Param.prototype._read = function() {
      this.test = this._io.readU4le();
    }

    return Param;
  })();

  var Eca = W3Wtg.Eca = (function() {
    function Eca(_io, _parent, _root, isChild) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.isChild = isChild;

    }
    Eca.prototype._read = function() {
      this.type = this._io.readU4le();
      if (this.isChild == true) {
        this.groupNumber = this._io.readU4le();
      }
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.isEnabled = this._io.readU4le();
      this.numParam = this._io.readU4le();
      this.param = [];
      for (var i = 0; i < this.numParam; i++) {
        var _t_param = new Param(this._io, this, this._root);
        _t_param._read();
        this.param.push(_t_param);
      }
      this.numEca = this._io.readU4le();
      if (this._root.root.version == 7) {
        this.eca = [];
        for (var i = 0; i < this.numEca; i++) {
          var _t_eca = new Eca(this._io, this, this._root, true);
          _t_eca._read();
          this.eca.push(_t_eca);
        }
      }
    }

    return Eca;
  })();

  var Trig = W3Wtg.Trig = (function() {
    function Trig(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Trig.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.description = new W3str(this._io, this, null);
      this.description._read();
      if (this._root.root.version == 7) {
        this.isComment = this._io.readU4le();
      }
      this.isActivated = this._io.readU4le();
      this.isCustomText = this._io.readU4le();
      this.isInitiallyEnabled = this._io.readU4le();
      this.categoryIndex = this._io.readU4le();
      this.numEca = this._io.readU4le();
      this.eca = [];
      for (var i = 0; i < this.numEca; i++) {
        var _t_eca = new Eca(this._io, this, this._root, false);
        _t_eca._read();
        this.eca.push(_t_eca);
      }
    }

    return Trig;
  })();

  var Category = W3Wtg.Category = (function() {
    function Category(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Category.prototype._read = function() {
      this.index = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      if (this._root.root.version == 7) {
        this.isComment = this._io.readU4le();
      }
    }

    return Category;
  })();

  var Var = W3Wtg.Var = (function() {
    function Var(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Var.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.type = new W3str(this._io, this, null);
      this.type._read();
      this.unknown = this._io.readU4le();
      this.isArray = this._io.readU4le();
      if (this._root.root.version == 7) {
        this.arraySize = this._io.readU4le();
      }
      this.useInitialValue = this._io.readU4le();
      this.initialValue = new W3str(this._io, this, null);
      this.initialValue._read();
    }

    return Var;
  })();

  return W3Wtg;
})();
return W3Wtg;
}));
