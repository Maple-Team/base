import { hash } from '@liutsing/node-utils'
import { getTransformCode } from './test-help'

describe('arrow function declaration scenarios - templateLiteral cases', () => {
  it('handle templateLiteral case 1', () => {
    const sourceCode = `export const Component = () => {
        const plateNo = 'No.123';
        const var1 = \`车牌号: \${plateNo}\`;
        return <div>{var1}</div>
      }
      `
    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`)
    expect(result?.code).toMatchSnapshot()
  })

  it('handle templateLiteral case 2', () => {
    const sourceCode = `export const Component = () => {
        const plateNo = 'No.123';
        return <div>{\`车牌号: \${plateNo}\`}</div>
      }
      `
    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`)
    expect(result?.code).toMatchSnapshot()
  })
  it('handle templateLiteral case 3', () => {
    const sourceCode = `export const Component = () => {
        const plateNo = 'No.123';
        const price = '￥20W';
        const var1 = \`车牌号: \${plateNo}, \${price}\`;
        return <div>{var1}</div>
      }
      `
    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`)
    expect(result?.code).toMatchSnapshot()
  })

  it('handle templateLiteral case 4', () => {
    const sourceCode = `export const Component = () => {
        const plateNo = 'No.123';
        const price = '￥20W' + 'abc';
        const var1 = \`车牌号: \${plateNo}, \${price}\`;
        return <div>{var1}</div>
      }
      `
    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`)
    expect(result?.code).toMatchSnapshot()
  })

  it('handle templateLiteral case 5', () => {
    const sourceCode = `export const Component = () => {
        const plateNo = 'No.123';
        return <div>{\`\${plateNo}已急停\`}</div>
      }
      `
    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`)
    expect(result?.code).toMatchSnapshot()
  })
  it('handle templateLiteral case 6', () => {
    const sourceCode = `export const Component = () => {
    const basicInfo = {
      plateNo:123
    }
      useEffect(()=>{
            stopMsgRef.current = message.info({
        content: \`\${basicInfo?.plateNo\}已急停\`,
        duration: 0,
      })
      },[])
    }`
    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`)
    expect(result?.code).toMatchSnapshot()
  })
  it('handle templateLiteral case 7', () => {
    const sourceCode = `export const Component = () => {
    const basicInfo = {
      plateNo: {
      no:123
      }
    }
      useEffect(()=>{
            stopMsgRef.current = message.info({
        content: \`\${basicInfo?.plateNo?.no\}已急停\`,
        duration: 0,
      })
      },[])
    }`
    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`)
    expect(result?.code).toMatchSnapshot()
  })
})
