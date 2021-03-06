'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Flux = require('../Flux');

describe('Examples:', function () {

  /**
   * A simple Flummox example
   */
  describe('Messages', function () {

    /**
     * To create some actions, create a new class that extends from the base
     * Actions class. Methods on the class's prototype will be converted into
     * actions, each with its own action id.
     *
     * In this example, calling `newMessage` will fire the dispatcher, with
     * a payload containing the passed message content. Easy!
     */

    var MessageActions = (function (_Actions) {
      function MessageActions() {
        _classCallCheck(this, MessageActions);

        if (_Actions != null) {
          _Actions.apply(this, arguments);
        }
      }

      _inherits(MessageActions, _Actions);

      MessageActions.prototype.newMessage = function newMessage(content) {

        // The return value from the action is sent to the dispatcher.
        return content;
      };

      return MessageActions;
    })(_Flux.Actions);

    /**
     * Now we need to a Store that will receive payloads from the dispatcher
     * and update itself accordingly. Like before, create a new class that
     * extends from the Store class.
     *
     * Stores are automatically registered with the dispatcher, but rather than
     * using a giant `switch` statement to check for specific action types, we
     * register handlers with action ids, or with a reference to the action
     * itself.
     *
     * Stores have a React-inspired API for managing state. Use `this.setState`
     * to update state within your handlers. Multiple calls to `this.setState`
     * within the same handler will be batched. A change event will fire after
     * the batched updates are applied. Your view controllers can listen
     * for change events using the EventEmitter API.
     */

    var MessageStore = (function (_Store) {

      // Note that passing a flux instance to the constructor is not required;
      // we do it here so we have access to any action ids we're interested in.

      function MessageStore(flux) {
        _classCallCheck(this, MessageStore);

        // Don't forget to call the super constructor
        _Store.call(this);

        var messageActions = flux.getActions('messages');
        this.register(messageActions.newMessage, this.handleNewMessage);
        this.messageCounter = 0;

        this.state = {};
      }

      _inherits(MessageStore, _Store);

      MessageStore.prototype.handleNewMessage = function handleNewMessage(content) {
        var _setState;

        var id = this.messageCounter++;

        this.setState((_setState = {}, _setState[id] = {
          content: content,
          id: id }, _setState));
      };

      return MessageStore;
    })(_Flux.Store);

    /**
     * Here's where it all comes together. Extend from the base Flummox class
     * to create a class that encapsulates your entire flux set-up.
     */

    var Flux = (function (_Flummox) {
      function Flux() {
        _classCallCheck(this, Flux);

        _Flummox.call(this);

        // Create actions first so our store can reference them in
        // its constructor
        this.createActions('messages', MessageActions);

        // Extra arguments are sent to the store's constructor. Here, we're
        // padding a reference to this flux instance
        this.createStore('messages', MessageStore, this);
      }

      _inherits(Flux, _Flummox);

      return Flux;
    })(_Flux.Flummox);

    /**
     * And that's it! No need for singletons or global references -- just create
     * a new instance.
     *
     * Now let's test it.
     */

    it('creates new messages', function () {
      var _expect$to$deep$equal;

      var flux = new Flux();
      var messageStore = flux.getStore('messages');
      var messageActions = flux.getActions('messages');

      expect(messageStore.state).to.deep.equal({});

      messageActions.newMessage('Hello, world!');
      expect(messageStore.state).to.deep.equal((_expect$to$deep$equal = {}, _expect$to$deep$equal[0] = {
        content: 'Hello, world!',
        id: 0 }, _expect$to$deep$equal));
    });
  });
});