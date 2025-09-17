/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from &apos;vite&apos;
import react from &apos;@vitejs/plugin-react&apos;
import path from &apos;path&apos;

export default defineConfig({
  plugins: [react()],
  test: {
    environment: &apos;jsdom&apos;,
    globals: true,
    setupFiles: [&apos;./tests/setup.ts&apos;],
    coverage: {
      reporter: [&apos;text&apos;, &apos;json&apos;, &apos;html&apos;],
      exclude: [
        &apos;node_modules/&apos;,
        &apos;tests/setup.ts&apos;,
      ],
    },
  },
  resolve: {
    alias: {
      &apos;@&apos;: path.resolve(__dirname, &apos;./&apos;)
    },
  },
})


