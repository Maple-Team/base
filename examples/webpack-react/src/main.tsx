import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import '@/i18n'
import './main.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(<App />)
