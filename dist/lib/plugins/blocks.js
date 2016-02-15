"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var Vec3 = require("vec3").Vec3;

module.exports.player = function (player, serv) {
  var _this = this;

  player.changeBlock = function callee$1$0(position, blockType, blockData) {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          serv.players.filter(function (p) {
            return p.world == player.world && player != p;
          }).forEach(function (p) {
            return p.sendBlock(position, blockType, blockData);
          });

          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(player.world.setBlockType(position, blockType));

        case 3:
          context$2$0.next = 5;
          return _regeneratorRuntime.awrap(player.world.setBlockData(position, blockData));

        case 5:
        case "end":
          return context$2$0.stop();
      }
    }, null, _this);
  };

  player.sendBlock = function (position, blockType, blockData) {
    return (// Call from player.setBlock unless you want "local" fake blocks
      player.behavior('sendBlock', {
        position: position,
        blockType: blockType,
        blockData: blockData
      }, function (_ref) {
        var position = _ref.position;
        var blockType = _ref.blockType;
        var blockData = _ref.blockData;

        player._client.write("block_change", {
          location: position,
          type: blockType << 4 | blockData
        });
      })
    );
  };

  player.setBlock = function (position, blockType, blockData) {
    return serv.setBlock(player.world, position, blockType, blockData);
  };

  player.commands.add({
    base: 'setblock',
    info: 'set a block at a position',
    usage: '/setblock <x> <y> <z> <id> [data]',
    op: true,
    parse: function parse(str) {
      var results = str.match(/^(~|~?-?[0-9]+) (~|~?-?[0-9]+) (~|~?-?[0-9]+) ([0-9]{1,3})(?: ([0-9]{1,3}))?/);
      if (!results) return false;
      return results;
    },
    action: function action(params) {
      var res = params.slice(1, 4);
      res = res.map(function (val, i) {
        return serv.posFromString(val, player.position[['x', 'y', 'z'][i]] / 32);
      });
      player.setBlock(new Vec3(res[0], res[1], res[2]).floored(), params[4], params[5] || 0);
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/blocks.js.map
