import { Int, Pointer, Float32, ConfigPointer } from "./types.js"

export interface WASMModule {
  _kiss_fft_alloc(nfft: Int, inverse: boolean, mem: Int, lenmem: Int): ConfigPointer
  _kiss_fft(cfg: ConfigPointer, fin: Pointer<Float32>, fout: Pointer<Float32>): void

  _kiss_fftnd_alloc(dims: Pointer<Int>, ndims: Int, inverse: boolean, mem: Int, lenmem: Int): ConfigPointer
  _kiss_fftnd(cfg: ConfigPointer, fin: Pointer<Float32>, fout: Pointer<Float32>): void

  _kiss_fftr_alloc(nfft: Int, inverse: boolean, mem: Int, lenmem: Int): ConfigPointer
  _kiss_fftr(cfg: ConfigPointer, timedata: Pointer<Float32>, freqdata: Pointer<Float32>): void
  _kiss_fftri(cfg: ConfigPointer, freqdata: Pointer<Float32>, timedata: Pointer<Float32>): void

  _kiss_fftndr_alloc(dims: Pointer<Int>, ndims: Int, inverse: boolean, mem: Int, lenmem: Int): ConfigPointer
  _kiss_fftndr(cfg: ConfigPointer, timedata: Pointer<Float32>, freqdata: Pointer<Float32>): void
  _kiss_fftndri(cfg: ConfigPointer, freqdata: Pointer<Float32>, timedata: Pointer<Float32>): void

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

export const wasm = (await (await import("./kissfft.cjs")).default()) as WASMModule
