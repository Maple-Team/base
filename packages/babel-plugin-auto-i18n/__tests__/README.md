## 定位实际项目中的问题的方法

创建个`temp.test.ts`文件，内容如下：

```tsx
import { getTransformCode } from './test-help'

describe('temp case', () => {
  it('case1', () => {
    const sourceCode = `
    // 实际的项目代码
`
    const result = getTransformCode(sourceCode, 'filename.tsx')
    expect(result?.code).toMatchSnapshot()
  })
})
```
