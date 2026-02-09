import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

declare module 'vitest' {
  export interface ProvidedContext {
    withNodeWorkaround: (boolean | undefined)[]
  }
}

export default defineConfig({
  test: {
    coverage: {
      // See https://github.com/marketplace/actions/vitest-coverage-report
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ['text', 'json-summary', 'json'],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
    },
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          globals: true,
          provide: {
            withNodeWorkaround: [true],
          },
          include: ['test/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'browser',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            screenshotFailures: false,
            // https://vitest.dev/guide/browser/playwright
            instances: [
              { browser: 'chromium' },
              { browser: 'firefox' },
              // webkit is not working on my machine
              // { browser: 'webkit' },
            ],
          },
          globals: true,

          provide: {
            withNodeWorkaround: [true, false, undefined],
          },
          include: ['test/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'examples',
          environment: 'node',
          globals: true,
          provide: {
            withNodeWorkaround: [true],
          },
          include: ['examples/**/*.test.ts'],
        },
      },
    ],
  },
})
