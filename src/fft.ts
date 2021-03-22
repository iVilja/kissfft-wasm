import {
  ComplexArray,
  Int, Pointer,
  KissFFTConfig
} from "./types"

import { wasm } from "./wasm"

export class FFTConfig extends KissFFTConfig<ComplexArray, ComplexArray> {
  private ptr: Pointer<FFTConfig> = 0

  constructor(
    nfft: Int,
    inverse: boolean
  ) {
    super(nfft, inverse)
    this.ptr = wasm._kiss_fft_alloc(nfft, inverse, 0, 0)
  }

  public get pointer(): Pointer<FFTConfig> {
    return this.ptr
  }

  public free(): void {
    wasm._free(this.ptr)
    this.ptr = 0
  }

  public work(input: ComplexArray, output: ComplexArray): void {
    this.check(input, output)
    wasm._kiss_fft(this.ptr, input.pointer, output.pointer)
    if (this.inverse) {
      wasm._scale(output.pointer, this.nfft * 2, 1.0 / this.nfft) 
    }
  }
}
