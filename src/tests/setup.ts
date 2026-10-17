import { vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
  // Implement required Storage interface methods
  [Symbol.iterator]: function* (): Iterator<string> {
    yield* [];
  }
} as Storage;

// Mock window.localStorage
global.localStorage = localStorageMock;

// Mock fetch if not in jsdom environment
if (!global.fetch) {
  global.fetch = vi.fn();
}

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
}); 