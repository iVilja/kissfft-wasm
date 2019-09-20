import { WASMModule } from "./wasm_module"

declare function loadModule(): WASMModule

export = loadModule
