import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './main.css'

const root = createRoot(document.getElementById('root') as HTMLElement)

//@ts-expect-error: xx
root.render(<App />)
