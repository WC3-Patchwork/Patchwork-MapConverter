// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', './W3str', 'WtgFuncLookup'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('./W3str'), require('WtgFuncLookup'));
  } else {
    root.W3Wtg131 = factory(root.KaitaiStream, root.W3id, root.W3str, root.WtgFuncLookup);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, W3str, WtgFuncLookup) {
var W3Wtg131 = (function() {
  W3Wtg131.ElementType = Object.freeze({
    HEADER: 1,
    LIBRARY: 2,
    CATEGORY: 4,
    TRIG: 8,
    COMMENT: 16,
    SCRIPT: 32,
    VAR: 64,

    1: "HEADER",
    2: "LIBRARY",
    4: "CATEGORY",
    8: "TRIG",
    16: "COMMENT",
    32: "SCRIPT",
    64: "VAR",
  });

  W3Wtg131.ParamType = Object.freeze({
    PRESET: 0,
    VARIABLE: 1,
    FUNCTION: 2,
    STRING: 3,

    0: "PRESET",
    1: "VARIABLE",
    2: "FUNCTION",
    3: "STRING",
  });

  W3Wtg131.EcaType = Object.freeze({
    EVENT: 0,
    CONDITION: 1,
    ACTION: 2,

    0: "EVENT",
    1: "CONDITION",
    2: "ACTION",
  });

  function W3Wtg131(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Wtg131.prototype._read = function() {
    this.magic = new W3id(this._io, this, null);
    this.magic._read();
    this.magic2 = this._io.readU4le();
    this.version = this._io.readU4le();
    this.numHeader = this._io.readU4le();
    this.numRemovedHeader = this._io.readU4le();
    this.removedHeader = [];
    for (var i = 0; i < this.numRemovedHeader; i++) {
      var _t_removedHeader = new RemovedHeader(this._io, this, this._root);
      _t_removedHeader._read();
      this.removedHeader.push(_t_removedHeader);
    }
    this.numLibrary = this._io.readU4le();
    this.numRemovedLibrary = this._io.readU4le();
    this.removedLibrary = [];
    for (var i = 0; i < this.numRemovedLibrary; i++) {
      var _t_removedLibrary = new RemovedLibrary(this._io, this, this._root);
      _t_removedLibrary._read();
      this.removedLibrary.push(_t_removedLibrary);
    }
    this.numCategory = this._io.readU4le();
    this.numRemovedCategory = this._io.readU4le();
    this.removedCategory = [];
    for (var i = 0; i < this.numRemovedCategory; i++) {
      var _t_removedCategory = new RemovedCategory(this._io, this, this._root);
      _t_removedCategory._read();
      this.removedCategory.push(_t_removedCategory);
    }
    this.numTrig = this._io.readU4le();
    this.numRemovedTrig = this._io.readU4le();
    this.removedTrig = [];
    for (var i = 0; i < this.numRemovedTrig; i++) {
      var _t_removedTrig = new RemovedTrig(this._io, this, this._root);
      _t_removedTrig._read();
      this.removedTrig.push(_t_removedTrig);
    }
    this.numComment = this._io.readU4le();
    this.numRemovedComment = this._io.readU4le();
    this.removedComment = [];
    for (var i = 0; i < this.numRemovedComment; i++) {
      var _t_removedComment = new RemovedComment(this._io, this, this._root);
      _t_removedComment._read();
      this.removedComment.push(_t_removedComment);
    }
    this.numScript = this._io.readU4le();
    this.numRemovedScript = this._io.readU4le();
    this.removedScript = [];
    for (var i = 0; i < this.numRemovedScript; i++) {
      var _t_removedScript = new RemovedScript(this._io, this, this._root);
      _t_removedScript._read();
      this.removedScript.push(_t_removedScript);
    }
    this.numVarElement = this._io.readU4le();
    this.numRemovedVar = this._io.readU4le();
    this.removedVar = [];
    for (var i = 0; i < this.numRemovedVar; i++) {
      var _t_removedVar = new RemovedVar(this._io, this, this._root);
      _t_removedVar._read();
      this.removedVar.push(_t_removedVar);
    }
    this.unknown2 = this._io.readU4le();
    this.unknown3 = this._io.readU4le();
    this.trigVersion = this._io.readU4le();
    this.numExistingVar = this._io.readU4le();
    this.existingVar = [];
    for (var i = 0; i < this.numExistingVar; i++) {
      var _t_existingVar = new Var(this._io, this, this._root);
      _t_existingVar._read();
      this.existingVar.push(_t_existingVar);
    }
    this.numElement = this._io.readU4le();
    this.element = [];
    for (var i = 0; i < this.numElement; i++) {
      var _t_element = new Element(this._io, this, this._root);
      _t_element._read();
      this.element.push(_t_element);
    }
  }

  var Param = W3Wtg131.Param = (function() {
    function Param(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Param.prototype._read = function() {
      this.paramType = this._io.readU4le();
      this.value = new W3str(this._io, this, null);
      this.value._read();
      this.hasSub = this._io.readU4le();
      if (this.hasSub != 0) {
        this.subParam = new SubParam(this._io, this, this._root);
        this.subParam._read();
      }
      if ( ((this._root.version == 7) && (!(this.hasSub == 0))) ) {
        this.unknown2 = this._io.readU4le();
      }
      this.isArray = this._io.readU4le();
      if (this.isArray != 0) {
        this.arrayIndex = new Param(this._io, this, this._root);
        this.arrayIndex._read();
      }
    }

    return Param;
  })();

  var RemovedComment = W3Wtg131.RemovedComment = (function() {
    function RemovedComment(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RemovedComment.prototype._read = function() {
      this.id = this._io.readU4le();
    }

    return RemovedComment;
  })();

  var RemovedLibrary = W3Wtg131.RemovedLibrary = (function() {
    function RemovedLibrary(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RemovedLibrary.prototype._read = function() {
      this.id = this._io.readU4le();
    }

    return RemovedLibrary;
  })();

  var RemovedScript = W3Wtg131.RemovedScript = (function() {
    function RemovedScript(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RemovedScript.prototype._read = function() {
      this.id = this._io.readU4le();
    }

    return RemovedScript;
  })();

  var Eca = W3Wtg131.Eca = (function() {
    function Eca(_io, _parent, _root, isChild, numParam) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.isChild = isChild;
      this.numParam = numParam;

    }
    Eca.prototype._read = function() {
      this.type = this._io.readU4le();
      if (this.isChild == true) {
        this.groupNumber = this._io.readU4le();
      }
      this.func = new Func(this._io, this, this._root);
      this.func._read();
      this.isEnabled = this._io.readU4le();
      this.param = [];
      for (var i = 0; i < this.func.numParam; i++) {
        var _t_param = new Param(this._io, this, this._root);
        _t_param._read();
        this.param.push(_t_param);
      }
      this.numChildEca = this._io.readU4le();
      if (this._root.version == 7) {
        this.childEca = [];
        for (var i = 0; i < this.numChildEca; i++) {
          var _t_childEca = new Eca(this._io, this, this._root, true, 0);
          _t_childEca._read();
          this.childEca.push(_t_childEca);
        }
      }
    }

    return Eca;
  })();

  var RemovedVar = W3Wtg131.RemovedVar = (function() {
    function RemovedVar(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RemovedVar.prototype._read = function() {
      this.id = this._io.readU4le();
    }

    return RemovedVar;
  })();

  var Element = W3Wtg131.Element = (function() {
    function Element(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Element.prototype._read = function() {
      this.type = this._io.readU4le();
      if ( ((this.type == W3Wtg131.ElementType.HEADER) || (this.type == W3Wtg131.ElementType.LIBRARY) || (this.type == W3Wtg131.ElementType.CATEGORY)) ) {
        this.header = new Header(this._io, this, this._root);
        this.header._read();
      }
      if (this.type == W3Wtg131.ElementType.TRIG) {
        this.trig = new Trig(this._io, this, this._root);
        this.trig._read();
      }
      if (this.type == W3Wtg131.ElementType.VAR) {
        this.var = new VarElement(this._io, this, this._root);
        this.var._read();
      }
    }

    return Element;
  })();

  var VarElement = W3Wtg131.VarElement = (function() {
    function VarElement(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    VarElement.prototype._read = function() {
      this.id = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.parentId = this._io.readU4le();
    }

    return VarElement;
  })();

  var RemovedTrig = W3Wtg131.RemovedTrig = (function() {
    function RemovedTrig(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RemovedTrig.prototype._read = function() {
      this.id = this._io.readU4le();
    }

    return RemovedTrig;
  })();

  var Trig = W3Wtg131.Trig = (function() {
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
      if (this._root.version == 7) {
        this.isComment = this._io.readU4le();
      }
      this.id = this._io.readU4le();
      this.isActivated = this._io.readU4le();
      this.isCustomScript = this._io.readU4le();
      this.isInitiallyDisabled = this._io.readU4le();
      this.runOnInit = this._io.readU4le();
      this.parentId = this._io.readU4le();
      this.numEca = this._io.readU4le();
      this.eca = [];
      for (var i = 0; i < this.numEca; i++) {
        var _t_eca = new Eca(this._io, this, this._root, false, 2);
        _t_eca._read();
        this.eca.push(_t_eca);
      }
    }

    return Trig;
  })();

  var Comment = W3Wtg131.Comment = (function() {
    function Comment(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Comment.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.description = new W3str(this._io, this, null);
      this.description._read();
      if (this._root.version == 7) {
        this.isComment = this._io.readU4le();
      }
      this.id = this._io.readU4le();
      this.isActivated = this._io.readU4le();
      this.isCustomScript = this._io.readU4le();
      this.isInitiallyEnabled = this._io.readU4le();
      this.runOnInit = this._io.readU4le();
      this.parentId = this._io.readU4le();
    }

    return Comment;
  })();

  var Library = W3Wtg131.Library = (function() {
    function Library(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Library.prototype._read = function() {
      this.index = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      if (this._root.version == 7) {
        this.isComment = this._io.readU4le();
      }
      this.categoryHasChildren = this._io.readU4le();
      this.categoryParentId = this._io.readU4le();
    }

    return Library;
  })();

  var SubParam = W3Wtg131.SubParam = (function() {
    function SubParam(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    SubParam.prototype._read = function() {
      this.subType = this._io.readU4le();
      this.func = new Func(this._io, this, this._root);
      this.func._read();
      this.hasParam = this._io.readU4le();
      this.param = [];
      for (var i = 0; i < this.func.numParam; i++) {
        var _t_param = new Param(this._io, this, this._root);
        _t_param._read();
        this.param.push(_t_param);
      }
    }

    return SubParam;
  })();

  var Func = W3Wtg131.Func = (function() {
    function Func(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Func.prototype._read = function() {
      this._raw__raw_numArgumentsAndName = this._io.readBytesTerm(0, false, true, true);
      var _process = new WtgFuncLookup();
      this._raw_numArgumentsAndName = _process.decode(this._raw__raw_numArgumentsAndName);
      var _io__raw_numArgumentsAndName = new KaitaiStream(this._raw_numArgumentsAndName);
      this.numArgumentsAndName = new W3str(_io__raw_numArgumentsAndName, this, null);
      this.numArgumentsAndName._read();
    }
    Object.defineProperty(Func.prototype, 'numParam', {
      get: function() {
        if (this._m_numParam !== undefined)
          return this._m_numParam;
        var io = this.numArgumentsAndName._io;
        var _pos = io.pos;
        io.seek(0);
        this._m_numParam = io.readU4le();
        io.seek(_pos);
        return this._m_numParam;
      }
    });
    Object.defineProperty(Func.prototype, 'name', {
      get: function() {
        if (this._m_name !== undefined)
          return this._m_name;
        var io = this.numArgumentsAndName._io;
        var _pos = io.pos;
        io.seek(4);
        this._m_name = new W3str(io, this, null);
        this._m_name._read();
        io.seek(_pos);
        return this._m_name;
      }
    });

    return Func;
  })();

  var Category = W3Wtg131.Category = (function() {
    function Category(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Category.prototype._read = function() {
      this.index = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      if (this._root.version == 7) {
        this.isComment = this._io.readU4le();
      }
      this.categoryHasChildren = this._io.readU4le();
      this.categoryParentId = this._io.readU4le();
    }

    return Category;
  })();

  var Header = W3Wtg131.Header = (function() {
    function Header(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Header.prototype._read = function() {
      this.index = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      if (this._root.version == 7) {
        this.isComment = this._io.readU4le();
      }
      this.categoryHasChildren = this._io.readU4le();
      this.categoryParentId = this._io.readU4le();
    }

    return Header;
  })();

  var RemovedCategory = W3Wtg131.RemovedCategory = (function() {
    function RemovedCategory(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RemovedCategory.prototype._read = function() {
      this.id = this._io.readU4le();
    }

    return RemovedCategory;
  })();

  var RemovedHeader = W3Wtg131.RemovedHeader = (function() {
    function RemovedHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RemovedHeader.prototype._read = function() {
      this.id = this._io.readU4le();
    }

    return RemovedHeader;
  })();

  var Script = W3Wtg131.Script = (function() {
    function Script(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Script.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.description = new W3str(this._io, this, null);
      this.description._read();
      if (this._root.version == 7) {
        this.isComment = this._io.readU4le();
      }
      this.id = this._io.readU4le();
      this.isActivated = this._io.readU4le();
      this.isCustomScript = this._io.readU4le();
      this.isInitiallyEnabled = this._io.readU4le();
      this.runOnInit = this._io.readU4le();
      this.parentId = this._io.readU4le();
    }

    return Script;
  })();

  var Var = W3Wtg131.Var = (function() {
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
      if (this._root.version == 7) {
        this.arraySize = this._io.readU4le();
      }
      this.useInitialValue = this._io.readU4le();
      this.initialValue = new W3str(this._io, this, null);
      this.initialValue._read();
      this.id = this._io.readU4le();
      this.parentId = this._io.readU4le();
    }

    return Var;
  })();

  var Param2 = W3Wtg131.Param2 = (function() {
    function Param2(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Param2.prototype._read = function() {
      this.paramType = this._io.readU4le();
      this.value = new W3str(this._io, this, null);
      this.value._read();
      this.hasSub = this._io.readU4le();
      if (this.hasSub != 0) {
        this.subParam = new SubParam(this._io, this, this._root);
        this.subParam._read();
      }
      if ( ((this._root.version == 7) && (!(this.hasSub == 0))) ) {
        this.unknown2 = this._io.readU4le();
      }
      this.isArray = this._io.readU4le();
    }

    return Param2;
  })();

  return W3Wtg131;
})();
return W3Wtg131;
}));
