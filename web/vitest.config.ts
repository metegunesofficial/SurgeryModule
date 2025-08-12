import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@auth/create/react': '@hono/auth-js/react',
      '@auth/create': path.resolve(__dirname, './src/__create/@auth/create'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  cacheDir: './.vitest',
});
