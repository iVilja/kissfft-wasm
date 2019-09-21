# Kiss FFT for WebAssembly

Usage:

- Use APIs such as `fft`, `ifft`, etc. (See [API](./src/api.ts))
- For Complex input, note that `(input[2i], input[2i+1])` are the real and imaginary part of the `i+1`-th number, respectively.
- For Real input, use `rfft`, `irfft`, etc.
- If using lower functions, remember to free every class you created after its usage.
