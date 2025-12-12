import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.svg', 'logo.png'],
      manifest: {
        name: 'Telvora Analytics',
        short_name: 'Telvora',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0a66c2',
        description: 'Portal analitik internal berbasis Supabase dan ML',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/admin'),
            handler: 'NetworkFirst',
            options: { cacheName: 'admin-pages', expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 7 } }
          }
        ]
      },
      pwaAssets: {
        disabled: false,
        image: 'public/logo.png',
        publicDir: 'public',
        includeManifestIcons: true
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
  },
})










