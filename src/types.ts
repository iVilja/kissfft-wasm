import { fft } from "./fft"
import { ifft } from "./ifft"

export interface ComplexNumber {
  real: number
  imag: number
}

type InputNumberArray = number[] | Float32Array

export class ComplexArray {
  public data: Float32Array

  constructor(N_or_array: number | ComplexArray) {
    if (typeof N_or_array === 'number') {
      this.data = new Float32Array(2 * N_or_array)
    } else {
      this.data = N_or_array.data.slice()
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

  static fromArray(real_or_complex: InputNumberArray | Array<ComplexNumber>, imag?: InputNumberArray) {
    const n = real_or_complex.length
    if (imag !== undefined && n !== imag.length) {
      throw new Error(`Inconsistent length of arguments: real=${n} - imag=${imag.length}`)
    }
    const ca = new ComplexArray(n)
    if (n > 0 && typeof real_or_complex[0] === 'number') {
      const real = real_or_complex as number[]
      for (let i = 0; i < n; ++i) {
        ca.data[i * 2] = real[i]
      }
      if (imag !== undefined) {
        for (let i = 0; i < n; ++i) {
          ca.data[i * 2 + 1] = imag[i]
        }
      }
    } else {
      const complex = real_or_complex as Array<ComplexNumber>
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
