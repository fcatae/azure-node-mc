"use strict";

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _require$portal_detector = require("flying-squid").portal_detector;

var detectFrame = _require$portal_detector.detectFrame;
var generatePortal = _require$portal_detector.generatePortal;
var addPortalToWorld = _require$portal_detector.addPortalToWorld;

var Vec3 = require("vec3").Vec3;
var UserError = require("flying-squid").UserError;

module.exports.player = function (player, serv) {
  var _this2 = this;

  player.use_flint_and_steel = function callee$1$0(referencePosition, direction, position) {
    var block, _ret;

    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      var _this = this;

      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(player.world.getBlock(referencePosition));

        case 2:
          block = context$2$0.sent;

          if (!(block.name == "obsidian")) {
            context$2$0.next = 9;
            break;
          }

          context$2$0.next = 6;
          return _regeneratorRuntime.awrap((function callee$2$0() {
            var frames, air;
            return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
              while (1) switch (context$3$0.prev = context$3$0.next) {
                case 0:
                  context$3$0.next = 2;
                  return _regeneratorRuntime.awrap(detectFrame(player.world, referencePosition, direction));

                case 2:
                  frames = context$3$0.sent;

                  if (!(frames.length != 0)) {
                    context$3$0.next = 8;
                    break;
                  }

                  air = frames[0].air;

                  air.forEach(function (pos) {
                    return player.setBlock(pos, 90, frames[0].bottom[0].x - frames[0].bottom[1].x != 0 ? 1 : 2);
                  });
                  player.world.portals.push(frames[0]);
                  return context$3$0.abrupt("return", {
                    v: undefined
                  });

                case 8:
                case "end":
                  return context$3$0.stop();
              }
            }, null, _this);
          })());

        case 6:
          _ret = context$2$0.sent;

          if (!(typeof _ret === "object")) {
            context$2$0.next = 9;
            break;
          }

          return context$2$0.abrupt("return", _ret.v);

        case 9:
          player.changeBlock(position, 51, 0);

        case 10:
        case "end":
          return context$2$0.stop();
      }
    }, null, _this2);
  };

  player.on("dug", function (_ref) {
    var position = _ref.position;
    var block = _ref.block;

    function destroyPortal(portal) {
      var positionAlreadyDone = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      player.world.portals = player.world.portals.splice(player.world.portals.indexOf(portal), 1);
      portal.air.filter(function (ap) {
        return positionAlreadyDone == null || !ap.equals(positionAlreadyDone);
      }).forEach(function (ap) {
        return serv.setBlock(player.world, ap, 0, 0);
      });
    }

    if (block.name == "obsidian") {
      var p = player.world.portals.filter(function (_ref2) {
        var bottom = _ref2.bottom;
        var top = _ref2.top;
        var left = _ref2.left;
        var right = _ref2.right;
        return [].concat.apply([], [bottom, left, right, top]).reduce(function (acc, pos) {
          return acc || pos.equals(position);
        }, false);
      });
      p.forEach(function (portal) {
        return destroyPortal(portal, position);
      });
    }

    if (block.name == "portal") {
      var p = player.world.portals.filter(function (_ref3) {
        var air = _ref3.air;
        return air.reduce(function (acc, pos) {
          return acc || pos.equals(position);
        }, false);
      });
      p.forEach(function (portal) {
        return destroyPortal(portal, position);
      });
    }
  });

  player.commands.add({
    base: 'portal',
    info: 'Create a portal frame',
    usage: '/portal <bottomLeft:<x> <y> <z>> <direction:x|z> <width> <height>',
    op: true,
    parse: function parse(str) {
      var pars = str.split(' ');
      if (pars.length != 6) return false;

      var _pars = _slicedToArray(pars, 6);

      var x = _pars[0];
      var y = _pars[1];
      var z = _pars[2];
      var direction = _pars[3];
      var width = _pars[4];
      var height = _pars[5];

      var _map = [x, y, z].map(function (val, i) {
        return serv.posFromString(val, player.position[['x', 'y', 'z'][i]] / 32);
      });

      var _map2 = _slicedToArray(_map, 3);

      x = _map2[0];
      y = _map2[1];
      z = _map2[2];

      var bottomLeft = new Vec3(x, y, z);
      if (direction != "x" && direction != "z") throw new UserError('Wrong Direction');
      direction = direction == 'x' ? new Vec3(1, 0, 0) : new Vec3(0, 0, 1);
      return { bottomLeft: bottomLeft, direction: direction, width: width, height: height };
    },
    action: function action(_ref4) {
      var bottomLeft = _ref4.bottomLeft;
      var direction = _ref4.direction;
      var width = _ref4.width;
      var height = _ref4.height;
      var portal;
      return _regeneratorRuntime.async(function action$(context$2$0) {
        var _this3 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            portal = generatePortal(bottomLeft, direction, width, height);
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(addPortalToWorld(player.world, portal, [], [], function callee$2$0(pos, type) {
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    context$3$0.next = 2;
                    return _regeneratorRuntime.awrap(serv.setBlock(player.world, pos, type, 0));

                  case 2:
                  case "end":
                    return context$3$0.stop();
                }
              }, null, _this3);
            }));

          case 3:
          case "end":
            return context$2$0.stop();
        }
      }, null, this);
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/portal.js.map
