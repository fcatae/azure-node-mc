'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var Vec3 = require('vec3').Vec3;

module.exports.server = function (serv) {
  serv.playSound = function (sound, world, position) {
    var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var whitelist = _ref.whitelist;
    var _ref$blacklist = _ref.blacklist;
    var blacklist = _ref$blacklist === undefined ? [] : _ref$blacklist;
    var _ref$radius = _ref.radius;
    var radius = _ref$radius === undefined ? 32 * 32 : _ref$radius;
    var _ref$volume = _ref.volume;
    var volume = _ref$volume === undefined ? 1.0 : _ref$volume;
    var _ref$pitch = _ref.pitch;
    var pitch = _ref$pitch === undefined ? 1.0 : _ref$pitch;

    var players = typeof whitelist != 'undefined' ? typeof whitelist instanceof Array ? whitelist : [whitelist] : serv.getNearby({
      world: world,
      position: position.scaled(32).floored(),
      radius: radius // 32 blocks, fixed position
    });
    players.filter(function (player) {
      return blacklist.indexOf(player) == -1;
    }).forEach(function (player) {
      var pos = (position || player.position.scaled(1 / 32)).scaled(8).floored();
      player._client.write('named_sound_effect', {
        soundName: sound,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        volume: volume,
        pitch: Math.round(pitch * 63)
      });
    });
  };

  serv.playNoteBlock = function (pitch, world, position) {
    var _ref2 = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var _ref2$instrument = _ref2.instrument;
    var instrument = _ref2$instrument === undefined ? 'harp' : _ref2$instrument;
    var _ref2$particle = _ref2.particle;
    var particle = _ref2$particle === undefined ? true : _ref2$particle;

    if (particle) {
      serv.emitParticle(23, world, position.clone().add(new Vec3(0.5, 1.5, 0.5)), {
        count: 1,
        size: new Vec3(0, 0, 0)
      });
    }
    serv.playSound('note.' + instrument, world, position, { pitch: serv.getNote(pitch) });
  };

  serv.getNote = function (note) {
    return 0.5 * Math.pow(Math.pow(2, 1 / 12), note);
  };
};

module.exports.player = function (player, serv) {
  var _this = this;

  player.playSound = function (sound) {
    var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    opt.whitelist = player;
    serv.playSound(sound, player.world, null, opt);
  };

  player.on('placeBlock_cancel', function callee$1$0(_ref3, cancel) {
    var reference = _ref3.reference;
    var id, data;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!player.crouching) {
            context$2$0.next = 2;
            break;
          }

          return context$2$0.abrupt('return');

        case 2:
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap(player.world.getBlockType(reference));

        case 4:
          id = context$2$0.sent;

          if (!(id != 25)) {
            context$2$0.next = 7;
            break;
          }

          return context$2$0.abrupt('return');

        case 7:
          cancel(false);
          if (!player.world.blockEntityData[reference.toString()]) player.world.blockEntityData[reference.toString()] = {};
          data = player.world.blockEntityData[reference.toString()];

          if (typeof data.note == 'undefined') data.note = -1;
          data.note++;
          data.note %= 25;
          serv.playNoteBlock(data.note, player.world, reference);

        case 14:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  player.on('dig_cancel', function callee$1$0(_ref4, cancel) {
    var position = _ref4.position;
    var id, data;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(player.world.getBlockType(position));

        case 2:
          id = context$2$0.sent;

          if (!(id != 25)) {
            context$2$0.next = 5;
            break;
          }

          return context$2$0.abrupt('return');

        case 5:
          cancel(false);
          if (!player.world.blockEntityData[position.toString()]) player.world.blockEntityData[position.toString()] = {};
          data = player.world.blockEntityData[position.toString()];

          if (typeof data.note == 'undefined') data.note = 0;
          serv.playNoteBlock(data.note, player.world, position);

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  player.commands.add({
    base: 'playsound',
    info: 'to play sound for yourself',
    usage: '/playsound <sound_name> [volume] [pitch]',
    op: true,
    parse: function parse(str) {
      var results = str.match(/([^ ]+)(?: ([^ ]+))?(?: ([^ ]+))?/);
      if (!results) return false;
      return {
        sound_name: results[1],
        volume: results[2] ? parseFloat(results[2]) : 1.0,
        pitch: results[3] ? parseFloat(results[3]) : 1.0
      };
    },
    action: function action(_ref5) {
      var sound_name = _ref5.sound_name;
      var volume = _ref5.volume;
      var pitch = _ref5.pitch;

      player.chat('Playing "' + sound_name + '" (volume: ' + volume + ', pitch: ' + pitch + ')');
      player.playSound(sound_name, { volume: volume, pitch: pitch });
    }
  });

  player.commands.add({
    base: 'playsoundforall',
    info: 'to play sound for everyone',
    usage: '/playsoundforall <sound_name> [volume] [pitch]',
    op: true,
    parse: function parse(str) {
      var results = str.match(/([^ ]+)(?: ([^ ]+))?(?: ([^ ]+))?/);
      if (!results) return false;
      return {
        sound_name: results[1],
        volume: results[2] ? parseFloat(results[2]) : 1.0,
        pitch: results[3] ? parseFloat(results[3]) : 1.0
      };
    },
    action: function action(_ref6) {
      var sound_name = _ref6.sound_name;
      var volume = _ref6.volume;
      var pitch = _ref6.pitch;

      player.chat('Playing "' + sound_name + '" (volume: ' + volume + ', pitch: ' + pitch + ')');
      serv.playSound(sound_name, player.world, player.position.scaled(1 / 32), { volume: volume, pitch: pitch });
    }
  });
};

module.exports.entity = function (entity, serv) {
  entity.playSoundAtSelf = function (sound) {
    var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    serv.playSound(sound, entity.world, entity.position.scaled(1 / 32), opt);
  };
};
//# sourceMappingURL=../../maps/lib/plugins/sound.js.map
