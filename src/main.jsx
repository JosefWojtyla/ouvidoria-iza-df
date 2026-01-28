import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ISSO AQUI É O QUE FAZ O BOTÃO DE INSTALAR APARECER:
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
    });
  });
}