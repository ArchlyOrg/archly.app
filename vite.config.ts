/// <reference types="vitest" />
import * as path from 'node:path'

import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  test: {
    include: ['src/**/__tests__/*'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    clearMocks: true,
    coverage: {
      enabled: true,
      '100': true,
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/jest'
    }
  },
  plugins: [
    tsconfigPaths(),
    react(),
    ...(mode !== 'test'
      ? [
        eslintPlugin(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: [
            'favicon.png',
            'robots.txt',
            'apple-touch-icon.png',
            'icons/*.svg',
            'fonts/*.ttf'
          ],
          manifest: {
            theme_color: '#17263c',
            icons: [
              {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ]
      : [])
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      '@archly': path.resolve(__dirname, './src')
    }
  }
}))
