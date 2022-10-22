import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
import { viteCommonjs } from "@originjs/vite-plugin-commonjs"

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "../../lib/kissfft.wasm",
          dest: ".",
        },
      ],
    }),
    viteCommonjs(),
  ],
})
