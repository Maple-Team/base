const isFunction = (arg) => {
  return Object.prototype.toString.call(arg) === '[object Function]'
}

const dealCamelToLine = (arg) => {
  return arg.replace(/[A-Z]/g, (word) => {
    return `-${word.toLowerCase()}`
  })
}

module.exports = {
  isFunction,
  dealCamelToLine,
}
