import { wasm } from "./wasm"

export type Int = number
export type Float32 = number
export type Pointer<T> = number

const BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT  // 4

export interface ComplexNumber {
  real: Float32
  imag: Float32
}

export type RealArray = Float32Array

type NumberArray = Float32[] | RealArray

export class ComplexArray {
  private dataPointer: Pointer<Float32> = 0
  private dataLength: Int = 0

  constructor(nOrArray: Int | ComplexArray) {
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

  public get pointer(): Pointer<Float32> {
    return this.dataPointer
  }

  public get valid(): boolean {
    return this.dataPointer !== 0
  }

  // The instance will become invalid and cannot be used after `free()` is called.
  // Note that all the methods won't check this for performance.
  public free() {
    wasm._free(this.dataPointer)
    this.dataPointer = 0
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
  // (complex[0], complex[1]) are the real and imaginary part of the first number, respectively.
  public static fromFloat32Array(complex: Float32Array): ComplexArray {
    const arr = new ComplexArray(complex.length / 2)
    const toSet = new Uint8Array(complex.buffer)
    wasm.HEAPU8.set(toSet, arr.dataPointer)
    return arr
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

  // The data is copied.
  public toFloat32Array(): Float32Array {
    const f32p = this.dataPointer / BYTES_PER_ELEMENT
    return new Float32Array(wasm.HEAPF32.subarray(f32p, f32p + this.dataLength))
  }


  public toRealArray(): RealArray {
    return Float32Array.from({ length: this.length }).map((_, i) => this.realAt(i))
  }

  public toImagArray(): RealArray {
    return Float32Array.from({ length: this.length }).map((_, i) => this.imagAt(i))
  }

}

export abstract class KissFFTConfig<T extends ComplexArray | RealArray> {
  abstract readonly inverse: boolean
  abstract get pointer(): Pointer<this>
  public get valid(): boolean {
    return this.pointer !== 0
  }
  abstract free(): void
  abstract work(input: T): T
}
