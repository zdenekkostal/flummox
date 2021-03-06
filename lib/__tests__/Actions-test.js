'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Flux = require('../Flux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Actions', function () {
  var TestActions = (function (_Actions) {
    function TestActions() {
      _classCallCheck(this, TestActions);

      if (_Actions != null) {
        _Actions.apply(this, arguments);
      }
    }

    _inherits(TestActions, _Actions);

    TestActions.prototype.getFoo = function getFoo() {
      return { foo: 'bar' };
    };

    TestActions.prototype.getBar = function getBar() {
      return { bar: 'baz' };
    };

    TestActions.prototype.getBaz = function getBaz() {
      return;
    };

    TestActions.prototype.asyncAction = function asyncAction(returnValue) {
      return regeneratorRuntime.async(function asyncAction$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            return context$3$0.abrupt('return', returnValue);

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    };

    TestActions.prototype.badAsyncAction = function badAsyncAction() {
      return Promise.reject(new Error('some error'));
    };

    return TestActions;
  })(_Flux.Actions);

  describe('#getActionIds / #getConstants', function () {
    it('returns strings corresponding to action method names', function () {
      var actions = new TestActions();

      var actionIds = actions.getActionIds();

      expect(actionIds.getFoo).to.be.a('string');
      expect(actionIds.getBar).to.be.a('string');

      expect(actionIds.getFoo).to.be.a('string');
      expect(actionIds.getBar).to.be.a('string');
    });
  });

  describe('#getActionsAsObject', function () {
    it('returns actions as plain object', function () {
      var actions = new TestActions();

      expect(actions.getActionsAsObject()).to.deep.equal({
        getFoo: actions.getFoo,
        getBar: actions.getBar,
        getBaz: actions.getBaz,
        asyncAction: actions.asyncAction,
        badAsyncAction: actions.badAsyncAction
      });
    });
  });

  describe('#[methodName]', function () {
    it('calls Flux dispatcher', function () {
      var actions = new TestActions();

      // Attach mock flux instance
      var dispatch = _sinon2['default'].spy();
      actions.dispatch = dispatch;

      actions.getFoo();
      expect(dispatch.firstCall.args[1]).to.deep.equal({ foo: 'bar' });
    });

    it('sends return value to Flux dispatch', function () {
      var actions = new TestActions();
      var actionId = actions.getActionIds().getFoo;
      var dispatch = _sinon2['default'].spy();
      actions.dispatch = dispatch;

      actions.getFoo();

      expect(dispatch.firstCall.args[0]).to.equal(actionId);
      expect(dispatch.firstCall.args[1]).to.deep.equal({ foo: 'bar' });
    });

    it('send async return value to Flux#dispatchAsync', function callee$2$0() {
      var actions, actionId, dispatch, response;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            actions = new TestActions();
            actionId = actions.getActionIds().asyncAction;
            dispatch = _sinon2['default'].stub().returns(Promise.resolve());

            actions.dispatchAsync = dispatch;

            response = actions.asyncAction('foobar');

            expect(response.then).to.be.a('function');

            context$3$0.next = 8;
            return response;

          case 8:

            expect(dispatch.firstCall.args[0]).to.equal(actionId);
            expect(dispatch.firstCall.args[1]).to.be.an.instanceOf(Promise);

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('skips disptach if return value is undefined', function () {
      var actions = new TestActions();
      var dispatch = _sinon2['default'].spy();
      actions.dispatch = dispatch;

      actions.getBaz();

      expect(dispatch.called).to.be['false'];
    });

    it('does not skip async dispatch, even if resolved value is undefined', function () {
      var actions = new TestActions();
      var dispatch = _sinon2['default'].stub().returns(Promise.resolve(undefined));
      actions.dispatchAsync = dispatch;

      actions.asyncAction();

      expect(dispatch.called).to.be['true'];
    });

    it('returns value from wrapped action', function callee$2$0() {
      var flux, actions;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux.Flux();
            actions = flux.createActions('test', TestActions);

            expect(actions.getFoo()).to.deep.equal({ foo: 'bar' });
            context$3$0.next = 5;
            return expect(actions.asyncAction('async result')).to.eventually.equal('async result');

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });
});