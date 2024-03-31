import React from 'react'
import ReactDom from 'react-dom/client'
import './main.css'
// import './assets/svg-icons'
import { App } from './app'
import '@/i18n'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Root />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: '/rc',
//         element: <RemoteControlCard />,
//       },
//       {
//         path: '/react-amap',
//         element: <ReactAmap />,
//       },
//       {
//         path: '/react-query',
//         element: <ReactQueryDemo />,
//       },
//       {
//         path: '/react-tooltip',
//         element: <ReactTooltip />,
//       },
//       {
//         // 组件库显示组件
//         path: '/component',
//         element: <Example />,
//       },
//     ],
//   },
// ])

// const queryClient = () =>
//   new QueryClient({
//     defaultOptions: {
//       queries: {
//         refetchOnWindowFocus: true,
//         retry: false,
//       },
//     },
//   })

const rootElement = document.getElementById('app')
const root = ReactDom.createRoot(rootElement!)

root.render(<App />)
