import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['tests/integration/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    pool: 'threads',
    maxThreads: 1,
    minThreads: 1,
  },
});
