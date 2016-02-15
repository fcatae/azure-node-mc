'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var mc = require('minecraft-protocol');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var requireIndex = require('requireindex');
require('emit-then').register();
if (process.env.NODE_ENV === 'dev') {
  require('longjohn');
}

module.exports = {
  createMCServer: createMCServer,
  Behavior: require("./lib/behavior"),
  Command: require("./lib/command"),
  version: require("./lib/version"),
  generations: require("./lib/generations"),
  experience: require("./lib/experience"),
  UserError: require("./lib/user_error"),
  portal_detector: require('./lib/portal_detector')
};

function createMCServer(options) {
  options = options || {};
  var mcServer = new MCServer();
  mcServer.connect(options);
  return mcServer;
}

var MCServer = (function (_EventEmitter) {
  _inherits(MCServer, _EventEmitter);

  function MCServer() {
    _classCallCheck(this, MCServer);

    _get(Object.getPrototypeOf(MCServer.prototype), 'constructor', this).call(this);
    this._server = null;
  }

  _createClass(MCServer, [{
    key: 'connect',
    value: function connect(options) {
      var _this = this;

      var plugins = requireIndex(path.join(__dirname, 'lib', 'plugins'));
      this._server = mc.createServer(options);
      _Object$keys(plugins).filter(function (pluginName) {
        return plugins[pluginName].server != undefined;
      }).forEach(function (pluginName) {
        return plugins[pluginName].server(_this, options);
      });
      if (options.logging == true) this.createLog();
      this._server.on('error', function (error) {
        return _this.emit('error', error);
      });
      this._server.on('listening', function () {
        return _this.emit('listening', _this._server.socketServer.address().port);
      });
      this.emit('asap');

      //process.on('unhandledRejection', err => this.emit('error',err));
      // TODO better catch all promises: using this make it impossible to run 2 servers in one process
    }
  }]);

  return MCServer;
})(EventEmitter);
//# sourceMappingURL=maps/index.js.map
