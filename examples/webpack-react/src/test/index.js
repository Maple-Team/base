import { cube } from './math.js'
import _ from 'lodash'

function component() {
  const element = document.createElement('pre')

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  const a = 5
  element.innerHTML = ['Hello webpack!', '5 cubed is equal to ' + cube(a)].join('\n\n')

  return element
}

document.body.appendChild(component())
