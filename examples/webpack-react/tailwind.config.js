const ph = (size) => [`"Alibaba PuHuiTi 2.0 ${size}"`]
const ph55 = ph(55)
const numberRegularFamily = ['"Lato Regular"', 'Arial']
const wordFamily = ['"PingFang SC"', '"Microsoft YaHei"']

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    fontFamily: {
      ph55: [...numberRegularFamily, ...ph55, ...wordFamily],
    },
    extend: {},
  },
  plugins: [],
}
