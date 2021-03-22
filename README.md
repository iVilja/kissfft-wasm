# Kiss FFT for WebAssembly

[![Build & Test](https://github.com/ryukina/kissfft-wasm/actions/workflows/build.yml/badge.svg)](https://github.com/ryukina/kissfft-wasm/actions/workflows/build.yml)
[![NPM](https://nodei.co/npm/kissfft-wasm.png)](https://npmjs.org/kissfft-wasm/)

## Install

```bash
$ npm install kissfft
```

Note that you may want to copy the `kissfft.wasm` file explicitly during building process since most compilers/bundlers won't
handle it by default.

## Usage

- Use APIs such as `fft`, `ifft`, etc. (See [API](./src/api.ts))
- For Complex input, note that `(input[2i], input[2i+1])` are the real and imaginary part of the `i+1`-th number, respectively.
- For Real input, use `rfft`, `irfft`, etc.
- If using lower functions, remember to free every class you created after its usage.

## Develop

- You need to have [Emscripten](https://github.com/emscripten-core/emscripten) installed before building this package.
- Build the project by `npm run build`.

## License

This package is open sourced under the [MIT License](./LICENSE).

The source code of kissfft is under the [BSD-3-Clause License](./deps/kissfft/COPYING).
