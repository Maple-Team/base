const { progress } = require('../')

const { increase, tick } = progress()

setInterval(() => {
  increase()
}, 1000)
setInterval(() => {
  tick(2)
}, 500)
