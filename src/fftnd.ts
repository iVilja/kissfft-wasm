import {
  ComplexArray,
  Int, Pointer,
  KissFFTConfig
} from "./types"

import { wasm } from "./wasm"

export class FFTNDConfig extends KissFFTConfig<ComplexArray, ComplexArray> {
  private ptr: Pointer<FFTNDConfig> = 0

  constructor(
    public readonly dims: Int[],
    inverse: boolean
  ) {
    super(dims.reduce((x, y) => x * y), inverse)
    const ndims = dims.length
    const dimsPtr = wasm._malloc(Int32Array.BYTES_PER_ELEMENT * ndims)
    dims.forEach((x, i) => {
      wasm.HEAP32[dimsPtr / Int32Array.BYTES_PER_ELEMENT + i] = x
    })
    this.ptr = wasm._kiss_fftnd_alloc(dimsPtr, ndims, inverse, 0, 0)
    wasm._free(dimsPtr)
  }

  public get pointer(): Pointer<FFTNDConfig> {
    return this.ptr
  }

  public free(): void {
    wasm._free(this.ptr)
    this.ptr = 0
  }

  public work(input: ComplexArray, output: ComplexArray): void {
    this.check(input, output)
    wasm._kiss_fftnd(this.ptr, input.pointer, output.pointer)
    if (this.inverse) {
      wasm._scale(output.pointer, this.nfft * 2, 1.0 / this.nfft) 
    }
  }
}
