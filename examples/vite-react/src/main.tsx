import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css'
import { ConfigProvider } from '@liutsing/rc-components'
// @ts-ignore
// import { App as AnAPP } from '@liutsing/rcv-components'
import './style.css'
import { Provider } from 'react-redux'
import { store } from './stores/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider prefixCls="tee">
      <Provider store={store}>
        {/* <AnAPP /> */}
        <App />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
)
