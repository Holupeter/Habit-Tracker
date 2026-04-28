import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
      },
      include: ['src/lib/**/*.ts'],
      all: false,
    },
  },
});
