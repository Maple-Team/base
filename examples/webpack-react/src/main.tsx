import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './app'
import Scrollbar from './scrollbar'

const rootElement = document.getElementById('app')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <Scrollbar />
  </StrictMode>
)
