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
  // Redefine default config for TIMEOUTS
  // Test timeout
  // timeout: 60000,
  // Global timeout (for all tests)
  // ACTION timeouts can be set in use here down
  // Comment global timeout for running in docker
  //globalTimeout: 60000,
  // Timeout for expects
  expect:{
    timeout: 50000
  },
  /* Retry on CI only 2 times, locally zero times*/
  retries: 1,
  //reporter: 'html',
  //reporter: 'list',
  reporter: [
    ['json', { outputFile: 'test-results/jsonReport.json' }],
    ['junit', { outputFile: 'test-results/junitReport.xml' }],
  ['html']],
  use: {
    // How long the click is waiting for the locator to be filled with element
    actionTimeout: 15000,

    /* Base URL to use in actions like `await page.goto('/')`. */
    globalQaURL: 'https://globalsqa.com/demo-site/draganddrop/',
    
    baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
      : process.env.STAGE === '1' ? 'http://localhost:4201/' 
      : 'http://localhost:4200/',

    trace: 'on-first-retry',

    // The option for recording tests. The test needs to be run from command line, recording when run from UI will not happen
    //video: 'on'
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/',
       },
    },
    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
            video: {
      mode: 'on',
      size: { width: 1920, height: 1080 }
    }
      },
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: { ...devices['iPhone 13 Pro']},
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    timeout: 180000, // 3 minutes
  }
});
