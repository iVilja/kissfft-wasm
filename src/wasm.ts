import { WASMModule } from "./wasm_module"

import loadModule = require("./kissfft")

export const wasm = loadModule()
