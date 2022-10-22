import { ComplexArray, Int, KissFFTConfig, ConfigPointer, Float32 } from "./types.js"

import { wasm } from "./wasm.js"

export class FFTConfig extends KissFFTConfig<ComplexArray, ComplexArray> {
  private ptr = 0 as ConfigPointer

  constructor(nfft: Int, inverse: boolean) {
    super(nfft, inverse)
    this.ptr = wasm._kiss_fft_alloc(nfft, inverse, 0 as Int, 0 as Int)
  }

  public get pointer() {
    return this.ptr
  }

  public free(): void {
    wasm._free(this.ptr)
    this.ptr = 0 as ConfigPointer
  }

  public work(input: ComplexArray, output: ComplexArray): void {
    this.check(input, output)
    wasm._kiss_fft(this.ptr, input.pointer, output.pointer)
    if (this.inverse) {
      wasm._scale(output.pointer, (this.nfft * 2) as Int, (1.0 / this.nfft) as Float32)
    }
  }
}
