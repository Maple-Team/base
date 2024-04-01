import { getTransformCode } from './test-help'

describe('constant test cases', () => {
  it('语言切换统一模块测试', () => {
    const sourceCode = `
    const Language = {
      'en-US': 'English',
      'zh-CN': '简体中文',
      'zh-HK': '繁体中文',
    }
    type LanguageKey = keyof typeof Language
    const Root = () => {
      const [lng, setLng] = useState<LanguageKey>('zh-CN')

      const items: MenuProps['items'] = (Object.keys(Language) as LanguageKey[]).map((key) => {
        return {
          label: Language[key],
          key,
          onClick: () => {
            i18n.changeLanguage(key).catch(console.error)
            setLng(key)
          },
        }
      })

      return (
        <div className="flex w-full" style={{ display: 'flex' }}>
          <main className="flex-1" style={{ paddingLeft: 24, paddingTop: 0, flex: 1 }}>
            <div className="h-12 flex justify-between items-center px-5">
              <i />
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <GlobalOutlined />
                    {Language[lng]}
                  </Space>
                </a>
              </Dropdown>
            </div>
            <Outlet />
          </main>
        </div>
      )
    }
    `
    const result = getTransformCode(sourceCode, 'filename.tsx')
    expect(result?.code).toMatchSnapshot()
  })
})
