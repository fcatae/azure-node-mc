'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var net = require('net');
var mcServer = require("flying-squid");
var settings = require('../config/default-settings');
var mineflayer = require("mineflayer");
var assert = require('chai').assert;
var Vec3 = require('vec3').Vec3;

function assertPosEqual(actual, expected) {
  assert.isBelow(actual.distanceTo(expected), 1, "expected: " + expected + ", actual: " + actual + "\n");
}
var once = require('event-promise');

describe("Server with mineflayer connection", function () {
  var _this = this;

  this.timeout(10 * 60 * 1000);
  var bot = undefined;
  var bot2 = undefined;
  var serv = undefined;

  function onGround(bot) {
    return _regeneratorRuntime.async(function onGround$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(new _Promise(function (cb) {
            var l = function l() {
              if (bot.entity.onGround) {
                bot.removeListener("move", l);
                cb();
              }
            };
            bot.on("move", l);
          }));

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }

  function waitMessage(bot, message) {
    var msg1;
    return _regeneratorRuntime.async(function waitMessage$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(once(bot, 'message'));

        case 2:
          msg1 = context$2$0.sent;

          assert.equal(msg1.extra[0].text, message);

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }

  function waitMessages(bot, messages) {
    var toReceive, received;
    return _regeneratorRuntime.async(function waitMessages$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          toReceive = messages.reduce(function (acc, message) {
            acc[message] = 1;
            return acc;
          }, {});
          received = {};
          return context$2$0.abrupt('return', new _Promise(function (cb) {
            var listener = function listener(msg) {
              var message = msg.extra[0].text;
              if (!toReceive[message]) throw new Error("Received " + message + " , expected to receive one of " + messages);
              if (received[message]) throw new Error("Received " + message + " two times");
              received[message] = 1;
              if (_Object$keys(received).length == messages.length) {
                bot.removeListener('message', listener);
                cb();
              }
            };
            bot.on('message', listener);
          }));

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }

  function waitLoginMessage(bot) {
    return _regeneratorRuntime.async(function waitLoginMessage$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          return context$2$0.abrupt('return', _Promise.all([waitMessages(bot, ['bot joined the game.', 'bot2 joined the game.'])]));

        case 1:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }

  beforeEach(function callee$1$0() {
    var options;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          this.timeout(10 * 60 * 1000);
          options = settings;

          options["online-mode"] = false;
          options["port"] = 25566;
          options["view-distance"] = 2;
          options["worldFolder"] = undefined;

          serv = mcServer.createMCServer(options);

          context$2$0.next = 9;
          return _regeneratorRuntime.awrap(once(serv, "listening"));

        case 9:
          bot = mineflayer.createBot({
            host: "localhost",
            port: 25566,
            username: "bot"
          });
          bot2 = mineflayer.createBot({
            host: "localhost",
            port: 25566,
            username: "bot2"
          });

          context$2$0.next = 13;
          return _regeneratorRuntime.awrap(_Promise.all([once(bot, 'login'), once(bot2, 'login')]));

        case 13:
          bot.entity.onGround = false;
          bot2.entity.onGround = false;

        case 15:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });

  afterEach(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(serv.quit());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  describe("actions", function () {

    function waitSpawnZone(bot, view) {
      var nbChunksExpected = view * 2 * (view * 2);
      var c = 0;
      return new _Promise(function (cb) {
        var listener = function listener() {
          c++;
          if (c == nbChunksExpected) {
            bot.removeListener('chunkColumnLoad', listener);
            cb();
          }
        };
        bot.on('chunkColumnLoad', listener);
      });
    }

    it("can dig", function callee$2$0() {
      var pos, _ref, _ref2, newBlock;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            this.timeout(10 * 60 * 1000);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_Promise.all([waitSpawnZone(bot, 2), waitSpawnZone(bot2, 2), onGround(bot), onGround(bot2)]));

          case 3:
            pos = bot.entity.position.offset(0, -1, 0).floored();

            bot.dig(bot.blockAt(pos));

            context$3$0.next = 7;
            return _regeneratorRuntime.awrap(once(bot2, 'blockUpdate', { array: true }));

          case 7:
            _ref = context$3$0.sent;
            _ref2 = _slicedToArray(_ref, 2);
            newBlock = _ref2[1];

            assertPosEqual(newBlock.position, pos);
            assert.equal(newBlock.type, 0, "block " + pos + " should have been dug");

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("can place a block", function callee$2$0() {
      var pos, _ref3, _ref32, oldBlock, newBlock, _ref4, _ref42;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            this.timeout(10 * 60 * 1000);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_Promise.all([waitSpawnZone(bot, 2), waitSpawnZone(bot2, 2), onGround(bot), onGround(bot2)]));

          case 3:
            pos = bot.entity.position.offset(0, -2, 0).floored();

            bot.dig(bot.blockAt(pos));

            context$3$0.next = 7;
            return _regeneratorRuntime.awrap(once(bot2, 'blockUpdate', { array: true }));

          case 7:
            _ref3 = context$3$0.sent;
            _ref32 = _slicedToArray(_ref3, 2);
            oldBlock = _ref32[0];
            newBlock = _ref32[1];

            assertPosEqual(newBlock.position, pos);
            assert.equal(newBlock.type, 0, "block " + pos + " should have been dug");

            bot.creative.setInventorySlot(36, new mineflayer.Item(1, 1));
            context$3$0.next = 16;
            return _regeneratorRuntime.awrap(new _Promise(function (cb) {
              bot.inventory.on("windowUpdate", function (slot, oldItem, newItem) {
                if (slot == 36 && newItem && newItem.type == 1) cb();
              });
            }));

          case 16:

            bot.placeBlock(bot.blockAt(pos.offset(0, -1, 0)), new Vec3(0, 1, 0));

            context$3$0.next = 19;
            return _regeneratorRuntime.awrap(once(bot2, 'blockUpdate', { array: true }));

          case 19:
            _ref4 = context$3$0.sent;
            _ref42 = _slicedToArray(_ref4, 2);
            oldBlock = _ref42[0];
            newBlock = _ref42[1];

            assertPosEqual(newBlock.position, pos);
            assert.equal(newBlock.type, 1, "block " + pos + " should have been placed");

          case 25:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });

  describe("commands", function () {

    it("has an help command", function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(waitLoginMessage(bot));

          case 2:
            bot.chat("/help");
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(once(bot, "message"));

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it("can use /particle", function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            bot.chat("/particle 5 10 100 100 100");
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(once(bot._client, 'world_particles'));

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it("can use /playsound", function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            bot.chat('/playsound ambient.weather.rain');
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(once(bot, 'soundEffectHeard'));

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    function waitDragon() {
      return new _Promise(function (done) {
        var listener = function listener(entity) {
          if (entity.name == "EnderDragon") {
            bot.removeListener('entitySpawn', listener);
            done();
          }
        };
        bot.on('entitySpawn', listener);
      });
    }

    it("can use /summon", function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            bot.chat('/summon EnderDragon');
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(waitDragon());

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it("can use /kill", function callee$2$0() {
      var entity;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            bot.chat('/summon EnderDragon');
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(waitDragon());

          case 3:
            bot.chat('/kill @e[type=EnderDragon]');
            context$3$0.next = 6;
            return _regeneratorRuntime.awrap(once(bot, 'entityDead'));

          case 6:
            entity = context$3$0.sent;

            assert.equal(entity.name, "EnderDragon");

          case 8:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    describe("can use /tp", function () {
      it("can tp myself", function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              bot.chat('/tp 2 3 4');
              context$4$0.next = 3;
              return _regeneratorRuntime.awrap(once(bot, 'forcedMove'));

            case 3:
              assertPosEqual(bot.entity.position, new Vec3(2, 3, 4));

            case 4:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it("can tp somebody else", function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              bot.chat('/tp bot2 2 3 4');
              context$4$0.next = 3;
              return _regeneratorRuntime.awrap(once(bot2, 'forcedMove'));

            case 3:
              assertPosEqual(bot2.entity.position, new Vec3(2, 3, 4));

            case 4:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it("can tp to somebody else", function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(onGround(bot));

            case 2:
              bot.chat('/tp bot2 bot');
              context$4$0.next = 5;
              return _regeneratorRuntime.awrap(once(bot2, 'forcedMove'));

            case 5:
              assertPosEqual(bot2.entity.position, bot.entity.position);

            case 6:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it("can tp with relative positions", function callee$3$0() {
        var initialPosition;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(onGround(bot));

            case 2:
              initialPosition = bot.entity.position.clone();

              bot.chat('/tp ~1 ~-2 ~3');
              context$4$0.next = 6;
              return _regeneratorRuntime.awrap(once(bot, 'forcedMove'));

            case 6:
              assertPosEqual(bot.entity.position, initialPosition.offset(1, -2, 3));

            case 7:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it("can tp somebody else with relative positions", function callee$3$0() {
        var initialPosition;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(_Promise.all([onGround(bot), onGround(bot2)]));

            case 2:
              initialPosition = bot2.entity.position.clone();

              bot.chat('/tp bot2 ~1 ~-2 ~3');
              context$4$0.next = 6;
              return _regeneratorRuntime.awrap(once(bot2, 'forcedMove'));

            case 6:
              assertPosEqual(bot2.entity.position, initialPosition.offset(1, -2, 3));

            case 7:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
    it("can use /deop", function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(waitLoginMessage(bot));

          case 2:
            bot.chat('/deop bot');
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(waitMessage(bot, 'bot is deopped'));

          case 5:
            bot.chat('/op bot');
            context$3$0.next = 8;
            return _regeneratorRuntime.awrap(waitMessage(bot, 'You do not have permission to use this command'));

          case 8:
            serv.getPlayer("bot").op = true;

          case 9:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it("can use /setblock", function callee$2$0() {
      var _ref5, _ref52, newBlock;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(once(bot, 'chunkColumnLoad'));

          case 2:
            bot.chat('/setblock 1 2 3 95 0');
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(once(bot, 'blockUpdate:' + new Vec3(1, 2, 3), { array: true }));

          case 5:
            _ref5 = context$3$0.sent;
            _ref52 = _slicedToArray(_ref5, 2);
            newBlock = _ref52[1];

            assert.equal(newBlock.type, 95);

          case 9:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it("can use /xp", function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            bot.chat('/xp 100');
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(once(bot, "experience"));

          case 3:
            assert.equal(bot.experience.points, 100);

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });
});
//# sourceMappingURL=maps/mineflayer.js.map
