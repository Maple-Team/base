import postcss from 'postcss'
import plugin from '../src'

describe('postcss-variables test cases', () => {
  it('should pass with matching css', async () => {
    const result = postcss([
      plugin({
        variables: {
          ph55: `'ph55','other font family'`,
          ph65: `'ph65','other font family'`,
          ph75: `'ph75','other font family'`,
          textOpacity85: 'rgba(0,0,0,.85)',
          textOpacity65: 'rgba(0,0,0,.65)',
        },
      }),
    ])
      .process(
        `
        a{
          font-family: '$ph55';
          color: '$textOpacity85';
        }
        b{
          font-family: '$ph65';
          color: '$textOpacity65';
        }
        i{
          font-family: '$ph75';
        }
      `
      )
      .root.toResult().css
    expect(result).toMatchSnapshot()
  })
})
