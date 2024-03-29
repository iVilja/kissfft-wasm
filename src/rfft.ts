import { ComplexArray, KissFFTArray, RealArray, Int, KissFFTConfig, ConfigPointer, Float32 } from "./types.js"

import { wasm } from "./wasm.js"

export function checkRealFFT(nfft: Int): void {
  if (nfft % 2 === 1) {
    throw new Error("Real FFT optimization must be even.")
  }
}

abstract class AbstractRealFFTConfig<T extends KissFFTArray, K extends KissFFTArray> extends KissFFTConfig<
  T,
  K
> {
  protected ptr = 0 as ConfigPointer

  constructor(nfft: Int, inverse: boolean) {
    super(nfft, inverse)
    checkRealFFT(nfft)
    this.ptr = wasm._kiss_fftr_alloc(nfft, inverse, 0 as Int, 0 as Int)
  }

  public get pointer() {
    return this.ptr
  }

  public free(): void {
    wasm._free(this.ptr)
    this.ptr = 0 as ConfigPointer
  }
}

export class RealFFTConfig extends AbstractRealFFTConfig<RealArray, ComplexArray> {
  constructor(nfft: Int) {
    super(nfft, false)
  }

  public work(input: RealArray, output: ComplexArray): void {
    this.check(input, output)
    wasm._kiss_fftr(this.ptr, input.pointer, output.pointer)
  }
}

export class InverseRealFFTConfig extends AbstractRealFFTConfig<ComplexArray, RealArray> {
  constructor(nfft: Int) {
    super(nfft, true)
  }

  public work(input: ComplexArray, output: RealArray): void {
    this.check(input, output)
    wasm._kiss_fftri(this.ptr, input.pointer, output.pointer)
    wasm._scale(output.pointer, this.nfft, (1.0 / this.nfft) as Float32)
  }
}
