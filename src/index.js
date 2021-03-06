import styles from './styles'

const BATTERY_COMPONENT = 'com.robinmalfait.battery'

export default robot => {
  const { React } = robot.dependencies;
  const { Blank } = robot.cards
  const { Icon, classNames } = robot.UI
  const { enhance, withStyles } = robot

  const Battery = React.createClass({
    getInitialState () {
      return {
        hasInformation: false,
        battery: {}
      }
    },
    componentDidMount () {
      navigator.getBattery().then(battery => {
        this.battery = battery

        this.setState({
          battery: {
            level: battery.level,
            charging: battery.charging
          },
          hasInformation: true
        })

        battery.addEventListener('chargingchange', this.chargingChanged)
        battery.addEventListener('levelchange', this.levelChanged)
      })
    },
    componentWillUnmount () {
      if (this.battery) {
        this.battery.removeEventListener('chargingchange', this.chargingChanged)
        this.battery.removeEventListener('levelchange', this.levelChanged)
      }
    },
    chargingChanged() {
      this.setState({
        battery: {
          ...this.state.battery,
          charging: this.battery.charging
        }
      })
    },
    levelChanged() {
      this.setState({
        battery: {
          ...this.state.battery,
          level: this.battery.level
        }
      })
    },
    renderBattery () {
      const { styles, ...other } = this.props
      const { battery } = this.state
      const percentage = Math.round(battery.level * 100)
      const status = Math.max(0, Math.round(battery.level * 100 / 20) - 1)

      return (
        <Blank
          title='Battery Level'
          {...other}
        >
          <Icon className={classNames(styles.battery, styles[`battery${status}`])} icon={`battery-${status} fa-5x`}/>
          <h3>Battery level at {percentage}%</h3>
          {battery.charging && (
            <span className={styles.charging}>
              <Icon className={styles.chargingIcon} icon='bolt'/> Your device is currently charging
            </span>
          )}
        </Blank>
      )
    },
    renderNoInformation () {
      const { ...other } = this.props

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
      const { hasInformation } = this.state

      return hasInformation
        ? this.renderBattery()
        : this.renderNoInformation()
    }
  })

  robot.registerComponent(enhance(Battery, [
    withStyles(styles)
  ]), BATTERY_COMPONENT);

  robot.listen(/^battery level$/, {
    description: 'Show the battery level',
    usage: 'battery level'
  }, () => {
    robot.addCard(BATTERY_COMPONENT)
  })
}
