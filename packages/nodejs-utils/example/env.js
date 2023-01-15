const path = require('path')
const {envVariables} = require('../')

console.log(envVariables(path.resolve(__dirname, '.')))