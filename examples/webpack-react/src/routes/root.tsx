import React from 'react'
import { Outlet } from 'react-router-dom'
import App from '../app'
// import Scrollbar from './scrollbar'
import { Layout, Space, Menu } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'

const { Header, Footer, Sider, Content } = Layout
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  color: '#fff',
}

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
}

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
}
export default () => {
  const items: ItemType[] = [
    { title: 'hooks example', key: 'rc', label: 'hooks example' },
    {
      label: 'ToolTip example',
      key: 'ToolTip',
    },
    {
      label: '',
      key: '',
    },
  ]
  return (
    <Layout>
      <Sider
        style={siderStyle}
        theme="light"
      >
        <Menu
          defaultSelectedKeys={['2']}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={headerStyle}>Header</Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  )
}
