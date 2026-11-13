// Vitest JSDOM environment polyfills
if (typeof window !== 'undefined') {
  if (!window.scrollTo || typeof window.scrollTo !== 'function') {
    window.scrollTo = () => {};
  } else {
    // JSDOM has a dummy window.scrollTo that throws "Not implemented"
    window.scrollTo = () => {};
  }

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:mock-url';
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }
}
