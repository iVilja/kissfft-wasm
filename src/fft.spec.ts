import { FFTConfig } from "./fft"
import { sleep } from "./utils"
import { ComplexArray } from "./types"

test("Basic 1D FFT", async () => {
  await sleep(1500)
  const n = 20
  const arr = Float32Array.from({ length: n * 2 }).map(() => Math.random())
  const config = new FFTConfig(n, false)
  const input = ComplexArray.fromFloat32Array(arr)
  const output = config.work(input)
  const configInverse = new FFTConfig(n, true)
  const outputInverse = configInverse.work(output)
  outputInverse.toFloat32Array().forEach((x, i) => {
    expect(x).toBeCloseTo(arr[i])
  })
  for (const v of [input, output, outputInverse, config, configInverse]) {
    v.free()
  }
})
