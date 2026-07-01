import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'من سيربح المليون',
        short_name: 'المليون',
        description: 'لعبة من سيربح المليون - Who Wants to Be a Millionaire',
        theme_color: '#ffd700',
        background_color: '#0f0c29',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          {
            src: '/million-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/million-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,woff,woff2}']
      }
    })
  ]
})
