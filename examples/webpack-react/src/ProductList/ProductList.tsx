import React, { lazy } from 'react'
// import ProductPage from '../ProductPage/ProductPage'

const ProductPage = lazy(() => import('../ProductPage/ProductPage'))
export default () => {
  return (
    <div>
      product list
      {[1].map((i) => (
        <ProductPage key={i}>{i}</ProductPage>
      ))}
    </div>
  )
}
