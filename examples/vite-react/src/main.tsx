import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css'
import { ConfigProvider } from '@liutsing/rc-components'
// @ts-ignore
import { App as AnAPP } from '@liutsing/rcv-components'
import './style.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider prefixCls="tee">
      {/* <AnAPP /> */}
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
