import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  test: {
    environment: 'jsdom', // Используем jsdom для тестов
    globals: true, // Включаем глобальные переменные, например, expect
    include: ['**/*.test.ts', '**/*.test.js'] // Убедись, что тесты включены в запуск
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
