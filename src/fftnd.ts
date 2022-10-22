import { ComplexArray, Int, KissFFTConfig, ConfigPointer, Float32 } from "./types.js"

import { wasm } from "./wasm.js"

export class FFTNDConfig extends KissFFTConfig<ComplexArray, ComplexArray> {
  private ptr = 0 as ConfigPointer

  constructor(public readonly dims: readonly Int[], inverse: boolean) {
    super(
      dims.reduce((x, y) => (x * y) as Int),
      inverse
    )
    const ndims = dims.length as Int
    const dimsPtr = wasm._malloc<Int>((Int32Array.BYTES_PER_ELEMENT * ndims) as Int)
    dims.forEach((x, i) => {
      wasm.HEAP32[dimsPtr / Int32Array.BYTES_PER_ELEMENT + i] = x
    })
    this.ptr = wasm._kiss_fftnd_alloc(dimsPtr, ndims, inverse, 0 as Int, 0 as Int)
    wasm._free(dimsPtr)
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
    wasm._kiss_fftnd(this.ptr, input.pointer, output.pointer)
    if (this.inverse) {
      wasm._scale(output.pointer, (this.nfft * 2) as Int, (1.0 / this.nfft) as Float32)
    }
  }
}
