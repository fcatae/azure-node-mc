'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var Command = (function () {
  function Command(params, parent, hash) {
    _classCallCheck(this, Command);

    this.params = params;
    this.parent = parent;
    this.hash = parent ? parent.hash : {};
    this.uniqueHash = parent ? parent.uniqueHash : {};
    this.parentBase = this.parent && this.parent.base && this.parent.base + ' ' || '';
    this.base = this.parentBase + (this.params.base || '');

    if (this.params.base) this.updateHistory();
  }

  _createClass(Command, [{
    key: 'find',
    value: function find(command) {
      var parts = command.split(" ");
      var c = parts.shift();
      var pars = parts.join(" ");
      if (this.hash[c]) return [this.hash[c], pars];
      return undefined;
    }
  }, {
    key: 'use',
    value: function use(command) {
      var op = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var res, _res, _res2, com, pars, parse;

      return _regeneratorRuntime.async(function use$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            res = this.find(command);

            if (!res) {
              context$2$0.next = 24;
              break;
            }

            _res = res;
            _res2 = _slicedToArray(_res, 2);
            com = _res2[0];
            pars = _res2[1];

            if (!(com.params.op && !op)) {
              context$2$0.next = 8;
              break;
            }

            return context$2$0.abrupt('return', 'You do not have permission to use this command');

          case 8:
            parse = com.params.parse;

            if (!parse) {
              context$2$0.next = 17;
              break;
            }

            if (!(typeof parse == 'function')) {
              context$2$0.next = 16;
              break;
            }

            pars = parse(pars);

            if (!(pars === false)) {
              context$2$0.next = 14;
              break;
            }

            return context$2$0.abrupt('return', com.params.usage ? 'Usage: ' + com.params.usage : 'Bad syntax');

          case 14:
            context$2$0.next = 17;
            break;

          case 16:
            pars = pars.match(parse);

          case 17:
            context$2$0.next = 19;
            return _regeneratorRuntime.awrap(com.params.action(pars));

          case 19:
            res = context$2$0.sent;

            if (!res) {
              context$2$0.next = 22;
              break;
            }

            return context$2$0.abrupt('return', '' + res);

          case 22:
            context$2$0.next = 25;
            break;

          case 24:
            return context$2$0.abrupt('return', 'Command not found');

          case 25:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'updateHistory',
    value: function updateHistory() {
      var _this = this;

      var all = '(.+?)';

      var list = [this.base];
      if (this.params.aliases && this.params.aliases.length) {
        this.params.aliases.forEach(function (al) {
          return list.unshift(_this.parentBase + al);
        });
      }

      list.forEach(function (command) {
        var parentBase = _this.parent ? _this.parent.path || '' : '';
        _this.path = parentBase + _this.space() + (command || all);
        if (_this.path == all && !_this.parent) _this.path = '';

        if (_this.path) _this.hash[_this.path] = _this;
      });
      this.uniqueHash[this.base] = this;
    }
  }, {
    key: 'add',
    value: function add(params) {
      return new Command(params, this);
    }
  }, {
    key: 'space',
    value: function space(end) {
      var first = !(this.parent && this.parent.parent);
      return this.params.merged || !end && first ? '' : ' ';
    }
  }, {
    key: 'setOp',
    value: function setOp(op) {
      this.params.op = op;
    }
  }]);

  return Command;
})();

module.exports = Command;
//# sourceMappingURL=../maps/lib/command.js.map
