'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FluxComponent = require('./FluxComponent');

var _FluxComponent2 = _interopRequireDefault(_FluxComponent);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var FluxComponent = (0, _FluxComponent2['default'])(_react2['default'], 'span');
exports.FluxComponent = FluxComponent;
var connect = (0, _connect2['default'])(_react2['default']);
exports.connect = connect;