import {
  ComplexArray,
  Int, Pointer,
  KissFFTConfig
} from "./types"

import { wasm } from "./wasm"

export class FFTNDConfig extends KissFFTConfig<ComplexArray> {
  private ptr: Pointer<FFTNDConfig> = 0
  public readonly nfft: Int

  constructor(
    public readonly dims: Int[],
    public readonly inverse: boolean
  ) {
    super()
    const ndims = dims.length
    const dimsPtr = wasm._malloc(Int32Array.BYTES_PER_ELEMENT * ndims)
    dims.forEach((x, i) => {
      wasm.HEAP32[dimsPtr / Int32Array.BYTES_PER_ELEMENT + i] = x
    })
    this.ptr = wasm._kiss_fftnd_alloc(dimsPtr, ndims, inverse, 0, 0)
    this.nfft = dims.reduce((x, y) => x * y)
    wasm._free(dimsPtr)
  }

  public get pointer(): Pointer<FFTNDConfig> {
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
    wasm._kiss_fftnd(this.ptr, input.pointer, output.pointer)
    if (this.inverse) {
      wasm._scale(output.pointer, this.nfft, 1.0 / this.nfft) 
    }
    return output
  }
}
