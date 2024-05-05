// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.W3Blp = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var W3Blp = (function() {
  W3Blp.Content = Object.freeze({
    JPG: 0,
    DIRECT: 1,

    0: "JPG",
    1: "DIRECT",
  });

  function W3Blp(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Blp.prototype._read = function() {
    this.header = new Header(this._io, this, this._root);
    this.header._read();
    if (this.header.magic.version >= 1) {
      this.mipmapLocator = new MipmapLocator(this._io, this, this._root);
      this.mipmapLocator._read();
    }
    if (this.header.content == W3Blp.Content.JPG) {
      this.jpgHeader = new JpgHeader(this._io, this, this._root);
      this.jpgHeader._read();
    }
    if (this.header.content == W3Blp.Content.DIRECT) {
      this.directHeader = new DirectHeader(this._io, this, this._root);
      this.directHeader._read();
    }
  }

  var JpgHeader = W3Blp.JpgHeader = (function() {
    function JpgHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    JpgHeader.prototype._read = function() {
      this.numHeaderChunk = this._io.readU4le();
      this.headerChunk = [];
      for (var i = 0; i < this.numHeaderChunk; i++) {
        this.headerChunk.push(this._io.readU1());
      }
    }

    return JpgHeader;
  })();

  var MipmapLocator = W3Blp.MipmapLocator = (function() {
    function MipmapLocator(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    MipmapLocator.prototype._read = function() {
      this.mipmapOffset = [];
      for (var i = 0; i < 16; i++) {
        this.mipmapOffset.push(this._io.readU4le());
      }
      this.mipmapSize = [];
      for (var i = 0; i < 16; i++) {
        this.mipmapSize.push(this._io.readU4le());
      }
    }

    return MipmapLocator;
  })();

  var Header = W3Blp.Header = (function() {
    function Header(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Header.prototype._read = function() {
      this.magic = new Magic(this._io, this, this._root);
      this.magic._read();
      this.content = this._io.readU4le();
      if (this.magic.version >= 2) {
        this.encodingType = this._io.readU1();
      }
      if (this.magic.version >= 2) {
        this.alphaBits2 = this._io.readU1();
      }
      if (this.magic.version >= 2) {
        this.sampleType = this._io.readU1();
      }
      if (this.magic.version >= 2) {
        this.hasMipmaps2 = this._io.readU1();
      }
      if (this.magic.version < 2) {
        this.alphaBits = this._io.readU4le();
      }
      this.width = this._io.readU4le();
      this.height = this._io.readU4le();
      if (this.magic.version < 2) {
        this.extra = this._io.readU4le();
      }
      if (this.magic.version < 2) {
        this.hasMipmaps = this._io.readU4le();
      }
    }

    return Header;
  })();

  var Magic = W3Blp.Magic = (function() {
    function Magic(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Magic.prototype._read = function() {
      this.head = [];
      for (var i = 0; i < 3; i++) {
        this.head.push(this._io.readU1());
      }
      this.versionRaw = this._io.readU1();
    }
    Object.defineProperty(Magic.prototype, 'version', {
      get: function() {
        if (this._m_version !== undefined)
          return this._m_version;
        this._m_version = (this.versionRaw - 48);
        return this._m_version;
      }
    });

    return Magic;
  })();

  var DirectHeader = W3Blp.DirectHeader = (function() {
    function DirectHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    DirectHeader.prototype._read = function() {
      this.cmap = [];
      for (var i = 0; i < 256; i++) {
        this.cmap.push(this._io.readU1());
      }
    }

    return DirectHeader;
  })();
  Object.defineProperty(W3Blp.prototype, 'mipmap0', {
    get: function() {
      if (this._m_mipmap0 !== undefined)
        return this._m_mipmap0;
      var _pos = this._io.pos;
      this._io.seek(this.mipmapLocator.mipmapOffset[0]);
      this._m_mipmap0 = [];
      for (var i = 0; i < this.mipmapLocator.mipmapSize[0]; i++) {
        this._m_mipmap0.push(this._io.readU1());
      }
      this._io.seek(_pos);
      return this._m_mipmap0;
    }
  });

  return W3Blp;
})();
return W3Blp;
}));
