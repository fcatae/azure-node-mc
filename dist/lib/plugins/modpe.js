"use strict";

var Vec3 = require("vec3").Vec3;
var dir = require("node-dir");
var fs = require("fs");

function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

function modpeApi() {
  var Vec3 = null;
  var vec3 = null;

  var server = null;
  var player = null;

  module.exports.startDestroyBlock = startDestroyBlock;
  module.exports.destroyBlock = destroyBlock;
  module.exports.newLevel = newLevel;
  module.exports.procCmd = procCmd;
  module.exports.exec = exec;
  module.exports.modTick = modTick;
  module.exports.useItem = useItem;
  module.exports.initSquid = initSquid;
  function modTick() {}
  function newLevel() {}

  function useItem(x, y, z, itemId, blockId) {}
  function startDestroyBlock(x, y, z, side) {}
  function destroyBlock(x, y, z, side) {}
  function procCmd(command) {}
  function exec(code) {
    eval(code);
  }

  function initSquid(pl1, srv, v3) {
    player = pl1;
    server = srv;
    vec3 = v3;
    Vec3 = v3;
  }

  function clientMessage(message) {
    player.chat(message);
  }

  function setTile(x, y, z, id, damage) {
    server.setBlock(server.overworld, new Vec3(x, y, z), id, damage);
  }

  function getTile(x, y, z) {
    return server._worldSync.getBlockType(new Vec3(x, y, z));
  }

  function preventDefault() {}

  function getPlayerX() {
    return player.position.x / 32;
  }

  function getPlayerY() {
    return player.position.y / 32;
  }

  function getPlayerZ() {
    return player.position.z / 32;
  }

  function getPlayerEnt() {
    return null;
  }

  function getCarriedItem() {
    return player.heldItem.blockId;
  }

  var Player = {
    getCarriedItem: function getCarriedItem() {
      return player.heldItem.blockId;
    }
  };
  var Entity = {
    getPitch: function getPitch() {
      return 1;
    },
    getYaw: function getYaw() {
      return 1;
    }
  };
  var Level = {
    getGameMode: function getGameMode() {
      return player.gameMode;
    },
    getData: function getData(x, y, z) {
      return 0;
    }
  };
}

function convert(code) {
  var api = modpeApi.toString().split("\n");
  api[0] = "";
  api[api.length - 1] = "";
  var finapi = api.join("\n");
  code = finapi + code;
  return code;
}

module.exports.server = function (serv, settings) {
  var verboseMPE = false;
  function log(msg) {
    if (verboseMPE) serv.log("[MPE]:  " + msg);
  }
  if (!settings.modpe) {
    log("Modpe support is not enabled, disabling injecting...");
    return;
  }
  log("Modpe injection start...");
  var modPePluginsDir = __dirname + "/../../../modpePlugins";
  log("Place your scripts in " + modPePluginsDir);
  var modCount = 0;
  var mods = [];
  dir.readFiles(modPePluginsDir, {
    match: /.js/,
    exclude: /^\./
  }, function (err, content, fname, next) {
    if (err) throw err;
    log("Converting " + fname);
    content = convert(content);
    var modname = fname.split("/")[fname.split("/").length - 1].split(".")[0];
    log("Loading mod " + modname);
    mods.push(requireFromString(content));
    modCount++;
    next();
  }, function (err, files) {
    if (err) return;
    log('Loaded ' + modCount + " mods");
  });

  serv.on("newPlayer", function (player) {
    injectPlayer(player, serv);
  });

  function injectPlayer(player, serv) {
    log("Injected into player");

    initSquid(player, serv, Vec3);
    newLevel();

    player._client.on("block_dig", function (packet) {
      var pos = new Vec3(packet.location.x, packet.location.y, packet.location.z);
      if (packet.status == 0 && player.gameMode != 1) startDestroyBlock(pos.x, pos.y, pos.z, 0);else if (packet.status == 2) destroyBlock(pos.x, pos.y, pos.z, 0);else if (packet.status == 1) {/*Unused in ModPE*/} else if (packet.status == 0 && player.gameMode == 1) destroyBlock(pos.x, pos.y, pos.z, 0);
    });

    player._client.on('position', function (packet) {
      modTick();
    });

    player._client.on("block_place", function (packet) {
      if (packet.location.y < 0) return;
      useItem(packet.location.x, packet.location.y, packet.location.z, packet.heldItem.blockId, serv._worldSync.getBlockType(new Vec3(packet.location.x, packet.location.y, packet.location.z)));
    });

    player.on('modpe', function (command) {
      try {
        procCmd(command);
      } catch (err) {
        serv.emit("error", err);
      }
    });

    function newLevel() {
      mods.forEach(function (element, index, array) {
        element.newLevel();
      });
    }

    function useItem(x, y, z, itemId, blockId) {
      mods.forEach(function (element, index, array) {
        element.useItem(x, y, z, itemId, blockId);
        element.exec("lastUsedItem=" + itemId);
      });
    }

    function modTick() {
      mods.forEach(function (element, index, array) {
        element.modTick();
      });
    }

    function exec(code) {
      mods.forEach(function (element, index, array) {
        element.exec(code);
      });
    }

    function procCmd(command) {
      mods.forEach(function (element, index, array) {
        element.procCmd(command);
      });
    }

    function startDestroyBlock(x, y, z, side) {
      mods.forEach(function (element, index, array) {
        element.startDestroyBlock(x, y, z, side);
      });
    }

    function destroyBlock(x, y, z, side) {
      mods.forEach(function (element, index, array) {
        element.destroyBlock(x, y, z, side);
      });
    }

    function initSquid(pl, sr, v3) {
      mods.forEach(function (element, index, array) {
        element.initSquid(pl, sr, v3);
      });
    }
  }
};
//# sourceMappingURL=../../maps/lib/plugins/modpe.js.map
