import {
  ComplexArray, KissFFTArray, RealArray, 
  Int, Pointer,
  KissFFTConfig
} from "./types"

import { checkRealFFT } from "./rfft"

import { wasm } from "./wasm"

abstract class AbstractRealFFTNDConfig<
  T extends KissFFTArray, K extends KissFFTArray
> extends KissFFTConfig<T, K> {
  protected ptr: Pointer<this> = 0

  constructor(
    public readonly dims: Int[],
    inverse: boolean
  ) {
    super(dims.reduce((x, y) => x * y), inverse)
    const ndims = dims.length
    checkRealFFT(dims[ndims - 1])
    const dimsPtr = wasm._malloc(Int32Array.BYTES_PER_ELEMENT * ndims)
    dims.forEach((x, i) => {
      wasm.HEAP32[dimsPtr / Int32Array.BYTES_PER_ELEMENT + i] = x
    })
    this.ptr = wasm._kiss_fftndr_alloc(dimsPtr, ndims, inverse, 0, 0)
    wasm._free(dimsPtr)
  }

  public get pointer(): Pointer<this> {
    return this.ptr
  }

  public free(): void {
    wasm._free(this.ptr)
    this.ptr = 0
  }
}

export class RealFFTNDConfig extends AbstractRealFFTNDConfig<RealArray, ComplexArray> {
  constructor(dims: Int[]) {
    super(dims, false)
  }

  public work(input: RealArray, output: ComplexArray): void {
    this.check(input, output)
    wasm._kiss_fftndr(this.ptr, input.pointer, output.pointer)
  }
}

export class InverseRealFFTNDConfig extends AbstractRealFFTNDConfig<ComplexArray, RealArray> {
  constructor(dims: Int[]) {
    super(dims, true)
  }

  public work(input: ComplexArray, output: RealArray): void {
    this.check(input, output)
    wasm._kiss_fftndri(this.ptr, input.pointer, output.pointer)
    wasm._scale(output.pointer, this.nfft, 1.0 / this.nfft) 
  }
}
