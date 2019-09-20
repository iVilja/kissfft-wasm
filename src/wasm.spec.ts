import { WASMModule } from "./wasm_module"
import { wasm } from "./wasm"
import { sleep } from "./utils"

test("Simple WASM", async () => {
  await sleep(1500)
  const f = wasm.cwrap<typeof wasm._kiss_fft_alloc>(
    "kiss_fft_alloc", "number", ["number", "boolean", "number", "number"]
  )
  const f2 = wasm.cwrap<typeof wasm._free>("free", "void", ["number"])
  const ptr = f(20, true, 0, 0)
  expect(ptr).not.toBe(0)
  f2(ptr)
  const ptr2 = wasm._kiss_fft_alloc(20, true, 0, 0)
  expect(ptr2).not.toBe(0)
  wasm._free(ptr2)
  const ptr3 = wasm._allocate(4)
  const p = Math.random()
  wasm._set_value(ptr3, 2, p)
  expect(wasm._get_value(ptr3, 2)).toBeCloseTo(p)
  wasm._free(ptr3)
})
