import type { PlaywrightTestConfig } from '@playwright/test';
import { devices }                   from '@playwright/test';

export type TestOptions = {
    projectBaseUrl : string;
    projectTitle : string;
};

export const BASE_URL_VANILLA = 'http://localhost:3001/';
export const BASE_URL_REACT   = 'http://localhost:3002/';
export const BASE_URL_ANGULAR = 'http://localhost:3003/';

const config : PlaywrightTestConfig<TestOptions> = {
    testDir : './tests',
    timeout : 30 * 1000,
    expect  : {
        timeout : 5000
    },
    /* Run tests in files in parallel */
    fullyParallel : true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly : !!process.env.CI,
    /* Retry on CI only */
    retries : process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers : process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter : 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use : {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout : 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://localhost:3000',
        
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace : 'on-first-retry',
    },
    
    /* Configure projects for major browsers */
    projects : [
        {
            name : 'vanilla-chromium',
            use  : {
                ...devices[ 'Desktop Chrome' ],
                projectTitle   : 'Vanilla',
                projectBaseUrl : BASE_URL_VANILLA
            },
        },
        {
            name : 'vanilla-firefox',
            use  : {
                ...devices[ 'Desktop Firefox' ],
                projectTitle   : 'Vanilla',
                projectBaseUrl : BASE_URL_VANILLA
            },
        },
        
        {
            name : 'vanilla-webkit',
            use  : {
                ...devices[ 'Desktop Safari' ],
                projectTitle   : 'Vanilla',
                projectBaseUrl : BASE_URL_VANILLA
            },
        },
        {
            name : 'react-chromium',
            use  : {
                ...devices[ 'Desktop Chrome' ],
                projectTitle   : 'React',
                projectBaseUrl : BASE_URL_REACT
            },
        },
        {
            name : 'react-firefox',
            use  : {
                ...devices[ 'Desktop Firefox' ],
                projectTitle   : 'React',
                projectBaseUrl : BASE_URL_REACT
            },
        },
        {
            name : 'react-webkit',
            use  : {
                ...devices[ 'Desktop Safari' ],
                projectTitle   : 'React',
                projectBaseUrl : BASE_URL_REACT
            },
        },
        {
            name : 'angular-chromium',
            use  : {
                ...devices[ 'Desktop Chrome' ],
                projectTitle   : 'Angular',
                projectBaseUrl : BASE_URL_ANGULAR
            },
        },
        {
            name : 'angular-firefox',
            use  : {
                ...devices[ 'Desktop Firefox' ],
                projectTitle   : 'Angular',
                projectBaseUrl : BASE_URL_ANGULAR
            },
        },
        {
            name : 'angular-webkit',
            use  : {
                ...devices[ 'Desktop Safari' ],
                projectTitle   : 'Angular',
                projectBaseUrl : BASE_URL_ANGULAR
            },
        },
        
        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },
        
        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge',
        //   },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ],
    
    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',
    
    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

export default config;
