import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './test/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4000',
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;


