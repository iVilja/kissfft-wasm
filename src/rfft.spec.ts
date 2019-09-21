import { RealFFTConfig, InverseRealFFTConfig } from "./rfft"
import { sleep } from "./utils"
import { RealArray, ComplexArray } from "./types"

test("1D Real FFT", async () => {
  await sleep(1500)
  const n = 20
  const arr = Float32Array.from({ length: n }).map(() => Math.random())
  const config = new RealFFTConfig(n)
  const input = RealArray.fromFloat32Array(arr)
  const output = new ComplexArray(n)
  config.work(input, output)
  const configInverse = new InverseRealFFTConfig(n)
  const outputInverse = new RealArray(n)
  configInverse.work(output, outputInverse)
  outputInverse.asFloat32Array().forEach((x, i) => {
    expect(x).toBeCloseTo(arr[i])
  })
  expect(() => new RealFFTConfig(19)).toThrow()
  for (const v of [input, output, outputInverse, config, configInverse]) {
    v.free()
  }
})
