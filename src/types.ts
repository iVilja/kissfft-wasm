import { fft } from "./fft"
import { ifft } from "./ifft"

export interface ComplexNumber {
  real: number
  imag: number
}

type InputNumberArray = number[] | Float32Array

export class ComplexArray {
  public data: Float32Array

  constructor(nOrArray: number | ComplexArray) {
    if (typeof nOrArray === "number") {
      this.data = new Float32Array(2 * nOrArray)
    } else {
      this.data = nOrArray.data.slice()
    }
  }

  public get length(): number {
    return this.data.length / 2
  }

  public valueAt(i: number): ComplexNumber {
    return {
      real: this.data[i * 2],
      imag: this.data[i * 2 + 1]
    }
  }

  public realAt(i: number): number {
    return this.data[i * 2]
  }

  public imagAt(i: number): number {
    return this.data[i * 2 + 1]
  }

  public static fromArray(realOrComplex: InputNumberArray | ComplexNumber[], imag?: InputNumberArray) {
    const n = realOrComplex.length
    if (imag !== undefined && n !== imag.length) {
      throw new Error(`Inconsistent length of arguments: real=${n} - imag=${imag.length}`)
    }
    const ca = new ComplexArray(n)
    if (n > 0 && typeof realOrComplex[0] === "number") {
      const real = realOrComplex as number[]
      for (let i = 0; i < n; ++i) {
        ca.data[i * 2] = real[i]
      }
      if (imag !== undefined) {
        for (let i = 0; i < n; ++i) {
          ca.data[i * 2 + 1] = imag[i]
        }
      }
    } else {
      const complex = realOrComplex as ComplexNumber[]
      for (let i = 0; i < n; ++i) {
        ca.data[i * 2] = complex[i].real
        ca.data[i * 2 + 1] = complex[i].imag
      }
    }
    return ca
  }

  public async fft(): Promise<ComplexArray> {
    return fft(this)
  }

  public async ifft(): Promise<ComplexArray> {
    return ifft(this)
  }

  public toRealArray(): Float32Array {
    return Float32Array.from({ length: this.length }).map((_, i) => this.realAt(i))
  }

  public toImagArray(): Float32Array {
    return Float32Array.from({ length: this.length }).map((_, i) => this.imagAt(i))
  }
}
