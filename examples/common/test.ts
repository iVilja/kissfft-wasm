import { fft, fft2d, fftnd, ifft, ifft2d, ifftnd, irfft, irfft2d, irfftnd, rfft, rfft2d, rfftnd } from "../../lib/index.js"
import type { Int } from "../../lib/index.js"

const doTest = (fn: () => void, n = 10000): number => {
  const start = +new Date()
  for (let i = 0; i < n; i++) {
    fn()
  }
  const end = +new Date()
  return (end - start) / n
}

export const testRFFT = (n: Int, numffts = 10000): string[] => {
  const logs = [`rfft(${n}) × ${numffts}`]
  const input = Float32Array.from({ length: n }).map(() => Math.random())
  const output = rfft(input)
  const time = doTest(() => rfft(input), numffts)
  logs.push(`  ${time} ms/fft`)
  logs.push(`irfft(${n}) × ${numffts}`)
  const timeI = doTest(() => irfft(output), numffts)
  logs.push(`  ${timeI} ms/fft`)
  return logs
}

export const testRFFT2D = (dims: [Int, Int], numffts = 10000): string[] => {
  const logs = [`rfft2d(${dims.join(" × ")}) × ${numffts}`]
  const n = dims.reduce((x, y) => x * y)
  const input = Float32Array.from({ length: n }).map(() => Math.random())
  const output = rfft2d(input, ...dims)
  const time = doTest(() => rfft2d(input, ...dims), numffts)
  logs.push(`  ${time} ms/fft`)
  logs.push(`irfft2d(${dims.join(" × ")}) × ${numffts}`)
  const timeI = doTest(() => irfft2d(output, ...dims), numffts)
  logs.push(`  ${timeI} ms/fft`)
  return logs
}

export const testRFFTND = (dims: Int[], numffts = 10000): string[] => {
  const logs = [`rfftnd(${dims.join(" × ")}) × ${numffts}`]
  const n = dims.reduce((x, y) => x * y)
  const input = Float32Array.from({ length: n }).map(() => Math.random())
  const output = rfftnd(input, dims)
  const time = doTest(() => rfftnd(input, dims), numffts)
  logs.push(`  ${time} ms/fft`)
  logs.push(`irfft2d(${dims.join(" × ")}) × ${numffts}`)
  const timeI = doTest(() => irfftnd(output, dims), numffts)
  logs.push(`  ${timeI} ms/fft`)
  return logs
}

export const testFFT = (n: Int, numffts = 10000): string[] => {
  const logs = [`fft(${n}) × ${numffts}`]
  const input = Float32Array.from({ length: n * 2 }).map(() => Math.random())
  const output = fft(input)
  const time = doTest(() => fft(input), numffts)
  logs.push(`  ${time} ms/fft`)
  logs.push(`ifft(${n}) × ${numffts}`)
  const timeI = doTest(() => ifft(output), numffts)
  logs.push(`  ${timeI} ms/fft`)
  return logs
}

export const testFFT2D = (dims: [Int, Int], numffts = 10000): string[] => {
  const logs = [`fft2d(${dims.join(" × ")}) × ${numffts}`]
  const n = dims.reduce((x, y) => x * y)
  const input = Float32Array.from({ length: n * 2 }).map(() => Math.random())
  const output = fft2d(input, ...dims)
  const time = doTest(() => fft2d(input, ...dims), numffts)
  logs.push(`  ${time} ms/fft`)
  logs.push(`ifft2d(${dims.join(" × ")}) × ${numffts}`)
  const timeI = doTest(() => ifft2d(output, ...dims), numffts)
  logs.push(`  ${timeI} ms/fft`)
  return logs
}

export const testFFTND = (dims: Int[], numffts = 10000): string[] => {
  const logs = [`fftnd(${dims.join(" × ")}) × ${numffts}`]
  const n = dims.reduce((x, y) => x * y)
  const input = Float32Array.from({ length: n * 2 }).map(() => Math.random())
  const output = fftnd(input, dims)
  const time = doTest(() => fftnd(input, dims), numffts)
  logs.push(`  ${time} ms/fft`)
  logs.push(`ifftnd(${dims.join(" × ")}) × ${numffts}`)
  const timeI = doTest(() => ifftnd(output, dims), numffts)
  logs.push(`  ${timeI} ms/fft`)
  return logs
}

export function *testAll(numffts = 10000): Generator<string | string[]> {
  yield "Testing rfft & irfft..."
  yield testRFFT(1024, numffts)
  yield "Testing rfft2d & irfft2d..."
  yield testRFFT2D([16, 64], numffts)
  yield "Testing rfftnd & irfftnd..."
  yield testRFFTND([8, 16, 64], numffts)
  yield "Testing fft & ifft..."
  yield testFFT(1024, numffts)
  yield "Testing fft2d & ifft2d..."
  yield testFFT2D([16, 64], numffts)
  yield "Testing fftnd & ifftnd..."
  yield testFFTND([8, 16, 64], numffts)
}