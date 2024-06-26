import { getTransformCode } from './test-help'
// pnpm run test .\__tests__\index.test.ts --coverage

describe('arrow function declaration scenarios', () => {
  describe('stringLiteral cases', () => {
    it('handle jsx attribute', () => {
      const sourceCode = `
      export const Component = () => {
        console.log('输出值')
        return <div name="属性">jsx文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'jsx-attribute.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle conditional jsx attribute', () => {
      const sourceCode = `
      export const Component = () => {
        console.log('输出值')
        const var1 = true
        return <div name={var1 ? "条件1": "条件2"}>jsx文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'conditional-jsx-attribute.tsx')
      expect(result?.code).toMatchSnapshot()
    })

    it('handle templateElement text', () => {
      const sourceCode = `
        export const Component = () => {
          return (
            <div>
              {\`外层文本\`}
              <div>{\`嵌套文本\`}</div>
            </div>
          )
        }
      `
      const result = getTransformCode(sourceCode, 'templateElement.tsx')
      expect(result?.code).toMatchSnapshot()
    })

    it('handle nested JSXText', () => {
      const sourceCode = `
        export const Component = () => {
          return (
            <div>
              {'外层文本'}
              <div>{'嵌套文本'}</div>
            </div>
          )
        }
      `
      const result = getTransformCode(sourceCode, 'nestedJSXText.tsx')
      expect(result?.code).toMatchSnapshot()
    })

    it('handle JSXAttribute', () => {
      const sourceCode = `
      export const Component = () => {
        return <div name="属性">jsx文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'jsx-attribute.tsx')
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
    it('handle message object', () => {
      const sourceCode = `
      export const Component = () => {
        useEffect(()=>{
          message.info({
            content: "内容值"
          })
        },[])
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'handle-message-obj.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle modal object', () => {
      const sourceCode = `
      export const Component = () => {
       const cb = useCallback(()=>{
          modal.info({
            content: <div>内容值</div>,
            footer: (
              <>
              <Space>
              <Button>取消</Button>
              <Button>确认</Button>
              </Space>
              </>
            )
          })
        },[])
        return <div name="属性" onClick={cb} >站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'handle-modal-obj.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle string literals combined with variables', () => {
      const sourceCode = `
        const text = "模块作用域文案";
        export const Component = () => {
          return <div>{text}{'后缀'}</div>;
        }
      `
      const result = getTransformCode(sourceCode, 'stringLiteralsWithVariables.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle conditional rendering', () => {
      const sourceCode = `
        const showText = true;
        export const Component = () => {
          return (
            <>
            <div>{showText && '显示中文'}</div>
            <span>{showText ? '条件1': '条件2' }</span>
            </>
          )
        }
      `
      const result = getTransformCode(sourceCode, 'conditionalRendering.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle binary expression rendering', () => {
      const sourceCode = `
        const showText = true;
        export const Component = () => {
          return (
            <div>
              {showText & '显示中文'}
            </div>
          )
        }
      `
      const result = getTransformCode(sourceCode, 'binaryExpressionRendering.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle console.log case1', () => {
      const sourceCode = `
      export const Component = () => {
        const clear = useCallback(() => {
          if (!rtcReady) return
          console.log('执行BRTC停止逻辑')
          window.BRTC_StopPublish()
          window.BRTC_Stop()
          // client.current = null
          setRTCReady(false)
        }, [rtcReady])
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle console.log case2', () => {
      const sourceCode = `
      export const useShout = (isSpeaking?: boolean) => {
        useEffect(() => {
          const handler = (devices: unknown) => {
            // 音视频设备变化
            console.log('当前电脑音视频输入设备: ', devices)
          }
          navigator.mediaDevices.addEventListener('devicechange', handler)
          return () => {
            navigator.mediaDevices.removeEventListener('devicechange', handler)
          }
        }, [])
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle composition condition case', () => {
      const sourceCode = `
      export const Component = () => {
      console.log('干扰文案')
      useEffect(() => {
        const handler = (e: KeyboardEvent) => {
          switch (key) {
            case 'n':
              emitter.emit('SHOW_MESSAGE', { level: 'info', msg: '操作异常' })
              break
            case 'arrowleft':
              emitter.emit('SHOW_MESSAGE', { msg: '操作异常', level: 'error' })
              break
          }
        }
        window.addEventListener('keydown', handler)
        return () => {
          window.removeEventListener('keydown', handler)
        }
      }, [])
      return (
        <>
        <div>1</div>
        </>
      )
    }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
  describe('handle useEffect hooks add t as dependencies', () => {
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
  describe('handle useCallback hooks add t as dependencies', () => {
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
  describe('handle useMemo hooks add t as dependencies', () => {
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
