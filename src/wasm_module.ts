import { Int, Float32, Pointer, ComplexNumber } from "./types"
import { wasm } from "./wasm"


export interface WASMModule {
  then(cb: () => void): WASMModule
  cwrap<F>(name: string, outputType: string, inputTypes: string[]): F

  _kiss_fft_alloc(nfft: Int, inverse: boolean, mem: Int, lenmem: Int): Pointer<void>
  _kiss_fft(cfg: Pointer<void>, fin: Pointer<Float32>, fout: Pointer<Float32>): void

  _kiss_fftnd_alloc(dims: Pointer<Int>, ndims: Int, inverse: boolean, mem: Int, lenmem: Int): Pointer<void>
  _kiss_fftnd(cfg: Pointer<void>, fin: Pointer<Float32>, fout: Pointer<Float32>): void

  HEAP32: Int32Array
  HEAPU8: Uint8Array
  HEAPF32: Float32Array

  _allocate(n: Int): Pointer<Float32>
  _copy(arr: Pointer<Float32>, n: Int): Pointer<Float32>
  _get_value(arr: Pointer<Float32>, i: Int): Float32
  _set_value(arr: Pointer<Float32>, i: Int, value: Float32): void
  _scale(arr: Pointer<Float32>, n: Int, scale: Float32): void
  
  _malloc<T>(size: Int): Pointer<T>
  _free<T>(ptr: Pointer<T>): void
}
