import React from 'react'

const BATTERY_COMPONENT = 'com.robinmalfait.battery'

export default robot => {

  const {Blank} = robot.cards
  const {Icon, StyleSheet, css, color} = robot.UI

  const styles = StyleSheet.create({
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
  })

  const Battery = React.createClass({
    getInitialState () {
      return {
        hasInformation: false,
        battery: {}
      }
    },
    componentDidMount () {
      navigator.getBattery().then(battery => {
        this.setState({
          battery: {
            level: battery.level,
            charging: battery.charging
          },
          hasInformation: true
        })
      })
    },
    renderBattery () {
      const {...other} = this.props
      const {battery} = this.state
      const percentage = Math.round(battery.level * 100)      
      const status = Math.max(0, Math.round(battery.level * 100 / 20) - 1)

      return (
        <Blank
          title='Battery Level'
          {...other}
        >
          <Icon className={css(styles.battery, styles[`battery${status}`])} icon={`battery-${status} fa-5x`} />        
          <h3>Battery level at {percentage}%</h3>
          {battery.charging && (
            <span className={css(styles.charging)}>
              <Icon className={css(styles.chargingIcon)} icon='bolt' /> Your device is currently charging 
            </span>
          )}
        </Blank>
      )
    },
    renderNoInformation () {
      const {...other} = this.props

      return (
        <Blank
          title='Battery Level'
           {...other}
        >
          <h3>Waiting for information....</h3>
        </Blank>
      )
    },
    render () {
      const {hasInformation} = this.state

      return hasInformation
        ? this.renderBattery()
        : this.renderNoInformation()
    }
  })
  

  robot.registerComponent(Battery, BATTERY_COMPONENT);

  robot.listen(/^battery level$/, {
    description: 'Show the battery level',
    usage: 'battery level'
  }, () => {
    robot.addCard(BATTERY_COMPONENT)
  })
}
