'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _this = this;

module.exports = function (obj) {
  return function callee$1$0(eventName, data, func, cancelFunc) {
    var hiddenCancelled, cancelled, cancelCount, defaultCancel, cancel, resp;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          hiddenCancelled = false;
          cancelled = false;
          cancelCount = 0;
          defaultCancel = true;

          cancel = function cancel() {
            var dC = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
            var hidden = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            // Hidden shouldn't be used often but it's not hard to implement so meh
            if (hidden) hiddenCancelled = true;else {
              cancelled = true;
              cancelCount++;
            }
            defaultCancel = dC;
          };

          resp = undefined;
          context$2$0.next = 8;
          return _regeneratorRuntime.awrap(obj.emitThen(eventName + '_cancel', data, cancel)['catch'](function (err) {
            return setTimeout(function () {
              throw err;
            }, 0);
          }));

        case 8:
          context$2$0.next = 10;
          return _regeneratorRuntime.awrap(obj.emitThen(eventName, data, cancelled, cancelCount)['catch'](function (err) {
            return setTimeout(function () {
              throw err;
            }, 0);
          }));

        case 10:
          if (!(!hiddenCancelled && !cancelled)) {
            context$2$0.next = 19;
            break;
          }

          resp = func(data);

          if (!(resp instanceof _Promise)) {
            context$2$0.next = 16;
            break;
          }

          context$2$0.next = 15;
          return _regeneratorRuntime.awrap(resp['catch'](function (err) {
            return setTimeout(function () {
              throw err;
            }, 0);
          }));

        case 15:
          resp = context$2$0.sent;

        case 16:
          if (typeof resp == 'undefined') resp = true;
          context$2$0.next = 26;
          break;

        case 19:
          if (!(cancelFunc && defaultCancel)) {
            context$2$0.next = 26;
            break;
          }

          resp = cancelFunc(data);

          if (!(resp instanceof _Promise)) {
            context$2$0.next = 25;
            break;
          }

          context$2$0.next = 24;
          return _regeneratorRuntime.awrap(resp['catch'](function (err) {
            return setTimeout(function () {
              throw err;
            }, 0);
          }));

        case 24:
          resp = context$2$0.sent;

        case 25:
          if (typeof resp == 'undefined') resp = false;

        case 26:
          context$2$0.next = 28;
          return _regeneratorRuntime.awrap(obj.emitThen(eventName + '_done', data, cancelled)['catch'](function (err) {
            return setTimeout(function () {
              throw err;
            }, 0);
          }));

        case 28:
          return context$2$0.abrupt('return', resp);

        case 29:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  };
};
//# sourceMappingURL=../maps/lib/behavior.js.map
