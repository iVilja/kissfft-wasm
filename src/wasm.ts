import type { WASMModule } from "./kissfft.cjs"

export const wasm: WASMModule = await (
  await import("./kissfft.cjs")
).default()
