import { getTransformCode } from './test-help'

describe('auto i18n plugin unit tests', () => {
  it('handle JSXText', () => {
    const sourceCode = `
    export const Component = () => {
      return <div>你好</div>
    }
    `
    const result = getTransformCode(sourceCode, 'jsxtext.tsx')
    expect(result?.code).toMatchSnapshot()
  })

  describe('stringLiteral cases', () => {
    it('handle console', () => {
      const sourceCode = `
      export const Component = () => {
        console.log('输出值')
        return <div name="属性">jsx文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'jsxattribute.tsx')
      expect(result?.code).toMatchSnapshot()
    })

    it('handle JSXAttribute', () => {
      const sourceCode = `
      export const Component = () => {
        return <div name="属性">jsx文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'jsxattribute.tsx')
      expect(result?.code).toMatchSnapshot()
    })

    it('handle Assignment', () => {
      const sourceCode = `
      export const Component = () => {
        const var1:string = "变量1"
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'assignment.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle objectProperty', () => {
      const sourceCode = `
      export const Component = () => {
        const obj1 = {
          name: "属性值1",
          key: "属性值2"
        }
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'objectProperty.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle module scope objectProperty', () => {
      const sourceCode = `
      const obj1 = {
        name: "属性值1",
        key: "属性值2"
      }
      export const Component = () => {
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'objectProperty-module.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle arrayExpression', () => {
      const sourceCode = `
      export const Component = () => {
        const obj1 = ["属性值1", "属性值2"]
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'arrayExpression.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle svg react component', () => {
      const sourceCode = `
      export const Component = () => {
      return <svg
        t="1711425339799"
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"

        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
      >
        <path
        id="svg中的中文"
          d="M448 672c-6.4 0-19.2 0-25.6-6.4-12.8-12.8-12.8-32 0-44.8L531.2 512 422.4 409.6c-12.8-12.8-12.8-32 0-44.8s32-12.8 44.8 0l128 128c12.8 12.8 12.8 32 0 44.8l-128 128C467.2 672 454.4 672 448 672z"
          fill="#272636"
        />
      </svg>
      }
      `
      const result = getTransformCode(sourceCode, 'arrayExpression.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
  describe('handle useEffect hooks add t as dependences', () => {
    it('exported function case 0', () => {
      const sourceCode = `
      export const Component = () => {
        const [v, setV] = useState<string>('1')
        useEffect(()=>{
          const text = "effect作用域中的文案1"
          console.log(v)
        },[v])
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useEffect-exported-function0.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('exported function case 1', () => {
      const sourceCode = `
      export const Component = () => {
        useEffect(()=>{
          const text = "effect作用域中的文案1"
        },[])
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useEffect-exported-function1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('exported function case 2', () => {
      const sourceCode = `
      export const Component = () => {
        useEffect(()=>{
          const text = "effect作用域中的文案2"
        })
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useEffect-exported-function2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
  describe('handle useCallback hooks add t as dependences', () => {
    it('exported function case 0', () => {
      const sourceCode = `
      export const Component = () => {
        const [v, setV] = useState<string>('1')
        const cb1 = useCallback(()=>{
          const text = "useCallback作用域中的文案0"
          console.log(v)
        },[v])
        return <div name="属性" onClick={cb1}>站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useCallback-exported-function0.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('exported function case 1', () => {
      const sourceCode = `
      export const Component = () => {
        const cb1 = useCallback(()=>{
          const text = "useCallback作用域中的文案1"
        },[])
        return <div name="属性" onClick={cb1}>站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useCallback-exported-function1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
  describe('handle useMemo hooks add t as dependences', () => {
    it('exported function case 0', () => {
      const sourceCode = `
      export const Component = () => {
        const cb1 = useMemo(()=>{
          const text = "useMemo作用域中的文案1"
          return () => {
            console.log(text)
          }
        },[])
        return <div name="属性" onClick={cb1}>站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useMemo-exported-function0.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('exported function case 1', () => {
      const sourceCode = `
      export const Component = () => {
        const text = useMemo(()=>{
          const text = "useMemo作用域中的文案1"
          return text
        },[])
        return <div name="属性">{text}</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useMemo-exported-function1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('exported function case 2', () => {
      const sourceCode = `
      export const Component = () => {
        const var1 = "外部变量1"
        const var2 = useMemo(()=>{
          const text = "text" + var1
          return text
        },[var1])
        return <div name="属性">{var2}</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useMemo-exported-function2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('exported function case 3', () => {
      const sourceCode = `
      export const Component = () => {
        const data = useMemo(()=>[
          {
            name:"值1",
            label: "标签1"
          },
          {
            name:"值2",
            label: "标签2"
          },
          {
            name:"值3",
            label: "标签3"
          }
        ],[])
        return <CustomComponent name="属性" data={data}></CustomComponent>
      }
      `
      const result = getTransformCode(sourceCode, 'useMemo-exported-function2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})
