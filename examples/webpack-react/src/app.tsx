import { useScroll, useAsync } from '@liutsing/rc-hooks'
import React, { useEffect } from 'react'
import { join } from 'lodash-es'
// import { Component1, Component2 } from './useStateDemo'
import { Tooltip } from '@liutsing/rc-components'
import '@liutsing/rc-components/dist/cjs/index.css'

// const ProductList = lazy(() => import('./ProductList/ProductList'))
// const ProductList2 = lazy(() => import('./ProductList2/ProductList'))
// const AreaChart = lazy(() => import('./area'))

const App = () => {
  // console.log('log')
  // console.debug('debug')
  // console.info('info')
  // console.warn('warn')
  // console.error('error')

  useAsync('https://randomuser.me/api')
  useScroll((e) => {
    console.log(e)
  })
  useEffect(() => {
    join([], 'id')
  }, [])
  return (
    <>
      <Tooltip title="this is a tooltip">test Tooltip</Tooltip>
      {/* <div>app entry</div> */}
      {/* <Suspense fallback={<div>loading...</div>}>{ <AreaChart /> }</Suspense> */}
      <div>
        {/* app entry */}
        {/* <Suspense fallback={<div>loading...</div>}>
          <ProductList />
          <ProductList2 />
        </Suspense> */}
      </div>
      {/* <Component1 />
      <Component2 /> */}
    </>
  )
}

export default App
