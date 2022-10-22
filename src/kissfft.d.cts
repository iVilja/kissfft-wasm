// Use `unknown` here since we cannot import types in a `cts` file.
declare const loadModule: () => Promise<unknown>

export default loadModule
