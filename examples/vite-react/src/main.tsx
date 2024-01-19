import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/reset.css'
import { ConfigProvider } from '@liutsing/rc-components'
// import { App as AnAPP } from '@liutsing/rcv-components'
import './style.css'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './stores/store'
import App from './App'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider prefixCls="tee">
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <App />
        </QueryClientProvider>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
)
