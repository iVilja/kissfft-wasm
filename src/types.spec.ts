import { ComplexArray, ComplexNumber } from "./types"

test("Basic types", () => {
  const n = 20
  new ComplexArray(n).data.forEach((x) => {
    expect(x).toBe(0)
  })
  const a = new Float32Array(n).map(() => Math.random())
  const b = new Float32Array(n).map(() => Math.random())
  const ca = ComplexArray.fromArray(a, b)
  expect(ca.length).toBe(n)
  const ca2 = new ComplexArray(ca)
  const ca3 = ComplexArray.fromArray(Array.from(
    { length: n }
  ).map((_, i) => {
    return {
      real: a[i],
      imag: b[i]
    }
  }))
  ca.data.forEach((x, i) => {
    expect(x).toBe(ca2.data[i])
    expect(x).toBe(ca3.data[i])
  })
  for (let i = 0; i < n; ++i) {
    const x = ca.valueAt(i)
    expect(ca2.valueAt(i)).toEqual(x)
    expect(x.real).toBe(a[i])
    expect(x.imag).toBe(b[i])
  }
  expect(ca.toRealArray()).toEqual(a)
  expect(ca.toImagArray()).toEqual(b)
})
