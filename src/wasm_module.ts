import { Int, Float32, Pointer, ComplexNumber } from "./types"
import { wasm } from "./wasm"


export interface WASMModule {
  then(cb: () => void): WASMModule
  cwrap<F>(name: string, outputType: string, inputTypes: string[]): F

  _kiss_fft_alloc(nfft: Int, inverse: boolean, mem: Int, lenmem: Int): Pointer<void>
  _kiss_fft(cfg: Pointer<void>, fin: Pointer<Float32>, fout: Pointer<Float32>): void

  HEAPU8: Uint8Array

  _allocate(n: Int): Pointer<Float32>
  _copy(arr: Pointer<Float32>, n: Int): Pointer<Float32>
  _get_value(arr: Pointer<Float32>, i: Int): Float32
  _set_value(arr: Pointer<Float32>, i: Int, value: Float32): void
  
  _free<T>(ptr: Pointer<T>): void
}
