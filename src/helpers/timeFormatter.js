function display (seconds) {
  const format = val => `0${Math.floor(val)}`.slice(-2)
  const hours = seconds / 3600
  const minutes = (seconds % 3600) / 60

  return [minutes, seconds % 60].map(format).join(':')
}

export default display;
