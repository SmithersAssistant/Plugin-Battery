'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var BATTERY_COMPONENT = 'com.robinmalfait.battery';

exports.default = function (robot) {
  var React = robot.dependencies.React;
  var Blank = robot.cards.Blank;
  var _robot$UI = robot.UI;
  var Icon = _robot$UI.Icon;
  var StyleSheet = _robot$UI.StyleSheet;
  var css = _robot$UI.css;
  var color = _robot$UI.color;


  var styles = StyleSheet.create({
    battery: {
      float: 'left',
      transform: 'rotate(270deg)'
    },
    battery0: {
      color: color('red')
    },
    battery1: {
      color: color('orange')
    },
    battery2: {
      color: color('yellow')
    },
    battery3: {
      color: color('light-green')
    },
    battery4: {
      color: color('green')
    },
    charging: {
      marginTop: 20,
      display: 'block'
    },
    chargingIcon: {
      color: color('yellow', 700),
      fontSize: 22
    }
  });

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
      var other = _objectWithoutProperties(this.props, []);

      var battery = this.state.battery;

      var percentage = Math.round(battery.level * 100);
      var status = Math.max(0, Math.round(battery.level * 100 / 20) - 1);

      return React.createElement(
        Blank,
        _extends({
          title: 'Battery Level'
        }, other),
        React.createElement(Icon, { className: css(styles.battery, styles['battery' + status]), icon: 'battery-' + status + ' fa-5x' }),
        React.createElement(
          'h3',
          null,
          'Battery level at ',
          percentage,
          '%'
        ),
        battery.charging && React.createElement(
          'span',
          { className: css(styles.charging) },
          React.createElement(Icon, { className: css(styles.chargingIcon), icon: 'bolt' }),
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

  robot.registerComponent(Battery, BATTERY_COMPONENT);

  robot.listen(/^battery level$/, {
    description: 'Show the battery level',
    usage: 'battery level'
  }, function () {
    robot.addCard(BATTERY_COMPONENT);
  });
};