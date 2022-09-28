import type { WASMModule } from "./kissfft.cjs"
// import * as kissfft from "./kissfft.cjs"

export const wasm: WASMModule = await (
  await import("./kissfft.cjs")
).default()
