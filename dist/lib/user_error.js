"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var ExtendableError = (function (_Error) {
  _inherits(ExtendableError, _Error);

  function ExtendableError(message) {
    _classCallCheck(this, ExtendableError);

    _get(Object.getPrototypeOf(ExtendableError.prototype), "constructor", this).call(this, message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }

  return ExtendableError;
})(Error);

var UserError = (function (_ExtendableError) {
  _inherits(UserError, _ExtendableError);

  function UserError(message) {
    _classCallCheck(this, UserError);

    _get(Object.getPrototypeOf(UserError.prototype), "constructor", this).call(this, message);
  }

  return UserError;
})(ExtendableError);

module.exports = UserError;
//# sourceMappingURL=../maps/lib/user_error.js.map
