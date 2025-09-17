import &apos;@testing-library/jest-dom&apos;
import { expect, afterEach } from &apos;vitest&apos;
import { cleanup } from &apos;@testing-library/react&apos;
import * as matchers from &apos;@testing-library/jest-dom/matchers&apos;

// Extend Vitest&apos;s expect with Testing Library matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})