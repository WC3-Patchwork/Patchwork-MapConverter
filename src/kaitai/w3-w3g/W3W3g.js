// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', 'BlizzardDecompress'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('BlizzardDecompress'));
  } else {
    root.W3W3g = factory(root.KaitaiStream, root.BlizzardDecompress);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, BlizzardDecompress) {
var W3W3g = (function() {
  W3W3g.SetGameSpeedSpeed = Object.freeze({
    SLOW: 0,
    NORMAL: 1,
    FAST: 2,

    0: "SLOW",
    1: "NORMAL",
    2: "FAST",
  });

  W3W3g.ActionId = Object.freeze({
    PAUSE_GAME: 1,
    RESUME_GAME: 2,
    SET_GAME_SPEED: 3,
    INCREASE_GAME_SPEED: 4,
    DECREASE_GAME_SPEED: 5,
    SAVE_GAME: 6,
    SAVE_GAME_FINISHED: 7,
    UNIT_BUILDING_ABILITY: 16,
    UNIT_BUILDING_ABILITY_WITH_TARGET_POSITION: 17,
    UNIT_BUILDING_ABILITY_WITH_TARGET_POSITION_AND_OBJECT: 18,
    GIVE_OR_DROP_ITEM: 19,
    UNIT_BUILDING_ABILITY_WITH_TWO_TARGET_POSITIONS_AND_TWO_ITEM_IDS: 20,
    CHANGE_SELECTION: 22,
    ASSIGN_GROUP_HOTKEY: 23,
    SELECT_GROUP_HOTKEY: 24,
    SELECT_SUBGROUP: 25,
    PRE_SUBSELECTION: 26,
    UNKNOWN_0X1B: 27,
    SELECT_GROUND_ITEM: 28,
    CANCEL_HERO_REVIVAL: 29,
    REMOVE_UNIT_FROM_BUILDING_QUEUE: 30,
    CHEAT_THE_DUDE_ABIDES: 32,
    UNKNOWN_0X21: 33,
    CHEAT_SOMEBODY_SET_UP_US_THE_BOMB: 34,
    CHEAT_WARP_TEN: 35,
    CHEAT_IOCAINE_POWDER: 36,
    CHEAT_POINT_BREAK: 37,
    CHEAT_WHOS_YOUR_DADDY: 38,
    CHEAT_KEYSER_SOZE: 39,
    CHEAT_LEAFIT_TO_ME: 40,
    CHEAT_THERE_IS_NO_SPOON: 41,
    CHEAT_STRENGTH_AND_HONOR: 42,
    CHEAT_IT_VEXES_ME: 43,
    CHEAT_WHO_IS_JOHN_GALT: 44,
    CHEAT_GREED_IS_GOOD: 45,
    CHEAT_DAY_LIGHT_SAVINGS: 46,
    CHEAT_I_SEE_DEAD_PEOPLE: 47,
    CHEAT_SYNERGY: 48,
    CHEAT_SHARP_AND_SHINY: 49,
    CHEAT_ALL_YOUR_BASE_ARE_BELONG_TO_US: 50,
    CHANGE_ALLY_OPTIONS: 80,
    TRANSFER_RESOURCES: 81,
    MAP_TRIGGER_CHAT_COMMAND: 96,
    ESC_PRESSED: 97,
    SCENARIO_TRIGGER: 98,
    ENTER_CHOOSE_HERO_SKILL_SUBMENU: 102,
    ENTER_CHOOSE_BUILDING_SUBMENU: 103,
    MINIMAP_SIGNAL: 104,
    CONTINUE_GAME_AFTER_WIN_OR_DEFEAT: 105,
    CONTINUE_GAME_AFTER_WIN_OR_DEFEAT2: 106,
    UNKNOWN_0X75: 117,
    UNKNOWN_0X7B: 123,

    1: "PAUSE_GAME",
    2: "RESUME_GAME",
    3: "SET_GAME_SPEED",
    4: "INCREASE_GAME_SPEED",
    5: "DECREASE_GAME_SPEED",
    6: "SAVE_GAME",
    7: "SAVE_GAME_FINISHED",
    16: "UNIT_BUILDING_ABILITY",
    17: "UNIT_BUILDING_ABILITY_WITH_TARGET_POSITION",
    18: "UNIT_BUILDING_ABILITY_WITH_TARGET_POSITION_AND_OBJECT",
    19: "GIVE_OR_DROP_ITEM",
    20: "UNIT_BUILDING_ABILITY_WITH_TWO_TARGET_POSITIONS_AND_TWO_ITEM_IDS",
    22: "CHANGE_SELECTION",
    23: "ASSIGN_GROUP_HOTKEY",
    24: "SELECT_GROUP_HOTKEY",
    25: "SELECT_SUBGROUP",
    26: "PRE_SUBSELECTION",
    27: "UNKNOWN_0X1B",
    28: "SELECT_GROUND_ITEM",
    29: "CANCEL_HERO_REVIVAL",
    30: "REMOVE_UNIT_FROM_BUILDING_QUEUE",
    32: "CHEAT_THE_DUDE_ABIDES",
    33: "UNKNOWN_0X21",
    34: "CHEAT_SOMEBODY_SET_UP_US_THE_BOMB",
    35: "CHEAT_WARP_TEN",
    36: "CHEAT_IOCAINE_POWDER",
    37: "CHEAT_POINT_BREAK",
    38: "CHEAT_WHOS_YOUR_DADDY",
    39: "CHEAT_KEYSER_SOZE",
    40: "CHEAT_LEAFIT_TO_ME",
    41: "CHEAT_THERE_IS_NO_SPOON",
    42: "CHEAT_STRENGTH_AND_HONOR",
    43: "CHEAT_IT_VEXES_ME",
    44: "CHEAT_WHO_IS_JOHN_GALT",
    45: "CHEAT_GREED_IS_GOOD",
    46: "CHEAT_DAY_LIGHT_SAVINGS",
    47: "CHEAT_I_SEE_DEAD_PEOPLE",
    48: "CHEAT_SYNERGY",
    49: "CHEAT_SHARP_AND_SHINY",
    50: "CHEAT_ALL_YOUR_BASE_ARE_BELONG_TO_US",
    80: "CHANGE_ALLY_OPTIONS",
    81: "TRANSFER_RESOURCES",
    96: "MAP_TRIGGER_CHAT_COMMAND",
    97: "ESC_PRESSED",
    98: "SCENARIO_TRIGGER",
    102: "ENTER_CHOOSE_HERO_SKILL_SUBMENU",
    103: "ENTER_CHOOSE_BUILDING_SUBMENU",
    104: "MINIMAP_SIGNAL",
    105: "CONTINUE_GAME_AFTER_WIN_OR_DEFEAT",
    106: "CONTINUE_GAME_AFTER_WIN_OR_DEFEAT2",
    117: "UNKNOWN_0X75",
    123: "UNKNOWN_0X7B",
  });

  W3W3g.SlotStatus = Object.freeze({
    EMPTY: 0,
    CLOSED: 1,
    USED: 2,

    0: "EMPTY",
    1: "CLOSED",
    2: "USED",
  });

  W3W3g.Reason = Object.freeze({
    REMOTE: 1,
    LOCAL: 12,

    1: "REMOTE",
    12: "LOCAL",
  });

  W3W3g.CustomOrLadder = Object.freeze({
    CUSTOM0: 0,
    CUSTOM1: 1,
    CUSTOM2: 2,
    CUSTOM3: 3,
    CUSTOM4: 4,
    CUSTOM5: 5,
    CUSTOM6: 6,
    CUSTOM7: 7,
    LADDER: 8,

    0: "CUSTOM0",
    1: "CUSTOM1",
    2: "CUSTOM2",
    3: "CUSTOM3",
    4: "CUSTOM4",
    5: "CUSTOM5",
    6: "CUSTOM6",
    7: "CUSTOM7",
    8: "LADDER",
  });

  W3W3g.SlotController = Object.freeze({
    HUMAN: 0,
    COMPUTER: 1,

    0: "HUMAN",
    1: "COMPUTER",
  });

  W3W3g.Race = Object.freeze({
    NONE: 0,
    HUMAN: 1,
    ORC: 2,
    NIGHTELF: 4,
    UNDEAD: 8,
    DEMON: 16,
    RANDOM: 32,
    SELECTABLE_OR_FIXED: 64,

    0: "NONE",
    1: "HUMAN",
    2: "ORC",
    4: "NIGHTELF",
    8: "UNDEAD",
    16: "DEMON",
    32: "RANDOM",
    64: "SELECTABLE_OR_FIXED",
  });

  W3W3g.ChatTarget = Object.freeze({
    ALL: 0,
    ALLIES: 1,
    OBSERVERS_OR_REFEREES: 2,

    0: "ALL",
    1: "ALLIES",
    2: "OBSERVERS_OR_REFEREES",
  });

  W3W3g.ChangeSelectionMode = Object.freeze({
    ADD: 1,
    REMOVE: 2,

    1: "ADD",
    2: "REMOVE",
  });

  W3W3g.SlotAiStrength = Object.freeze({
    EASY: 0,
    NORMAL: 1,
    INSANE: 2,

    0: "EASY",
    1: "NORMAL",
    2: "INSANE",
  });

  W3W3g.PrivatePublicEnum = Object.freeze({
    PUBLIC: 0,
    PRIVATE: 8,

    0: "PUBLIC",
    8: "PRIVATE",
  });

  function W3W3g(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3g.prototype._read = function() {
    this.versionOrSmth = this._io.readU4le();
    this.player = new Player(this._io, this, this._root, 1);
    this.player._read();
    this.gameName = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
    this.nullByte = this._io.readU1();
    this.compressedArea = new CompressedArea(this._io, this, this._root);
    this.compressedArea._read();
    this.playerCount = this._io.readU4le();
    this.gameType = this._io.readU1();
    this.priv = this._io.readU1();
    this.unknown = this._io.readU2le();
    this.languageId = this._io.readU4le();
    this.playerOr0x19 = new PlayerOr0x19(this._io, this, this._root);
    this.playerOr0x19._read();
    this.slotRecordsHeader = new SlotRecordsHeader(this._io, this, this._root);
    this.slotRecordsHeader._read();
    this._raw_slotRecord = this._io.readBytes((this.slotRecordsHeader.slotRecordSize * this.slotRecordsHeader.numSlotRecord));
    var _io__raw_slotRecord = new KaitaiStream(this._raw_slotRecord);
    this.slotRecord = new SlotRecordChunk(_io__raw_slotRecord, this, this._root, this.slotRecordsHeader.slotRecordSize, this.slotRecordsHeader.numSlotRecord);
    this.slotRecord._read();
    this.randomSeed = this._io.readU4le();
    this.selectMode = this._io.readU1();
    this.numStartPosition = this._io.readU1();
    this.block = [];
    var i = 0;
    while (!this._io.isEof()) {
      var _t_block = new Block(this._io, this, this._root);
      _t_block._read();
      this.block.push(_t_block);
      i++;
    }
  }

  var ActionCheatWhosYourDaddyPayload = W3W3g.ActionCheatWhosYourDaddyPayload = (function() {
    function ActionCheatWhosYourDaddyPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatWhosYourDaddyPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatWhosYourDaddyPayload;
  })();

  var ActionCheatISeeDeadPeoplePayload = W3W3g.ActionCheatISeeDeadPeoplePayload = (function() {
    function ActionCheatISeeDeadPeoplePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatISeeDeadPeoplePayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatISeeDeadPeoplePayload;
  })();

  var ActionSetGameSpeedPayload = W3W3g.ActionSetGameSpeedPayload = (function() {
    function ActionSetGameSpeedPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionSetGameSpeedPayload.prototype._read = function() {
      this.speed = this._io.readU1();
    }

    return ActionSetGameSpeedPayload;
  })();

  var ActionCancelHeroRevivalPayload = W3W3g.ActionCancelHeroRevivalPayload = (function() {
    function ActionCancelHeroRevivalPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCancelHeroRevivalPayload.prototype._read = function() {
      this.unitId1 = this._io.readU4le();
      this.unitId2 = this._io.readU4le();
    }

    return ActionCancelHeroRevivalPayload;
  })();

  var ActionCheatTheDudeAbidesPayload = W3W3g.ActionCheatTheDudeAbidesPayload = (function() {
    function ActionCheatTheDudeAbidesPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatTheDudeAbidesPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatTheDudeAbidesPayload;
  })();

  var ActionCheatSomebodySetUpUsTheBombPayload = W3W3g.ActionCheatSomebodySetUpUsTheBombPayload = (function() {
    function ActionCheatSomebodySetUpUsTheBombPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatSomebodySetUpUsTheBombPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatSomebodySetUpUsTheBombPayload;
  })();

  var OrderId = W3W3g.OrderId = (function() {
    function OrderId(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    OrderId.prototype._read = function() {
      this.rawBytes = this._io.readBytes(4);
    }
    Object.defineProperty(OrderId.prototype, 'orderId', {
      get: function() {
        if (this._m_orderId !== undefined)
          return this._m_orderId;
        this._m_orderId = ((((((this.rawBytes[3] * 256) * 256) * 256) + ((this.rawBytes[2] * 256) * 256)) + (this.rawBytes[1] * 256)) + this.rawBytes[0]);
        return this._m_orderId;
      }
    });
    Object.defineProperty(OrderId.prototype, 'abilityId', {
      get: function() {
        if (this._m_abilityId !== undefined)
          return this._m_abilityId;
        if (this.rawBytes[3] > 0) {
          this._m_abilityId = Array.from(KaitaiStream.bytesToStr(this.rawBytes, this.ascii)).reverse().join('');
        }
        return this._m_abilityId;
      }
    });

    return OrderId;
  })();

  var ActionAssignGroupHotkeyPayloadItem = W3W3g.ActionAssignGroupHotkeyPayloadItem = (function() {
    function ActionAssignGroupHotkeyPayloadItem(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionAssignGroupHotkeyPayloadItem.prototype._read = function() {
      this.objectId1 = this._io.readU4le();
      this.objectId2 = this._io.readU4le();
    }

    return ActionAssignGroupHotkeyPayloadItem;
  })();

  var SlotRecordsHeader = W3W3g.SlotRecordsHeader = (function() {
    function SlotRecordsHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    SlotRecordsHeader.prototype._read = function() {
      this.numStartBytes = this._io.readU2le();
      this.numSlotRecord = this._io.readU1();
    }
    Object.defineProperty(SlotRecordsHeader.prototype, 'slotRecordSize', {
      get: function() {
        if (this._m_slotRecordSize !== undefined)
          return this._m_slotRecordSize;
        this._m_slotRecordSize = Math.floor(((this.numStartBytes - 4) - 3) / this.numSlotRecord);
        return this._m_slotRecordSize;
      }
    });

    return SlotRecordsHeader;
  })();

  var AbilityFlags = W3W3g.AbilityFlags = (function() {
    function AbilityFlags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    AbilityFlags.prototype._read = function() {
      this.queueCommand = this._io.readU1();
      this.applyToAllUnitsInSubgroup = this._io.readU1();
      this.areaEffect = this._io.readU1();
      this.applyToAllUnitsInSelection = this._io.readU1();
      this.moveGroupWithoutFormation = this._io.readU1();
      this.unknown = this._io.readU1();
      this.subgroupCommand = this._io.readU1();
      this.unknown2 = this._io.readU1();
      this.autocast = this._io.readU1();
    }

    return AbilityFlags;
  })();

  var PlayerMetaData = W3W3g.PlayerMetaData = (function() {
    function PlayerMetaData(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayerMetaData.prototype._read = function() {
      this.lenPlayerMetaDataContent = this._io.readU1();
      this._raw_playerMetaDataContent = this._io.readBytes(this.lenPlayerMetaDataContent);
      var _io__raw_playerMetaDataContent = new KaitaiStream(this._raw_playerMetaDataContent);
      this.playerMetaDataContent = new PlayerMetaDataContent(_io__raw_playerMetaDataContent, this, this._root);
      this.playerMetaDataContent._read();
    }

    return PlayerMetaData;
  })();

  var ActionSaveGameFinishedPayload = W3W3g.ActionSaveGameFinishedPayload = (function() {
    function ActionSaveGameFinishedPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionSaveGameFinishedPayload.prototype._read = function() {
      this.unknown = this._io.readU4le();
    }

    return ActionSaveGameFinishedPayload;
  })();

  var ActionCheatWarpTenPayload = W3W3g.ActionCheatWarpTenPayload = (function() {
    function ActionCheatWarpTenPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatWarpTenPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatWarpTenPayload;
  })();

  var SlotRecordChunk = W3W3g.SlotRecordChunk = (function() {
    function SlotRecordChunk(_io, _parent, _root, slotRecordSize, numSlotRecord) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.slotRecordSize = slotRecordSize;
      this.numSlotRecord = numSlotRecord;

    }
    SlotRecordChunk.prototype._read = function() {
      this.slotRecord = [];
      for (var i = 0; i < this.numSlotRecord; i++) {
        var _t_slotRecord = new SlotRecord(this._io, this, this._root, this.slotRecordSize);
        _t_slotRecord._read();
        this.slotRecord.push(_t_slotRecord);
      }
    }

    return SlotRecordChunk;
  })();

  var ActionChangeSelectionPayload = W3W3g.ActionChangeSelectionPayload = (function() {
    function ActionChangeSelectionPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionChangeSelectionPayload.prototype._read = function() {
      this.mode = this._io.readU1();
      this.numUnit = this._io.readU2le();
      this.unit = [];
      for (var i = 0; i < this.numUnit; i++) {
        var _t_unit = new ActionChangeSelectionPayloadUnit(this._io, this, this._root);
        _t_unit._read();
        this.unit.push(_t_unit);
      }
    }

    return ActionChangeSelectionPayload;
  })();

  var ActionUnitBuildingAbilityPayload = W3W3g.ActionUnitBuildingAbilityPayload = (function() {
    function ActionUnitBuildingAbilityPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnitBuildingAbilityPayload.prototype._read = function() {
      this.abilityFlags = this._io.readU2le();
      this.orderId = new OrderId(this._io, this, this._root);
      this.orderId._read();
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
    }

    return ActionUnitBuildingAbilityPayload;
  })();

  var ActionScenarioTriggerPayload = W3W3g.ActionScenarioTriggerPayload = (function() {
    function ActionScenarioTriggerPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionScenarioTriggerPayload.prototype._read = function() {
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
      this.unknownCounter = this._io.readU4le();
    }

    return ActionScenarioTriggerPayload;
  })();

  var TimeSlot = W3W3g.TimeSlot = (function() {
    function TimeSlot(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    TimeSlot.prototype._read = function() {
      this.n = this._io.readU2le();
      this.timeIncrementMs = this._io.readU2le();
      if (this.n > 2) {
        this._raw_commandData = this._io.readBytes((this.n - 2));
        var _io__raw_commandData = new KaitaiStream(this._raw_commandData);
        this.commandData = new CommandData(_io__raw_commandData, this, this._root);
        this.commandData._read();
      }
    }

    return TimeSlot;
  })();

  var ActionMapTriggerChatCommandPayload = W3W3g.ActionMapTriggerChatCommandPayload = (function() {
    function ActionMapTriggerChatCommandPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionMapTriggerChatCommandPayload.prototype._read = function() {
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
      this.chatCommandOrTriggerName = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
    }

    return ActionMapTriggerChatCommandPayload;
  })();

  var ActionChangeSelectionPayloadUnit = W3W3g.ActionChangeSelectionPayloadUnit = (function() {
    function ActionChangeSelectionPayloadUnit(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionChangeSelectionPayloadUnit.prototype._read = function() {
      this.objectId1 = this._io.readU4le();
      if (!(this._io.isEof())) {
        this.objectId2 = this._io.readU4le();
      }
    }

    return ActionChangeSelectionPayloadUnit;
  })();

  var ActionUnknown0x21Payload = W3W3g.ActionUnknown0x21Payload = (function() {
    function ActionUnknown0x21Payload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnknown0x21Payload.prototype._read = function() {
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
    }

    return ActionUnknown0x21Payload;
  })();

  var ActionMinimapSignalPayload = W3W3g.ActionMinimapSignalPayload = (function() {
    function ActionMinimapSignalPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionMinimapSignalPayload.prototype._read = function() {
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
      this.unknown = this._io.readU4le();
    }

    return ActionMinimapSignalPayload;
  })();

  var ActionUnknown0x7bPayload = W3W3g.ActionUnknown0x7bPayload = (function() {
    function ActionUnknown0x7bPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnknown0x7bPayload.prototype._read = function() {
      this.x = this._io.readU4le();
      this.y = this._io.readU4le();
      this.orderId1 = new OrderId(this._io, this, this._root);
      this.orderId1._read();
      this.orderId2 = new OrderId(this._io, this, this._root);
      this.orderId2._read();
    }

    return ActionUnknown0x7bPayload;
  })();

  var ActionSaveGamePayload = W3W3g.ActionSaveGamePayload = (function() {
    function ActionSaveGamePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionSaveGamePayload.prototype._read = function() {
      this.name = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
    }

    return ActionSaveGamePayload;
  })();

  var LeaveGame = W3W3g.LeaveGame = (function() {
    function LeaveGame(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    LeaveGame.prototype._read = function() {
      this.reason = this._io.readU4le();
      this.playerId = this._io.readU1();
      this.res = this._io.readU4le();
      this.unknownFlag = this._io.readU4le();
    }

    return LeaveGame;
  })();

  var ActionUnitBuildingAbilityWithTargetPositionAndObjectPayload = W3W3g.ActionUnitBuildingAbilityWithTargetPositionAndObjectPayload = (function() {
    function ActionUnitBuildingAbilityWithTargetPositionAndObjectPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnitBuildingAbilityWithTargetPositionAndObjectPayload.prototype._read = function() {
      this.abilityFlags = this._io.readU2le();
      this.orderId = new OrderId(this._io, this, this._root);
      this.orderId._read();
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
      this.objectId1 = this._io.readU4le();
      this.objectId2 = this._io.readU4le();
    }

    return ActionUnitBuildingAbilityWithTargetPositionAndObjectPayload;
  })();

  var ActionEscPressedPayload = W3W3g.ActionEscPressedPayload = (function() {
    function ActionEscPressedPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionEscPressedPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionEscPressedPayload;
  })();

  var ActionSelectGroundItemPayload = W3W3g.ActionSelectGroundItemPayload = (function() {
    function ActionSelectGroundItemPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionSelectGroundItemPayload.prototype._read = function() {
      this.unknown = this._io.readU1();
      this.objectId1 = this._io.readU4le();
      this.objectId2 = this._io.readU4le();
    }

    return ActionSelectGroundItemPayload;
  })();

  var ActionCheatIocainePowderPayload = W3W3g.ActionCheatIocainePowderPayload = (function() {
    function ActionCheatIocainePowderPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatIocainePowderPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatIocainePowderPayload;
  })();

  var ActionCheatAllYourBaseAreBelongToUsPayload = W3W3g.ActionCheatAllYourBaseAreBelongToUsPayload = (function() {
    function ActionCheatAllYourBaseAreBelongToUsPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatAllYourBaseAreBelongToUsPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatAllYourBaseAreBelongToUsPayload;
  })();

  var PlayerOr0x19Loop = W3W3g.PlayerOr0x19Loop = (function() {
    function PlayerOr0x19Loop(_io, _parent, _root, count) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.count = count;

    }
    PlayerOr0x19Loop.prototype._read = function() {
      this.discriminator = this._io.readU1();
      if (this.discriminator == 22) {
        this.player = new Player(this._io, this, this._root, 0);
        this.player._read();
      }
      if (this.discriminator == 22) {
        this.padding = this._io.readU4le();
      }
      if (this.discriminator == 22) {
        this.next = new PlayerOr0x19Loop(this._io, this, this._root, (this.count + 1));
        this.next._read();
      }
      if ( ((this.discriminator != 22) && (this.discriminator != 25)) ) {
        this.playerMetaDataChunk = new PlayerMetaDataChunk(this._io, this, this._root);
        this.playerMetaDataChunk._read();
      }
    }

    return PlayerOr0x19Loop;
  })();

  var CommandData = W3W3g.CommandData = (function() {
    function CommandData(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    CommandData.prototype._read = function() {
      this.playerId = this._io.readU1();
      this.lenActionBlock = this._io.readU2le();
      this._raw_actionBlock = this._io.readBytes(this.lenActionBlock);
      var _io__raw_actionBlock = new KaitaiStream(this._raw_actionBlock);
      this.actionBlock = new ActionBlock(_io__raw_actionBlock, this, this._root);
      this.actionBlock._read();
    }

    return CommandData;
  })();

  var ActionCheatStrengthAndHonorPayload = W3W3g.ActionCheatStrengthAndHonorPayload = (function() {
    function ActionCheatStrengthAndHonorPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatStrengthAndHonorPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatStrengthAndHonorPayload;
  })();

  var Chat = W3W3g.Chat = (function() {
    function Chat(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Chat.prototype._read = function() {
      this.playerSenderId = this._io.readU1();
      this.size = this._io.readU2le();
      this.flags = this._io.readU1();
      if (this.flags != 16) {
        this.chatRecipientIndex = this._io.readU4le();
      }
      this.message = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
    }

    return Chat;
  })();

  var ActionCheatWhoIsJohnGaltPayload = W3W3g.ActionCheatWhoIsJohnGaltPayload = (function() {
    function ActionCheatWhoIsJohnGaltPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatWhoIsJohnGaltPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatWhoIsJohnGaltPayload;
  })();

  var ActionEnterChooseBuildingSubmenuPayload = W3W3g.ActionEnterChooseBuildingSubmenuPayload = (function() {
    function ActionEnterChooseBuildingSubmenuPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionEnterChooseBuildingSubmenuPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionEnterChooseBuildingSubmenuPayload;
  })();

  var ActionCheatSynergyPayload = W3W3g.ActionCheatSynergyPayload = (function() {
    function ActionCheatSynergyPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatSynergyPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatSynergyPayload;
  })();

  var ActionContinueGameAfterWinOrDefeat2Payload = W3W3g.ActionContinueGameAfterWinOrDefeat2Payload = (function() {
    function ActionContinueGameAfterWinOrDefeat2Payload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionContinueGameAfterWinOrDefeat2Payload.prototype._read = function() {
      this.a = this._io.readU4le();
      this.b = this._io.readU4le();
      this.c = this._io.readU4le();
      this.d = this._io.readU4le();
    }

    return ActionContinueGameAfterWinOrDefeat2Payload;
  })();

  var ActionSelectSubgroupPayload = W3W3g.ActionSelectSubgroupPayload = (function() {
    function ActionSelectSubgroupPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionSelectSubgroupPayload.prototype._read = function() {
      this.itemId = KaitaiStream.bytesToStr(this._io.readBytes(4), "ASCII");
      this.objectId1 = this._io.readU4le();
      this.objectId2 = this._io.readU4le();
    }

    return ActionSelectSubgroupPayload;
  })();

  var Block = W3W3g.Block = (function() {
    function Block(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Block.prototype._read = function() {
      this.blockId = this._io.readU1();
      if (this.blockId == 23) {
        this.leaveGame = new LeaveGame(this._io, this, this._root);
        this.leaveGame._read();
      }
      if ( ((this.blockId == 26) || (this.blockId == 27) || (this.blockId == 28)) ) {
        this.block0x1a0x1b0x1cSkip = [];
        for (var i = 0; i < 4; i++) {
          this.block0x1a0x1b0x1cSkip.push(this._io.readU1());
        }
      }
      if ( ((this.blockId == 30) || (this.blockId == 31)) ) {
        this.timeSlot = new TimeSlot(this._io, this, this._root);
        this.timeSlot._read();
      }
      if (this.blockId == 32) {
        this.chat = new Chat(this._io, this, this._root);
        this.chat._read();
      }
      if (this.blockId == 34) {
        this.block0x22Skip = [];
        for (var i = 0; i < 5; i++) {
          this.block0x22Skip.push(this._io.readU1());
        }
      }
      if (this.blockId == 35) {
        this.block0x23Skip = [];
        for (var i = 0; i < 11; i++) {
          this.block0x23Skip.push(this._io.readU1());
        }
      }
      if (this.blockId == 47) {
        this.countdown = new Countdown(this._io, this, this._root);
        this.countdown._read();
      }
    }

    return Block;
  })();

  var CompressedArea = W3W3g.CompressedArea = (function() {
    function CompressedArea(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    CompressedArea.prototype._read = function() {
      this._raw_content = this._io.readBytesTerm(0, false, true, true);
      var _process = new BlizzardDecompress();
      this.content = _process.decode(this._raw_content);
    }

    return CompressedArea;
  })();

  var PlayerMetaDataChunk = W3W3g.PlayerMetaDataChunk = (function() {
    function PlayerMetaDataChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayerMetaDataChunk.prototype._read = function() {
      this.skipToMeta = [];
      for (var i = 0; i < 11; i++) {
        this.skipToMeta.push(this._io.readU1());
      }
      this.playerMetaDataLoop = new PlayerMetaDataLoop(this._io, this, this._root, 0);
      this.playerMetaDataLoop._read();
    }

    return PlayerMetaDataChunk;
  })();

  var Player = W3W3g.Player = (function() {
    function Player(_io, _parent, _root, useHost) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.useHost = useHost;

    }
    Player.prototype._read = function() {
      if (this.useHost != 0) {
        this.nonHost = this._io.readU1();
      }
      this.playerId = this._io.readU1();
      this.name = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
      this.customOrLadderIndex = this._io.readU1();
      this.customOrLadderSkip = this._io.readBytes(this.customOrLadderIndex);
      if (this.customOrLadderIndex == 8) {
        this.runtime = this._io.readU4le();
      }
      if (this.customOrLadderIndex == 8) {
        this.raceIndex = this._io.readU4le();
      }
    }
    Object.defineProperty(Player.prototype, 'customOrLadderEnum', {
      get: function() {
        if (this._m_customOrLadderEnum !== undefined)
          return this._m_customOrLadderEnum;
        this._m_customOrLadderEnum = this.customOrLadderIndex;
        return this._m_customOrLadderEnum;
      }
    });
    Object.defineProperty(Player.prototype, 'race', {
      get: function() {
        if (this._m_race !== undefined)
          return this._m_race;
        this._m_race = this.raceIndex;
        return this._m_race;
      }
    });

    return Player;
  })();

  var ActionCheatThereIsNoSpoonPayload = W3W3g.ActionCheatThereIsNoSpoonPayload = (function() {
    function ActionCheatThereIsNoSpoonPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatThereIsNoSpoonPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatThereIsNoSpoonPayload;
  })();

  var ActionGiveOrDropItemPayload = W3W3g.ActionGiveOrDropItemPayload = (function() {
    function ActionGiveOrDropItemPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionGiveOrDropItemPayload.prototype._read = function() {
      this.abilityFlags = this._io.readU2le();
      this.orderId = new OrderId(this._io, this, this._root);
      this.orderId._read();
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
      this.targetObjectId1 = this._io.readU4le();
      this.targetObjectId2 = this._io.readU4le();
      this.itemObjectId1 = this._io.readU4le();
      this.itemObjectId2 = this._io.readU4le();
    }

    return ActionGiveOrDropItemPayload;
  })();

  var ActionDecreaseGameSpeedPayload = W3W3g.ActionDecreaseGameSpeedPayload = (function() {
    function ActionDecreaseGameSpeedPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionDecreaseGameSpeedPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionDecreaseGameSpeedPayload;
  })();

  var ActionTransferResourcesPayload = W3W3g.ActionTransferResourcesPayload = (function() {
    function ActionTransferResourcesPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionTransferResourcesPayload.prototype._read = function() {
      this.playerSlotIndex = this._io.readU1();
      this.goldAmount = this._io.readU4le();
      this.lumberAmount = this._io.readU4le();
    }

    return ActionTransferResourcesPayload;
  })();

  var ActionSelectGroupHotkeyPayload = W3W3g.ActionSelectGroupHotkeyPayload = (function() {
    function ActionSelectGroupHotkeyPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionSelectGroupHotkeyPayload.prototype._read = function() {
      this.groupIndex = this._io.readU1();
      this.unknown = this._io.readU1();
    }

    return ActionSelectGroupHotkeyPayload;
  })();

  var ActionBlock = W3W3g.ActionBlock = (function() {
    function ActionBlock(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionBlock.prototype._read = function() {
      this.action = [];
      var i = 0;
      while (!this._io.isEof()) {
        var _t_action = new Action(this._io, this, this._root);
        _t_action._read();
        this.action.push(_t_action);
        i++;
      }
    }

    return ActionBlock;
  })();

  var ActionNothingTakeRest = W3W3g.ActionNothingTakeRest = (function() {
    function ActionNothingTakeRest(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionNothingTakeRest.prototype._read = function() {
      this.nothing = this._io.readBytesFull();
    }

    return ActionNothingTakeRest;
  })();

  var ActionResumeGamePayload = W3W3g.ActionResumeGamePayload = (function() {
    function ActionResumeGamePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionResumeGamePayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionResumeGamePayload;
  })();

  var ActionEnterChooseHeroSkillSubmenuPayload = W3W3g.ActionEnterChooseHeroSkillSubmenuPayload = (function() {
    function ActionEnterChooseHeroSkillSubmenuPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionEnterChooseHeroSkillSubmenuPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionEnterChooseHeroSkillSubmenuPayload;
  })();

  var ActionContinueGameAfterWinOrDefeatPayload = W3W3g.ActionContinueGameAfterWinOrDefeatPayload = (function() {
    function ActionContinueGameAfterWinOrDefeatPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionContinueGameAfterWinOrDefeatPayload.prototype._read = function() {
      this.a = this._io.readU4le();
      this.b = this._io.readU4le();
      this.c = this._io.readU4le();
      this.d = this._io.readU4le();
    }

    return ActionContinueGameAfterWinOrDefeatPayload;
  })();

  var ActionIncreaseGameSpeedPayload = W3W3g.ActionIncreaseGameSpeedPayload = (function() {
    function ActionIncreaseGameSpeedPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionIncreaseGameSpeedPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionIncreaseGameSpeedPayload;
  })();

  var ChangeAllyOptionsFlags = W3W3g.ChangeAllyOptionsFlags = (function() {
    function ChangeAllyOptionsFlags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ChangeAllyOptionsFlags.prototype._read = function() {
      this.alliedWithPlayer = [];
      for (var i = 0; i < 5; i++) {
        this.alliedWithPlayer.push(this._io.readBitsIntBe(1) != 0);
      }
      this.visionShared = this._io.readBitsIntBe(1) != 0;
      this.sharedControl = this._io.readBitsIntBe(1) != 0;
      this.unknown = [];
      for (var i = 0; i < 3; i++) {
        this.unknown.push(this._io.readBitsIntBe(1) != 0);
      }
      this.alliedVictory = this._io.readBitsIntBe(1) != 0;
    }

    return ChangeAllyOptionsFlags;
  })();

  var ActionCheatLeafitToMePayload = W3W3g.ActionCheatLeafitToMePayload = (function() {
    function ActionCheatLeafitToMePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatLeafitToMePayload.prototype._read = function() {
      this.unknown = this._io.readU1();
      this.amount = this._io.readU4le();
    }

    return ActionCheatLeafitToMePayload;
  })();

  var ActionRemoveUnitFromBuildingQueuePayload = W3W3g.ActionRemoveUnitFromBuildingQueuePayload = (function() {
    function ActionRemoveUnitFromBuildingQueuePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionRemoveUnitFromBuildingQueuePayload.prototype._read = function() {
      this.slotIndex = this._io.readU1();
      this.itemId = this._io.readU4le();
    }

    return ActionRemoveUnitFromBuildingQueuePayload;
  })();

  var ActionCheatItVexesMePayload = W3W3g.ActionCheatItVexesMePayload = (function() {
    function ActionCheatItVexesMePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatItVexesMePayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatItVexesMePayload;
  })();

  var ActionUnitBuildingAbilityWithTwoTargetPositionsAndTwoItemIdsPayload = W3W3g.ActionUnitBuildingAbilityWithTwoTargetPositionsAndTwoItemIdsPayload = (function() {
    function ActionUnitBuildingAbilityWithTwoTargetPositionsAndTwoItemIdsPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnitBuildingAbilityWithTwoTargetPositionsAndTwoItemIdsPayload.prototype._read = function() {
      this.abilityFlags = this._io.readU2le();
      this.orderIdA = new OrderId(this._io, this, this._root);
      this.orderIdA._read();
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
      this.xA = this._io.readF4le();
      this.yA = this._io.readF4le();
      this.orderIdB = new OrderId(this._io, this, this._root);
      this.orderIdB._read();
      this.unknown = [];
      for (var i = 0; i < 9; i++) {
        this.unknown.push(this._io.readU1());
      }
      this.xB = this._io.readF4le();
      this.yB = this._io.readF4le();
    }

    return ActionUnitBuildingAbilityWithTwoTargetPositionsAndTwoItemIdsPayload;
  })();

  var ActionChangeAllyOptionsPayload = W3W3g.ActionChangeAllyOptionsPayload = (function() {
    function ActionChangeAllyOptionsPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionChangeAllyOptionsPayload.prototype._read = function() {
      this.playerSlotIndex = this._io.readU1();
      this._raw_flags = this._io.readBytes(4);
      var _io__raw_flags = new KaitaiStream(this._raw_flags);
      this.flags = new ChangeAllyOptionsFlags(_io__raw_flags, this, this._root);
      this.flags._read();
    }

    return ActionChangeAllyOptionsPayload;
  })();

  var PlayerMetaDataLoop = W3W3g.PlayerMetaDataLoop = (function() {
    function PlayerMetaDataLoop(_io, _parent, _root, count) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.count = count;

    }
    PlayerMetaDataLoop.prototype._read = function() {
      this.discriminator = this._io.readU1();
      if (this.discriminator != 25) {
        this.playerMetaData = new PlayerMetaData(this._io, this, this._root);
        this.playerMetaData._read();
      }
      if (this.discriminator != 25) {
        this.next = new PlayerMetaDataLoop(this._io, this, this._root, (this.count + 1));
        this.next._read();
      }
    }

    return PlayerMetaDataLoop;
  })();

  var ActionCheatPointBreakPayload = W3W3g.ActionCheatPointBreakPayload = (function() {
    function ActionCheatPointBreakPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatPointBreakPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatPointBreakPayload;
  })();

  var SlotRecord = W3W3g.SlotRecord = (function() {
    function SlotRecord(_io, _parent, _root, slotRecordSize) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.slotRecordSize = slotRecordSize;

    }
    SlotRecord.prototype._read = function() {
      this.playerId = this._io.readU1();
      this.mapDownloadPercent = this._io.readU1();
      this.status = this._io.readU1();
      this.controller = this._io.readU1();
      this.team = this._io.readU1();
      this.color = this._io.readU1();
      this.race = this._io.readU1();
      if (8 <= this.slotRecordSize) {
        this.aiStrength = this._io.readU1();
      }
      if (9 <= this.slotRecordSize) {
        this.handicap = this._io.readU1();
      }
    }

    return SlotRecord;
  })();

  var ActionUnknown0x75Payload = W3W3g.ActionUnknown0x75Payload = (function() {
    function ActionUnknown0x75Payload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnknown0x75Payload.prototype._read = function() {
      this.unknown = this._io.readU1();
    }

    return ActionUnknown0x75Payload;
  })();

  var PlayerOr0x19 = W3W3g.PlayerOr0x19 = (function() {
    function PlayerOr0x19(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayerOr0x19.prototype._read = function() {
      this.playerOr0x19Loop = new PlayerOr0x19Loop(this._io, this, this._root, 0);
      this.playerOr0x19Loop._read();
    }

    return PlayerOr0x19;
  })();

  var ActionPreSubselectionPayload = W3W3g.ActionPreSubselectionPayload = (function() {
    function ActionPreSubselectionPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionPreSubselectionPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionPreSubselectionPayload;
  })();

  var PlayerMetaDataContent = W3W3g.PlayerMetaDataContent = (function() {
    function PlayerMetaDataContent(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayerMetaDataContent.prototype._read = function() {
      this.size = this._io.readU1();
      this.id = this._io.readU1();
      this.unknown = this._io.readU1();
      this.lenIntName = this._io.readU1();
      this.name = KaitaiStream.bytesToStr(this._io.readBytes(this.lenIntName), "UTF-8");
      this.terminator = this._io.readU1();
      this.lenIntClan = this._io.readU1();
      this.clan = KaitaiStream.bytesToStr(this._io.readBytes(this.lenIntClan), "UTF-8");
      this.clanTerminator = this._io.readU1();
      this.lenIntExtra = this._io.readU1();
    }

    return PlayerMetaDataContent;
  })();

  var Countdown = W3W3g.Countdown = (function() {
    function Countdown(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Countdown.prototype._read = function() {
      this.pre = this._io.readU1();
      this.mode = this._io.readU4le();
      this.secs = this._io.readU4le();
    }

    return Countdown;
  })();

  var ActionCheatSharpAndShinyPayload = W3W3g.ActionCheatSharpAndShinyPayload = (function() {
    function ActionCheatSharpAndShinyPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatSharpAndShinyPayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionCheatSharpAndShinyPayload;
  })();

  var Action = W3W3g.Action = (function() {
    function Action(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Action.prototype._read = function() {
      this.actionId = this._io.readU1();
      switch (this.actionId) {
      case W3W3g.ActionId.ENTER_CHOOSE_BUILDING_SUBMENU:
        this.actionPayload = new ActionEnterChooseBuildingSubmenuPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_GREED_IS_GOOD:
        this.actionPayload = new ActionCheatGreedIsGoodPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.MINIMAP_SIGNAL:
        this.actionPayload = new ActionMinimapSignalPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_LEAFIT_TO_ME:
        this.actionPayload = new ActionCheatLeafitToMePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_ALL_YOUR_BASE_ARE_BELONG_TO_US:
        this.actionPayload = new ActionCheatAllYourBaseAreBelongToUsPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_SHARP_AND_SHINY:
        this.actionPayload = new ActionCheatSharpAndShinyPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.SAVE_GAME_FINISHED:
        this.actionPayload = new ActionSaveGameFinishedPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.DECREASE_GAME_SPEED:
        this.actionPayload = new ActionDecreaseGameSpeedPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_IOCAINE_POWDER:
        this.actionPayload = new ActionCheatIocainePowderPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNKNOWN_0X1B:
        this.actionPayload = new ActionUnknown0x1bPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.ASSIGN_GROUP_HOTKEY:
        this.actionPayload = new ActionAssignGroupHotkeyPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_WARP_TEN:
        this.actionPayload = new ActionCheatWarpTenPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHANGE_SELECTION:
        this.actionPayload = new ActionChangeSelectionPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.TRANSFER_RESOURCES:
        this.actionPayload = new ActionTransferResourcesPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.RESUME_GAME:
        this.actionPayload = new ActionResumeGamePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_THERE_IS_NO_SPOON:
        this.actionPayload = new ActionCheatThereIsNoSpoonPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNIT_BUILDING_ABILITY_WITH_TARGET_POSITION_AND_OBJECT:
        this.actionPayload = new ActionUnitBuildingAbilityWithTargetPositionAndObjectPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_KEYSER_SOZE:
        this.actionPayload = new ActionCheatKeyserSozePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_SOMEBODY_SET_UP_US_THE_BOMB:
        this.actionPayload = new ActionCheatSomebodySetUpUsTheBombPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CONTINUE_GAME_AFTER_WIN_OR_DEFEAT2:
        this.actionPayload = new ActionContinueGameAfterWinOrDefeat2Payload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNIT_BUILDING_ABILITY_WITH_TWO_TARGET_POSITIONS_AND_TWO_ITEM_IDS:
        this.actionPayload = new ActionUnitBuildingAbilityWithTwoTargetPositionsAndTwoItemIdsPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.ESC_PRESSED:
        this.actionPayload = new ActionEscPressedPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.SELECT_SUBGROUP:
        this.actionPayload = new ActionSelectSubgroupPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHANGE_ALLY_OPTIONS:
        this.actionPayload = new ActionChangeAllyOptionsPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.GIVE_OR_DROP_ITEM:
        this.actionPayload = new ActionGiveOrDropItemPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CANCEL_HERO_REVIVAL:
        this.actionPayload = new ActionCancelHeroRevivalPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_THE_DUDE_ABIDES:
        this.actionPayload = new ActionCheatTheDudeAbidesPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.PAUSE_GAME:
        this.actionPayload = new ActionPauseGamePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.REMOVE_UNIT_FROM_BUILDING_QUEUE:
        this.actionPayload = new ActionRemoveUnitFromBuildingQueuePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.ENTER_CHOOSE_HERO_SKILL_SUBMENU:
        this.actionPayload = new ActionEnterChooseHeroSkillSubmenuPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.INCREASE_GAME_SPEED:
        this.actionPayload = new ActionIncreaseGameSpeedPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.SET_GAME_SPEED:
        this.actionPayload = new ActionSetGameSpeedPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_SYNERGY:
        this.actionPayload = new ActionCheatSynergyPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_WHOS_YOUR_DADDY:
        this.actionPayload = new ActionCheatWhosYourDaddyPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_WHO_IS_JOHN_GALT:
        this.actionPayload = new ActionCheatWhoIsJohnGaltPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNKNOWN_0X7B:
        this.actionPayload = new ActionUnknown0x7bPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_I_SEE_DEAD_PEOPLE:
        this.actionPayload = new ActionCheatISeeDeadPeoplePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.SELECT_GROUP_HOTKEY:
        this.actionPayload = new ActionSelectGroupHotkeyPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNIT_BUILDING_ABILITY_WITH_TARGET_POSITION:
        this.actionPayload = new ActionUnitBuildingAbilityWithTargetPosition(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.SELECT_GROUND_ITEM:
        this.actionPayload = new ActionSelectGroundItemPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CONTINUE_GAME_AFTER_WIN_OR_DEFEAT:
        this.actionPayload = new ActionContinueGameAfterWinOrDefeatPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_DAY_LIGHT_SAVINGS:
        this.actionPayload = new ActionCheatDayLightSavingsPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.CHEAT_IT_VEXES_ME:
        this.actionPayload = new ActionCheatItVexesMePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNKNOWN_0X75:
        this.actionPayload = new ActionUnknown0x75Payload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNIT_BUILDING_ABILITY:
        this.actionPayload = new ActionUnitBuildingAbilityPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.UNKNOWN_0X21:
        this.actionPayload = new ActionUnknown0x21Payload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.SCENARIO_TRIGGER:
        this.actionPayload = new ActionScenarioTriggerPayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      case W3W3g.ActionId.SAVE_GAME:
        this.actionPayload = new ActionSaveGamePayload(this._io, this, this._root);
        this.actionPayload._read();
        break;
      default:
        this.actionPayload = new ActionNothingTakeRest(this._io, this, this._root);
        this.actionPayload._read();
        break;
      }
    }

    return Action;
  })();

  var ActionUnitBuildingAbilityWithTargetPosition = W3W3g.ActionUnitBuildingAbilityWithTargetPosition = (function() {
    function ActionUnitBuildingAbilityWithTargetPosition(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnitBuildingAbilityWithTargetPosition.prototype._read = function() {
      this.abilityFlags = this._io.readU2le();
      this.orderId = new OrderId(this._io, this, this._root);
      this.orderId._read();
      this.unknownA = this._io.readU4le();
      this.unknownB = this._io.readU4le();
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
    }

    return ActionUnitBuildingAbilityWithTargetPosition;
  })();

  var ActionCheatKeyserSozePayload = W3W3g.ActionCheatKeyserSozePayload = (function() {
    function ActionCheatKeyserSozePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatKeyserSozePayload.prototype._read = function() {
      this.unknown = this._io.readU1();
      this.amount = this._io.readU4le();
    }

    return ActionCheatKeyserSozePayload;
  })();

  var ActionCheatGreedIsGoodPayload = W3W3g.ActionCheatGreedIsGoodPayload = (function() {
    function ActionCheatGreedIsGoodPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatGreedIsGoodPayload.prototype._read = function() {
      this.unknown = this._io.readU1();
      this.amount = this._io.readU4le();
    }

    return ActionCheatGreedIsGoodPayload;
  })();

  var ActionCheatDayLightSavingsPayload = W3W3g.ActionCheatDayLightSavingsPayload = (function() {
    function ActionCheatDayLightSavingsPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionCheatDayLightSavingsPayload.prototype._read = function() {
      this.time = this._io.readF4le();
    }

    return ActionCheatDayLightSavingsPayload;
  })();

  var ActionAssignGroupHotkeyPayload = W3W3g.ActionAssignGroupHotkeyPayload = (function() {
    function ActionAssignGroupHotkeyPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionAssignGroupHotkeyPayload.prototype._read = function() {
      this.groupIndex = this._io.readU1();
      this.numItem = this._io.readU2le();
      this.item = [];
      for (var i = 0; i < this.numItem; i++) {
        var _t_item = new ActionAssignGroupHotkeyPayloadItem(this._io, this, this._root);
        _t_item._read();
        this.item.push(_t_item);
      }
    }

    return ActionAssignGroupHotkeyPayload;
  })();

  var ActionPauseGamePayload = W3W3g.ActionPauseGamePayload = (function() {
    function ActionPauseGamePayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionPauseGamePayload.prototype._read = function() {
      this.nothing = this._io.readBytes(0);
    }

    return ActionPauseGamePayload;
  })();

  var ActionUnknown0x1bPayload = W3W3g.ActionUnknown0x1bPayload = (function() {
    function ActionUnknown0x1bPayload(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ActionUnknown0x1bPayload.prototype._read = function() {
      this.a = this._io.readU1();
      this.b = this._io.readU4le();
      this.c = this._io.readU4le();
    }

    return ActionUnknown0x1bPayload;
  })();
  Object.defineProperty(W3W3g.prototype, 'privPublic', {
    get: function() {
      if (this._m_privPublic !== undefined)
        return this._m_privPublic;
      this._m_privPublic = this.priv;
      return this._m_privPublic;
    }
  });

  return W3W3g;
})();
return W3W3g;
}));
