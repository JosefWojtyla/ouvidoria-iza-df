import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true 
      },
      manifest: {
        name: 'Ouvidoria CGDF - IZA',
        short_name: 'OuvidoriaDF',
        description: 'Assistente Virtual da Ouvidoria do DF',
        theme_color: '#005594',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2593/2593635.png', // Ícone temporário de robô
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})