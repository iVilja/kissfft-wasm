import { WASMModule } from "./wasm_module"

import loadModule = require("./kissfft")

export let wasm: WASMModule

const _loading = loadModule().then((x) => void (wasm = x))

export function assertWASM(): void {
  if (wasm === undefined) {
    throw new Error("WASM is not loaded.")
  }
}

export const waitLoading = async (): Promise<void> => {
  await _loading
  assertWASM()
}
