import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  workers: 2,
  use: { baseURL: process.env.PROFILE_BASE_URL || 'http://127.0.0.1:8794', headless: true, reducedMotion: 'reduce' },
  reporter: 'list',
});
