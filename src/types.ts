import { wasm } from "./wasm"

export type Int = number
export type Float32 = number
export type Pointer<T> = number

const BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT  // 4

export interface ComplexNumber {
  real: Float32
  imag: Float32
}

type NumberArray = Float32[] | Float32Array

export abstract class DataArray {
  protected dataPointer: Pointer<Float32> = 0
  protected dataLength: Int = 0

  public get pointer(): Pointer<Float32> {
    return this.dataPointer
  }

  // The instance will become invalid and cannot be used after `free()` is called.
  // Note that all the methods won't check this for performance.
  public free() {
    wasm._free(this.dataPointer)
    this.dataPointer = 0
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

export class RealArray extends DataArray {
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

  public static fromFloat32Array(arr: Float32Array): RealArray {
    const real = new RealArray(arr.length)
    const toSet = new Uint8Array(arr.buffer)
    wasm.HEAPU8.set(toSet, real.dataPointer)
    return real
  }
}

export class ComplexArray extends DataArray {
  constructor(nOrArray: Int | ComplexArray) {
    super()
    if (typeof nOrArray === "number") {
      this.dataLength = 2 * nOrArray
      this.dataPointer = wasm._allocate(this.dataLength)
    } else {
      this.dataLength = nOrArray.dataLength
      this.dataPointer = wasm._copy(nOrArray.pointer, this.dataLength)
    }
  }

  public get length(): Int {
    return this.dataLength / 2
  }

  public realAt(i: number): number {
    return wasm._get_value(this.dataPointer, i * 2)
  }

  public imagAt(i: number): number {
    return wasm._get_value(this.dataPointer, i * 2 + 1)
  }

  public valueAt(i: number): ComplexNumber {
    return {
      real: this.realAt(i),
      imag: this.imagAt(i)
    }
  }

  // The structure of memory:
  // (arr[0], arr[1]) are the real and imaginary part of the first number, respectively.
  public static fromFloat32Array(arr: Float32Array): ComplexArray {
    const complex = new ComplexArray(arr.length / 2)
    const toSet = new Uint8Array(arr.buffer)
    wasm.HEAPU8.set(toSet, complex.dataPointer)
    return complex
  }

  public static fromArray(real: NumberArray, imag?: NumberArray) {
    const n = real.length
    if (imag !== undefined && n !== imag.length) {
      throw new Error(`Inconsistent length of arguments: real=${n} - imag=${imag.length}`)
    }
    const arr = new ComplexArray(n)
    for (let i = 0; i < n; ++i) {
      wasm._set_value(arr.dataPointer, i * 2, real[i])
    }
    if (imag !== undefined) {
      for (let i = 0; i < n; ++i) {
        wasm._set_value(arr.dataPointer, i * 2 + 1, imag[i])
      }
    }
    return arr
  }

  public toRealArray(): Float32Array {
    return Float32Array.from({ length: this.length }).map((_, i) => this.realAt(i))
  }

  public toImagArray(): Float32Array {
    return Float32Array.from({ length: this.length }).map((_, i) => this.imagAt(i))
  }

}

export abstract class KissFFTConfig<T extends DataArray, K extends DataArray> {
  constructor(
    public readonly nfft: Int,
    public readonly inverse: boolean
  ) {}

  abstract get pointer(): Pointer<this>
  abstract free(): void
  abstract work(input: T, output: K): void

  public get valid(): boolean {
    return this.pointer !== 0
  }

  public check(input: T, output: K) {
    if (input.length !== this.nfft) {
      throw new Error("Input or Output length is inconsistent to Config length.")
    }
  }
}
