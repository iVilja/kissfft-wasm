import { WASMModule } from "./wasm_module"

declare function loadModule(): Promise<WASMModule>

export = loadModule
