import { FFTNDConfig } from "./fftnd"
import { sleep } from "./utils"
import { ComplexArray, Int } from "./types"


function testNDFFT(dims: Int[]) {
  const n = dims.reduce((x, y) => x * y)
  const arr = Float32Array.from({ length: n * 2 }).map(() => Math.random())
  const config = new FFTNDConfig(dims, false)
  const input = ComplexArray.fromFloat32Array(arr)
  const output = new ComplexArray(n)
  config.work(input, output)
  const configInverse = new FFTNDConfig(dims, true)
  const outputInverse = new ComplexArray(n)
  configInverse.work(output, outputInverse)
  outputInverse.asFloat32Array().forEach((x, i) => {
    expect(x).toBeCloseTo(arr[i])
  })
  for (const v of [input, output, outputInverse, config, configInverse]) {
    v.free()
  }
}

test("2D FFT", async () => {
  await sleep(1500)
  testNDFFT([5, 4])
})

test("4D FFT", async () => {
  await sleep(1500)
  testNDFFT([2, 3, 2, 5])
})
