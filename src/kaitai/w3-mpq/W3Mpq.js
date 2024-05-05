// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', 'MpqDecrypt'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('MpqDecrypt'));
  } else {
    root.W3Mpq = factory(root.KaitaiStream, root.W3id, root.MpqDecrypt);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, MpqDecrypt) {
var W3Mpq = (function() {
  W3Mpq.Language = Object.freeze({
    NEUTRAL: 0,

    0: "NEUTRAL",
  });

  function W3Mpq(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Mpq.prototype._read = function() {
    this._raw_header = this._io.readBytes(512);
    var _io__raw_header = new KaitaiStream(this._raw_header);
    this.header = new Header(_io__raw_header, this, this._root);
    this.header._read();
  }

  var BlockTableEntry = W3Mpq.BlockTableEntry = (function() {
    function BlockTableEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    BlockTableEntry.prototype._read = function() {
      this.blockOffset = this._io.readU4le();
      this.blockSize = this._io.readU4le();
      this.fileSize = this._io.readU4le();
      this.flags = this._io.readU4le();
    }

    return BlockTableEntry;
  })();

  var HashTableEntry = W3Mpq.HashTableEntry = (function() {
    function HashTableEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    HashTableEntry.prototype._read = function() {
      this.filePathHashA = this._io.readU4le();
      this.filePathHashB = this._io.readU4le();
      this.language = this._io.readU2le();
      this.platform = this._io.readU2le();
      this.fileBlockIndex = this._io.readU4le();
    }

    return HashTableEntry;
  })();

  var BlockTable = W3Mpq.BlockTable = (function() {
    function BlockTable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    BlockTable.prototype._read = function() {
      this.blockTableEntry = [];
      for (var i = 0; i < this._root.header.numBlockTableEntry; i++) {
        var _t_blockTableEntry = new BlockTableEntry(this._io, this, this._root);
        _t_blockTableEntry._read();
        this.blockTableEntry.push(_t_blockTableEntry);
      }
    }

    return BlockTable;
  })();

  var HashTable = W3Mpq.HashTable = (function() {
    function HashTable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    HashTable.prototype._read = function() {
      this.hashTableEntry = [];
      for (var i = 0; i < this._root.header.numHashTableEntry; i++) {
        var _t_hashTableEntry = new HashTableEntry(this._io, this, this._root);
        _t_hashTableEntry._read();
        this.hashTableEntry.push(_t_hashTableEntry);
      }
    }

    return HashTable;
  })();

  var Header = W3Mpq.Header = (function() {
    function Header(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Header.prototype._read = function() {
      this.fileId = new W3id(this._io, this, null);
      this.fileId._read();
      this.headerSize = this._io.readU4le();
      this.archiveSize = this._io.readU4le();
      this.formatVersion = this._io.readU2le();
      this.sectorSizeShift = this._io.readU2le();
      this.hashTableOffset = this._io.readU4le();
      this.blockTableOffset = this._io.readU4le();
      this.numHashTableEntry = this._io.readU4le();
      this.numBlockTableEntry = this._io.readU4le();
    }

    return Header;
  })();

  var FileData = W3Mpq.FileData = (function() {
    function FileData(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    FileData.prototype._read = function() {
      this.abc = this._io.readU4le();
    }

    return FileData;
  })();
  Object.defineProperty(W3Mpq.prototype, 'hash', {
    get: function() {
      if (this._m_hash !== undefined)
        return this._m_hash;
      var _pos = this._io.pos;
      this._io.seek(this.header.hashTableOffset);
      this._raw__raw__m_hash = this._io.readBytes((16 * this._root.header.numHashTableEntry));
      var _process = new MpqDecrypt("(hash table)", "TABLE");
      this._raw__m_hash = _process.decode(this._raw__raw__m_hash);
      var _io__raw__m_hash = new KaitaiStream(this._raw__m_hash);
      this._m_hash = new HashTable(_io__raw__m_hash, this, this._root);
      this._m_hash._read();
      this._io.seek(_pos);
      return this._m_hash;
    }
  });
  Object.defineProperty(W3Mpq.prototype, 'block', {
    get: function() {
      if (this._m_block !== undefined)
        return this._m_block;
      var _pos = this._io.pos;
      this._io.seek(this.header.blockTableOffset);
      this._raw__raw__m_block = this._io.readBytes((16 * this._root.header.numBlockTableEntry));
      var _process = new MpqDecrypt("(block table)", "TABLE");
      this._raw__m_block = _process.decode(this._raw__raw__m_block);
      var _io__raw__m_block = new KaitaiStream(this._raw__m_block);
      this._m_block = new BlockTable(_io__raw__m_block, this, this._root);
      this._m_block._read();
      this._io.seek(_pos);
      return this._m_block;
    }
  });

  return W3Mpq;
})();
return W3Mpq;
}));
