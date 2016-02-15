"use strict";

module.exports.player = function (player, serv, settings) {
  player.playerlistUpdateText = function (header, footer) {
    return player._client.write('playerlist_header', {
      header: JSON.stringify(header),
      footer: JSON.stringify(footer)
    });
  };

  player.playerlistUpdateText(settings["player-list-text"]["header"], settings["player-list-text"]["footer"]);
};
//# sourceMappingURL=../../maps/lib/plugins/header.js.map
