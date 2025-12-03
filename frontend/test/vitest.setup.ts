// vitest.setup.ts
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Mock the screen object globally
  if (typeof global.screen === 'undefined') {
    (global as any).screen = {
      width: 1024,
      height: 768,
    };
  }
});