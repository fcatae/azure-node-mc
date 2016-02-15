"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var Vec3 = require("vec3").Vec3;

module.exports.player = function (player) {
  var _this = this;

  player.on('placeBlock_cancel', function callee$1$0(opt, cancel) {
    var id, blockAbove;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!player.crouching) {
            context$2$0.next = 2;
            break;
          }

          return context$2$0.abrupt("return");

        case 2:
          context$2$0.prev = 2;
          context$2$0.next = 5;
          return _regeneratorRuntime.awrap(player.world.getBlockType(opt.reference));

        case 5:
          id = context$2$0.sent;
          context$2$0.next = 8;
          return _regeneratorRuntime.awrap(player.world.getBlockType(opt.reference.plus(new Vec3(0, 1, 0))));

        case 8:
          blockAbove = context$2$0.sent;

          if (!(id == 54)) {
            context$2$0.next = 15;
            break;
          }

          opt.playSound = false;

          if (!blockAbove) {
            context$2$0.next = 13;
            break;
          }

          return context$2$0.abrupt("return");

        case 13:
          player._client.write("open_window", {
            windowId: 165,
            inventoryType: "minecraft:chest",
            windowTitle: JSON.stringify("Chest"),
            slotCount: 9 * 3 + 8 // 3 rows, make nicer later
          });
          cancel();

        case 15:
          context$2$0.next = 20;
          break;

        case 17:
          context$2$0.prev = 17;
          context$2$0.t0 = context$2$0["catch"](2);

          setTimeout(function () {
            throw context$2$0.t0;
          }, 0);

        case 20:
        case "end":
          return context$2$0.stop();
      }
    }, null, _this, [[2, 17]]);
  });
};
//# sourceMappingURL=../../maps/lib/plugins/chest.js.map
