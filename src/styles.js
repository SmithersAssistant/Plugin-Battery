export default ({ color }) => ({
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
    color: color('lightGreen')
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
