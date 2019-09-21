import { FFTConfig } from "./fft"
import { sleep } from "./utils"
import { ComplexArray } from "./types"

test("1D FFT", async () => {
  await sleep(1500)
  const n = 20
  const arr = Float32Array.from({ length: n * 2 }).map(() => Math.random())
  const config = new FFTConfig(n, false)
  const input = ComplexArray.fromDataArray(arr)
  const output = new ComplexArray(n)
  config.work(input, output)
  const configInverse = new FFTConfig(n, true)
  const outputInverse = new ComplexArray(n)
  configInverse.work(output, outputInverse)
  outputInverse.toFloat32Array().forEach((x, i) => {
    expect(x).toBeCloseTo(arr[i])
  })
  for (const v of [input, output, outputInverse, config, configInverse]) {
    v.free()
  }
})
