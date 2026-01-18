import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Debug: Check all environment variables
console.log('🔍 FULL import.meta.env:', import.meta.env)
console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🔍 PROD:', import.meta.env.PROD)
console.log('🔍 MODE:', import.meta.env.MODE)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
