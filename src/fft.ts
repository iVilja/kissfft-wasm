import {
  ComplexArray,
  Int, Pointer,
  KissFFTConfig
} from "./types"

import { wasm } from "./wasm"

export class FFTConfig extends KissFFTConfig<ComplexArray> {
  private ptr: Pointer<FFTConfig> = 0

  constructor(
    public readonly nfft: Int,
    public readonly inverse: boolean
  ) {
    super()
    this.ptr = wasm._kiss_fft_alloc(nfft, inverse, 0, 0)
  }

  public get pointer(): Pointer<FFTConfig> {
    return this.ptr
  }

  public free() {
    wasm._free(this.ptr)
    this.ptr = 0
  }

  public work(input: ComplexArray): ComplexArray {
    if (input.length !== this.nfft) {
      throw new Error("Input length is inconsistent to Config length.")
    }
    const output = new ComplexArray(this.nfft)
    wasm._kiss_fft(this.ptr, input.pointer, output.pointer)
    if (this.inverse) {
      wasm._scale(output.pointer, this.nfft, 1.0 / this.nfft) 
    }
    return output
  }

}
