import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'IZA - Ouvidoria Digital DF',
        short_name: 'IZA',
        description: 'Assistente Virtual de Ouvidoria para o DF',
        theme_color: '#005594',
        background_color: '#ffffff',
        display: 'standalone', // <--- ISSO AQUI TIRA A BARRA DO NAVEGADOR
        start_url: '/',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2593/2593635.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})