"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var Vec3 = require("vec3").Vec3;

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

module.exports.server = function (serv, settings) {
  var _this = this;

  serv.gameMode = settings.gameMode;

  function findSpawnZone(world, initialPoint) {
    var point, p;
    return _regeneratorRuntime.async(function findSpawnZone$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          point = initialPoint;

        case 1:
          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(world.getBlockType(point));

        case 3:
          context$2$0.t0 = context$2$0.sent;

          if (!(context$2$0.t0 == 0)) {
            context$2$0.next = 8;
            break;
          }

          point = point.offset(0, -1, 0);
          context$2$0.next = 1;
          break;

        case 8:
          if (!true) {
            context$2$0.next = 17;
            break;
          }

          context$2$0.next = 11;
          return _regeneratorRuntime.awrap(world.getBlockType(point));

        case 11:
          p = context$2$0.sent;

          if (!(p != 8 && p != 9)) {
            context$2$0.next = 14;
            break;
          }

          return context$2$0.abrupt("break", 17);

        case 14:
          point = point.offset(1, 0, 0);
          context$2$0.next = 8;
          break;

        case 17:
          context$2$0.next = 19;
          return _regeneratorRuntime.awrap(world.getBlockType(point));

        case 19:
          context$2$0.t1 = context$2$0.sent;

          if (!(context$2$0.t1 != 0)) {
            context$2$0.next = 24;
            break;
          }

          point = point.offset(0, 1, 0);

          context$2$0.next = 17;
          break;

        case 24:
          return context$2$0.abrupt("return", point);

        case 25:
        case "end":
          return context$2$0.stop();
      }
    }, null, this);
  }

  serv.getSpawnPoint = function callee$1$0(world) {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(findSpawnZone(world, new Vec3(randomInt(0, 30), 81, randomInt(0, 30))));

        case 2:
          return context$2$0.abrupt("return", context$2$0.sent);

        case 3:
        case "end":
          return context$2$0.stop();
      }
    }, null, _this);
  };
};

module.exports.player = function callee$0$0(player, serv) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this2 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        player.gameMode = serv.gameMode;
        player.findSpawnPoint = function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(serv.getSpawnPoint(player.world));

              case 2:
                player.spawnPoint = context$2$0.sent;

              case 3:
              case "end":
                return context$2$0.stop();
            }
          }, null, _this2);
        };
        player._client.on('settings', function (_ref) {
          var viewDistance = _ref.viewDistance;

          player.view = viewDistance;
        });

      case 3:
      case "end":
        return context$1$0.stop();
    }
  }, null, this);
};
//# sourceMappingURL=../../maps/lib/plugins/settings.js.map
