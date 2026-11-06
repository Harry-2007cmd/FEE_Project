// src/test/setup.js — Vitest setup with jsdom and polyfills
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// jsdom provides a decent TextEncoder/Decoder, but ensure they exist
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;

// Mock localStorage / sessionStorage with exact key behavior
const createStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size; },
    key: (i) => Array.from(store.keys())[i] ?? null,
  };
};

global.localStorage = createStorage();
global.sessionStorage = createStorage();

// Ensure crypto.subtle is available (jsdom 31+ has it)
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.subtle && global.crypto.webcrypto) {
  global.crypto.subtle = global.crypto.webcrypto.subtle;
}
if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  };
}

// silence console.error in tests unless explicitly needed
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.("Warning: ReactDOM.render is no longer supported") ||
      args[0]?.includes?.("act(...)" )) {
    return;
  }
  originalError.apply(console, args);
};