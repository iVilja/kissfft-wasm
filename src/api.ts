import {
  DataArray, KissFFTArray, ComplexArray, RealArray,
  KissFFTConfig, Int
} from "./types.js"

import { FFTConfig } from "./fft.js"
import { FFTNDConfig } from "./fftnd.js"
import { RealFFTConfig, InverseRealFFTConfig } from "./rfft.js"
import { RealFFTNDConfig, InverseRealFFTNDConfig } from "./rfftnd.js"

interface ArrayType<T> {
  new(n: Int): T
  fromDataArray(arr: DataArray): T
}

function fftInner<C extends KissFFTConfig<T, K>, T extends KissFFTArray, K extends KissFFTArray>(
  config: C, inputType: ArrayType<T>, outputType: ArrayType<K>, input: DataArray
): Float32Array {
  const inputArray = inputType.fromDataArray(input)
  const outputArray = new outputType(inputArray.length)
  config.work(inputArray, outputArray)
  const output = outputArray.toFloat32Array()
  for (const v of [config, inputArray, outputArray]) {
    v.free()
  }
  return output
}

function makeDims(dims: number | number[], args: IArguments): Int[] {
  return typeof dims === "number" ? Array.from({
    length: args.length - 1
  }).map((_, i) => args[i + 1] as Int) : dims as Int[]
}

// Forward 1D FFT
export function fft(input: DataArray): Float32Array {
  return fftInner(new FFTConfig(input.length / 2 as Int, false), ComplexArray, ComplexArray, input)
}

// Inverse 1D FFT
export function ifft(input: DataArray): Float32Array {
  return fftInner(new FFTConfig(input.length / 2 as Int, true), ComplexArray, ComplexArray, input)
}

// Forward 2D FFT
export function fft2d(input: DataArray, n: number, m: number): Float32Array {
  return fftnd(input, n, m)
}

// Forward ND FFT
export function fftnd(input: DataArray, dims: number[]): Float32Array
export function fftnd(input: DataArray, ...dims: number[]): Float32Array
export function fftnd(input: DataArray, dims: number | number[]): Float32Array {
  const intDims = makeDims(dims, arguments)
  return fftInner(new FFTNDConfig(intDims, false), ComplexArray, ComplexArray, input)
}

// Inverse 2D FFT
export function ifft2d(input: DataArray, n: number, m: number): Float32Array {
  return ifftnd(input, n, m)
}

// Inverse ND FFT
export function ifftnd(input: DataArray, dims: number[]): Float32Array
export function ifftnd(input: DataArray, ...dims: number[]): Float32Array
export function ifftnd(input: DataArray, dims: number | number[]): Float32Array {
  const intDims = makeDims(dims, arguments)
  return fftInner(new FFTNDConfig(intDims, true), ComplexArray, ComplexArray, input)
}

// Forward Real 1D FFT
export function rfft(input: DataArray): Float32Array {
  return fftInner(new RealFFTConfig(input.length as Int), RealArray, ComplexArray, input)
}

// Inverse Real 1D FFT
export function irfft(input: DataArray): Float32Array {
  return fftInner(new InverseRealFFTConfig(input.length / 2 as Int), ComplexArray, RealArray, input)
}

// Forward Real 2D FFT
export function rfft2d(input: DataArray, n: number, m: number): Float32Array {
  return rfftnd(input, n, m)
}

// Forward Real ND FFT
export function rfftnd(input: DataArray, dims: number[]): Float32Array
export function rfftnd(input: DataArray, ...dims: number[]): Float32Array
export function rfftnd(input: DataArray, dims: number | number[]): Float32Array {
  const intDims = makeDims(dims, arguments)
  return fftInner(new RealFFTNDConfig(intDims), RealArray, ComplexArray, input)
}

// Inverse Real 2D FFT
export function irfft2d(input: DataArray, n: number, m: number): Float32Array {
  return fftInner(new InverseRealFFTNDConfig([n, m] as Int[]), ComplexArray, RealArray, input)
}

// Inverse Real ND FFT
export function irfftnd(input: DataArray, dims: number[]): Float32Array
export function irfftnd(input: DataArray, ...dims: number[]): Float32Array
export function irfftnd(input: DataArray, dims: number | number[]): Float32Array {
  const intDims = makeDims(dims, arguments)
  return fftInner(new InverseRealFFTNDConfig(intDims), ComplexArray, RealArray, input)
}
