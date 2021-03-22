import { ComplexArray, RealArray } from "./types"
import { waitLoading } from "./wasm"

test("Complex Array", async () => {
  await waitLoading()
  const n = 20
  const zeros = new ComplexArray(n)
  for (let i = 0; i < n; ++i) {
    expect(zeros.realAt(i)).toBe(0)
    expect(zeros.imagAt(i)).toBe(0)
  }
  expect(zeros.valid).toBe(true)
  zeros.free()
  expect(zeros.valid).toBe(false)
  const real = new Float32Array(n).map(() => Math.random())
  const imag = new Float32Array(n).map(() => Math.random())
  const ca = ComplexArray.fromArray(real, imag)
  expect(ca.length).toBe(n)
  const ca2 = new ComplexArray(ca)
  const f32s = ca.toFloat32Array()
  const ca3 = ComplexArray.fromDataArray(f32s)
  for (let i = 0; i < n; ++i) {
    const x = ca.valueAt(i)
    expect(x).toEqual(ca2.valueAt(i))
    expect(x).toEqual(ca3.valueAt(i))
    expect(x.real).toBe(f32s[i * 2])
    expect(x.imag).toBe(f32s[i * 2 + 1])
    expect(x.real).toBe(real[i])
    expect(x.imag).toBe(imag[i])
  }
  expect(ca.toRealArray()).toEqual(real)
  expect(ca.toImagArray()).toEqual(imag)
  ca.free()
  ca2.free()
  ca3.free()
})

test("Real Array", async () => {
  await waitLoading()
  const n = 20
  const zeros = new RealArray(n)
  zeros.asFloat32Array().forEach((x) => {
    expect(x).toBe(0)
  })
  expect(zeros.valid).toBe(true)
  zeros.free()
  expect(zeros.valid).toBe(false)
  const real = new Float32Array(n).map(() => Math.random())
  const arr = RealArray.fromArray(real)
  expect(arr.length).toBe(n)
  arr.asFloat32Array().forEach((x, i) => {
    expect(x).toBe(real[i])
  })
  arr.free()
})
