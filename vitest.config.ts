import { defineConfig } from 'vitest/config'

// Unit tests for pure logic only (app/utils); pages are checked in a browser.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
