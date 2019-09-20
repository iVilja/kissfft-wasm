import { WASMModule } from "./wasm_module"
import { wasm } from "./wasm"

const testWASM = async (done: () => void) => {
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
  done()
}

test("Simple WASM", () => new Promise((done) => {
  setTimeout(() => testWASM(done), 2000)
}))

