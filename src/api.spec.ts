import {
  fft, fft2d, fftnd, rfft, rfft2d, rfftnd,
  ifft, ifft2d, ifftnd, irfft, irfft2d, irfftnd
} from "./api"

import { waitLoading } from "./wasm"

function compareArrays(a: Float32Array, b: Float32Array) {
  expect(a.length).toBe(b.length)
  a.forEach((x, i) => {
    expect(x).toBeCloseTo(b[i])
  })
}

test("FFT APIs", async () => {
  await waitLoading()
  const n = 20
  const arr = Float32Array.from({ length: n * 2 }).map(() => Math.random())

  compareArrays(ifft(fft(arr)), arr)
  compareArrays(ifft2d(fft2d(arr, 4, 5), 4, 5), arr)
  compareArrays(ifftnd(fftnd(arr, 2, 5, 2), [2, 5, 2]), arr)

  compareArrays(irfft(rfft(arr)), arr)
  compareArrays(irfft2d(rfft2d(arr, 5, 8), 5, 8), arr)
  compareArrays(irfftnd(rfftnd(arr, [5, 2, 4]), 5, 2, 4), arr)
})
