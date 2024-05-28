import { getTransformCode } from './test-help'

describe('ReturnStatement', () => {
  it('', () => {
    const sourceCode = `
   export const Component = () => {
    const errorMessage = useMemo(() => {
      if (!errorCode) return ''
      switch (errorCode) {
        case MediaError.MEDIA_ERR_NETWORK:
          return '当前视频加载网络错误'
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          return '当前视频地址错误或格式不支持'
        default:
          return '当前视频出现其他错误'
      }
    }, [errorCode])
    return <div>{errorMessage}</div>
   }
    `
    const result = getTransformCode(sourceCode, 'filename.tsx', false)
    expect(result?.code).toMatchSnapshot()
  })
})
