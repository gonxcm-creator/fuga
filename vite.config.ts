// Configuración Vite de Fuga: base Pages + PWA offline.
// Sin servidor propio; solo estático en /fuga/.
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/fuga/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'demo-extracto.csv'],
      manifest: {
        name: 'Fuga',
        short_name: 'Fuga',
        description: 'Ves las fugas de tu banco sin subir el extracto.',
        theme_color: '#f4f1ea',
        background_color: '#f4f1ea',
        display: 'standalone',
        start_url: '/fuga/',
        scope: '/fuga/',
        lang: 'es-ES',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2,csv}'],
        navigateFallback: '/fuga/index.html',
      },
    }),
  ],
})
