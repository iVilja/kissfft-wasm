import { wasm } from "./wasm.js"

export type Int = number & { __int__: never }
export type Float32 = number & { __float32__: never }
export type Pointer<T> = number & { __pointer__: T }
export type ConfigPointer = Pointer<"config">

const NULLPTR_F32 = 0 as Pointer<Float32>
const BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT  // 4

export interface ComplexNumber {
  real: Float32
  imag: Float32
}

export type DataArray = Float32[] | Float32Array

export abstract class KissFFTArray {
  protected dataPointer = NULLPTR_F32
  protected dataLength = 0 as Int

  public get pointer(): Pointer<Float32> {
    return this.dataPointer
  }

  // The instance will become invalid and cannot be used after `free()` is called.
  // Note that all the methods won't check this for performance.
  public free(): void {
    wasm._free(this.dataPointer)
    this.dataPointer = NULLPTR_F32
  }

  public get valid(): boolean {
    return this.dataPointer !== 0
  }

  public asFloat32Array(): Float32Array {
    const f32p = this.dataPointer / BYTES_PER_ELEMENT
    return wasm.HEAPF32.subarray(f32p, f32p + this.dataLength)
  }

  // The data is copied.
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.asFloat32Array())
  }

  abstract get length(): Int
}

export class RealArray extends KissFFTArray {
  constructor(nOrArray: Int | RealArray) {
    super()
    if (typeof nOrArray === "number") {
      this.dataLength = nOrArray
      this.dataPointer = wasm._allocate(this.dataLength)
    } else {
      this.dataLength = nOrArray.dataLength
      this.dataPointer = wasm._copy(nOrArray.pointer, this.dataLength)
    }
  }

  public get length(): Int {
    return this.dataLength
  }

  public static fromDataArray(arr: DataArray): RealArray {
    return RealArray.fromArray(arr)
  }

  public static fromArray(arr: DataArray): RealArray {
    const real = new RealArray(arr.length as Int)
    wasm.HEAPF32.set(arr, real.dataPointer / BYTES_PER_ELEMENT)
    return real
  }
}

export class ComplexArray extends KissFFTArray {
  constructor(nOrArray: Int | ComplexArray) {
    super()
    if (typeof nOrArray === "number") {
      this.dataLength = 2 * nOrArray as Int
      this.dataPointer = wasm._allocate(this.dataLength)
    } else {
      this.dataLength = nOrArray.dataLength
      this.dataPointer = wasm._copy(nOrArray.pointer, this.dataLength)
    }
  }

  public get length(): Int {
    return this.dataLength / 2 as Int
  }

  public realAt(i: Int): Float32 {
    return wasm._get_value(this.dataPointer, i * 2 as Int)
  }

  public imagAt(i: Int): Float32 {
    return wasm._get_value(this.dataPointer, i * 2 + 1 as Int)
  }

  public valueAt(i: Int): ComplexNumber {
    return {
      real: this.realAt(i),
      imag: this.imagAt(i)
    }
  }

  // The structure of memory:
  // (arr[0], arr[1]) are the real and imaginary part of the first number, respectively.
  public static fromDataArray(arr: DataArray): ComplexArray {
    if (arr.length % 2 === 1) {
      throw new Error("Array length must be even.")
    }
    const complex = new ComplexArray(arr.length / 2 as Int)
    wasm.HEAPF32.set(arr, complex.dataPointer / BYTES_PER_ELEMENT)
    return complex
  }

  public static fromArray(real: DataArray, imag?: DataArray): ComplexArray {
    const n = real.length
    if (imag !== undefined && n !== imag.length) {
      throw new Error(`Inconsistent length of arguments: real=${n} - imag=${imag.length}`)
    }
    const arr = new ComplexArray(n as Int)
    for (let i = 0; i < n; ++i) {
      wasm._set_value(arr.dataPointer, i * 2 as Int, real[i] as Float32)
    }
    if (imag !== undefined) {
      for (let i = 0; i < n; ++i) {
        wasm._set_value(arr.dataPointer, i * 2 + 1 as Int, imag[i] as Float32)
      }
    }
    return arr
  }

  public toRealArray(): Float32Array {
    return Float32Array.from({ length: this.length }).map((_, i) => this.realAt(i as Int))
  }

  public toImagArray(): Float32Array {
    return Float32Array.from({ length: this.length }).map((_, i) => this.imagAt(i as Int))
  }

}

export abstract class KissFFTConfig<T extends KissFFTArray, K extends KissFFTArray> {
  constructor(
    public readonly nfft: Int,
    public readonly inverse: boolean
  ) {
  }

  abstract get pointer(): ConfigPointer
  abstract free(): void
  abstract work(input: T, output: K): void

  public get valid(): boolean {
    return this.pointer !== 0 as ConfigPointer
  }

  public check(input: T, output: K): void {
    if (input.length !== this.nfft || output.length !== this.nfft) {
      throw new Error("Input or Output length is inconsistent to Config length.")
    }
  }
}
