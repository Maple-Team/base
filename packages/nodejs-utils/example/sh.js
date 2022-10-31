const path = require('path')
const { find } = require('../')

const res = find(path.resolve(__dirname, '../../../'), 'useScript', ['node_modules', '.git', '.github'])
console.log(res)
