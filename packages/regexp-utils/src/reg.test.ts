import { chineseRegexp, pairQuoteReg } from './reg'

describe('chinese character test cases', () => {
  it('case 1', () => {
    expect(chineseRegexp.test('我是谁')).toEqual(true)
    expect(chineseRegexp.test('我是谁1')).toEqual(true)
  })
})
describe('pairQuoteReg case', () => {
  it.concurrent.each([
    [`"a"`, true],
    [`'a'`, true],
    [`"a'`, false],
    [`'a"`, false],
  ])('%s is %o pair quotes', (a, b) => {
    expect(pairQuoteReg.test(a)).toBe(b)
  })
})

const extractUserName = (fileName: string) => {
  // return fileName.replace(/^([a-z_]+)_\d{9,}_[\d]{5,}.*/, (_, $1) => $1)
  return fileName.split(/_[\d]{9,10}/)[0]
}
describe('extract user name', () => {
  it.concurrent.each([
    ['yomisland__1742721967_3594534853703998284_1221550622.jpg', 'yomisland_'],
    ['yushuangys_1741354813_3583066333048716141_6097970858.jpg', 'yushuangys'],
    ['sisikam_x_1740144017_508968943.mp4', 'sisikam_x'],
    ['_kirome_469737844_18474493441033940_3234355458539097896_n.jpg', '_kirome'],
    ['keyi_27_470306328_2360475090978435_4140370337086930896_n.jpg', 'keyi_27'],
    ['___y1____1743427019_3600449255411947909_305654447.jpg', '___y1___'],
  ])("%s 's name is %s", (a, b) => {
    expect(extractUserName(a)).toEqual(b)
  })
})
