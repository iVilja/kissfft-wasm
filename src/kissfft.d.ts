import { WASMModule } from "./wasm_module.js"

declare const loadModule: () => Promise<WASMModule>

export default loadModule
