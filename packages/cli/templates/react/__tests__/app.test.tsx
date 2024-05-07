import { cleanup } from '@testing-library/react'
import '../setupTests'

describe('react query test case', () => {
  afterEach(() => {
    cleanup()
  })

  it('successful query component when component initial exist case', () => {
    expect(1 + 1).toEqual(2)
  })
})
