import { defineConfig, devices } from '@playwright/test';
import type {TestOptions} from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
 import { config } from 'dotenv';
 import * as path from 'path';
 config({ path: path.resolve(__dirname, '.env') });

// Delete everything, that is not relevant to you or your project


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    globalQaURL: 'https://globalsqa.com/demo-site/draganddrop/',
    baseURL: 'http://localhost:4200/',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
    }
  ],
});
