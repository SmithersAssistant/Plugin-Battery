'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var BATTERY_COMPONENT = 'com.robinmalfait.battery';

exports.default = function (robot) {
  var React = robot.dependencies.React;
  var Blank = robot.cards.Blank;
  var _robot$UI = robot.UI;
  var Icon = _robot$UI.Icon;
  var classNames = _robot$UI.classNames;
  var enhance = robot.enhance;
  var withStyles = robot.withStyles;


  var Battery = React.createClass({
    displayName: 'Battery',
    getInitialState: function getInitialState() {
      return {
        hasInformation: false,
        battery: {}
      };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      navigator.getBattery().then(function (battery) {
        _this.battery = battery;

        _this.setState({
          battery: {
            level: battery.level,
            charging: battery.charging
          },
          hasInformation: true
        });

        battery.addEventListener('chargingchange', _this.chargingChanged);
        battery.addEventListener('levelchange', _this.levelChanged);
      });
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.battery) {
        this.battery.removeEventListener('chargingchange', this.chargingChanged);
        this.battery.removeEventListener('levelchange', this.levelChanged);
      }
    },
    chargingChanged: function chargingChanged() {
      this.setState({
        battery: _extends({}, this.state.battery, {
          charging: this.battery.charging
        })
      });
    },
    levelChanged: function levelChanged() {
      this.setState({
        battery: _extends({}, this.state.battery, {
          level: this.battery.level
        })
      });
    },
    renderBattery: function renderBattery() {
      var _props = this.props;
      var styles = _props.styles;

      var other = _objectWithoutProperties(_props, ['styles']);

      var battery = this.state.battery;

      var percentage = Math.round(battery.level * 100);
      var status = Math.max(0, Math.round(battery.level * 100 / 20) - 1);

      return React.createElement(
        Blank,
        _extends({
          title: 'Battery Level'
        }, other),
        React.createElement(Icon, { className: classNames(styles.battery, styles['battery' + status]), icon: 'battery-' + status + ' fa-5x' }),
        React.createElement(
          'h3',
          null,
          'Battery level at ',
          percentage,
          '%'
        ),
        battery.charging && React.createElement(
          'span',
          { className: styles.charging },
          React.createElement(Icon, { className: styles.chargingIcon, icon: 'bolt' }),
          ' Your device is currently charging'
        )
      );
    },
    renderNoInformation: function renderNoInformation() {
      var other = _objectWithoutProperties(this.props, []);

      return React.createElement(
        Blank,
        _extends({
          title: 'Battery Level'
        }, other),
        React.createElement(
          'h3',
          null,
          'Waiting for information....'
        )
      );
    },
    render: function render() {
      var hasInformation = this.state.hasInformation;


      return hasInformation ? this.renderBattery() : this.renderNoInformation();
    }
  });

  robot.registerComponent(enhance(Battery, [withStyles(_styles2.default)]), BATTERY_COMPONENT);

  robot.listen(/^battery level$/, {
    description: 'Show the battery level',
    usage: 'battery level'
  }, function () {
    robot.addCard(BATTERY_COMPONENT);
  });
};