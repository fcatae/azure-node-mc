'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

module.exports.server = function (serv, settings) {
  serv.plugins = {};
  serv.pluginCount = 0;
  serv.externalPluginsLoaded = false;

  serv.addPlugin = function (name, plugin, set) {
    if (!name || !plugin) throw new Error('You need a name and object for your plugin!');
    serv.plugins[name] = {
      id: serv.pluginCount,
      name: name,
      player: plugin.player,
      entity: plugin.entity,
      server: plugin.server,
      settings: set,
      enabled: true
    };
    serv.pluginCount++;
    if (serv.externalPluginsLoaded && plugin.server) serv.plugins[name].server.call(p, serv, settings);
  };

  _Object$keys(settings.plugins).forEach(function (p) {
    if (settings.plugins[p].disabled) return;
    try {
      require.resolve(p); // Check if it exists, if not do catch, otherwise jump to bottom
    } catch (err) {
      try {
        // Throw error if cannot find plugin       
        require.resolve('../../plugins/' + p);
      } catch (err) {
        throw new Error('Cannot find plugin "' + p + '"');
      }
      serv.addPlugin(p, require('../../plugins/' + p), settings.plugins[p]);
      return;
    }
    serv.addPlugin(p, require(p), settings.plugins[p]);
  });

  _Object$keys(serv.plugins).forEach(function (p) {
    if (serv.plugins[p].server) serv.plugins[p].server.call(serv.plugins[p], serv, settings);
  });

  serv.on('asap', function () {
    _Object$keys(serv.plugins).map(function (p) {
      return serv.log('[PLUGINS] Loaded "' + serv.plugins[p].name + '"');
    });
  });

  serv.externalPluginsLoaded = true;
};

module.exports.player = function (player, serv) {
  _Object$keys(serv.plugins).forEach(function (p) {
    var plugin = serv.plugins[p];
    if (plugin.player) plugin.player.call(plugin, player, serv);
  });
};

module.exports.entity = function (entity, serv) {
  entity.pluginData = {};

  _Object$keys(serv.plugins).forEach(function (p) {
    entity.pluginData[p] = {};
  });

  entity.getData = function (pluginName) {
    if (typeof pluginName == 'object') pluginName = pluginName.name;
    return entity.pluginData[pluginName] || null;
  };

  _Object$keys(serv.plugins).forEach(function (p) {
    var plugin = serv.plugins[p];
    if (plugin.entity) plugin.entity.call(plugin, entity, serv);
  });
};
//# sourceMappingURL=../../maps/lib/plugins/external.js.map
