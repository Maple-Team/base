import { Random } from 'mockjs'
import '../src/index' // NOTE extend
import { constellations } from '../src/utils'

describe('mock-extend test cases', () => {
  it('Random.constellations() should return one element of constellations', () => {
    const constellation = Random.constellation()
    expect(constellations.includes(constellation)).toBe(true)
  })
  it('Random.jwt() should return three string split by .', () => {
    const jwt: string = Random.jwt()
    const strings = jwt.split('.')
    expect(strings.length).toBe(3)
    expect(strings[0].length).toBeGreaterThanOrEqual(20)
    expect(strings[0].length).toBeLessThanOrEqual(40)
    expect(strings[1].length).toBeGreaterThanOrEqual(20)
    expect(strings[1].length).toBeLessThanOrEqual(40)
    expect(strings[2].length).toBeGreaterThanOrEqual(20)
    expect(strings[2].length).toBeLessThanOrEqual(40)
  })
  it('Random.sn() should return string with 18 length', () => {
    const sn: string = Random.sn()
    expect(sn.length).toBe(18)
  })
  it('Random.snowId() should return string with 18 length', () => {
    const sn: string = Random.snowId()
    expect(sn.length).toBe(18)
  })
  it('Random.lng() should return number in [-180, 180]', () => {
    const lng: number = Random.lng()
    expect(lng).toBeLessThanOrEqual(180)
    expect(lng).toBeGreaterThanOrEqual(-91800)
  })
  it('Random.lat() should return number in [-90, 90]', () => {
    const lat: number = Random.lat()
    expect(lat).toBeLessThanOrEqual(90)
    expect(lat).toBeGreaterThanOrEqual(-90)
  })
})
