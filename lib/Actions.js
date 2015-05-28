/**
 * Actions
 *
 * Instances of the Actions class represent a set of actions. (In Flux parlance,
 * these might be more accurately denoted as Action Creators, while Action
 * refers to the payload sent to the dispatcher, but this is... confusing. We
 * will use Action to mean the function you call to trigger a dispatch.)
 *
 * Create actions by extending from the base Actions class and adding methods.
 * All methods on the prototype (except the constructor) will be
 * converted into actions. The return value of an action is used as the body
 * of the payload sent to the dispatcher.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _uniqueid = require('uniqueid');

var _uniqueid2 = _interopRequireDefault(_uniqueid);

var Actions = (function () {
  function Actions() {
    _classCallCheck(this, Actions);

    this._baseId = (0, _uniqueid2['default'])();

    var methodNames = this._getActionMethodNames();
    for (var i = 0; i < methodNames.length; i++) {
      var methodName = methodNames[i];
      this._wrapAction(methodName);
    }

    this.getConstants = this.getActionIds;
  }

  Actions.prototype.getActionIds = function getActionIds() {
    var _this = this;

    return this._getActionMethodNames().reduce(function (result, actionName) {
      result[actionName] = _this[actionName]._id;
      return result;
    }, {});
  };

  Actions.prototype.getActionsAsObject = function getActionsAsObject() {
    var _this2 = this;

    return this._getActionMethodNames().reduce(function (result, actionName) {
      result[actionName] = _this2[actionName];
      return result;
    }, {});
  };

  Actions.prototype._getActionMethodNames = function _getActionMethodNames(instance) {
    var _this3 = this;

    return Object.getOwnPropertyNames(this.constructor.prototype).filter(function (name) {
      return name !== 'constructor' && typeof _this3[name] === 'function';
    });
  };

  Actions.prototype._wrapAction = function _wrapAction(methodName) {
    var _this4 = this;

    var originalMethod = this[methodName];
    var actionId = this._createActionId(methodName);

    var action = function action() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var body = originalMethod.apply(_this4, args);

      var payload = {
        actionArgs: args
      };

      if (isPromise(body)) {
        var promise = body;
        _this4.dispatchAsync(actionId, promise, payload);
      } else {
        if (typeof body !== 'undefined') {
          _this4.dispatch(actionId, body, payload);
        }
      }

      // Return original method's return value to caller
      return body;
    };

    action._id = actionId;

    this[methodName] = action;
  };

  /**
   * Create unique string constant for an action method, using
   * @param {string} methodName - Name of the action method
   */

  Actions.prototype._createActionId = function _createActionId(methodName) {
    return '' + this._baseId + '-' + methodName;
  };

  return Actions;
})();

exports['default'] = Actions;

function isPromise(value) {
  return value && typeof value.then === 'function';
}
module.exports = exports['default'];