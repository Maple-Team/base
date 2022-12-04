import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css'
import { ConfigProvider } from '@liutsing/rc-components'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider prefixCls="tee">
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
