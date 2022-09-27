import { WASMModule } from "./wasm_module.js"

export let wasm: WASMModule

const loadModule = async () => {
  const mod = await import("./kissfft")
  wasm = await mod.default()
}

const _loading = loadModule()

export function assertWASM(): void {
  if (wasm === undefined) {
    throw new Error("WASM is not loaded.")
  }
}

export const waitLoading = async (): Promise<void> => {
  await _loading
  assertWASM()
}
