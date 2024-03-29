import { expect, test } from "vitest"

import { RealFFTNDConfig, InverseRealFFTNDConfig } from "./rfftnd.js"
import { RealArray, ComplexArray, Int } from "./types.js"


function testRealNDFFT(dims: Int[]) {
  const n = dims.reduce((x, y) => x * y)
  const arr = Float32Array.from({ length: n }).map(() => Math.random())
  const config = new RealFFTNDConfig(dims)
  const input = RealArray.fromDataArray(arr)
  const output = new ComplexArray(n)
  config.work(input, output)
  const configInverse = new InverseRealFFTNDConfig(dims)
  const outputInverse = new RealArray(n)
  configInverse.work(output, outputInverse)
  outputInverse.asFloat32Array().forEach((x, i) => {
    expect(x).toBeCloseTo(arr[i])
  })
  for (const v of [input, output, outputInverse, config, configInverse]) {
    v.free()
  }
}

test("2D Real FFT", () => {
  testRealNDFFT([5, 4])
})

test("4D Real FFT", () => {
  testRealNDFFT([2, 3, 2, 4])
})
