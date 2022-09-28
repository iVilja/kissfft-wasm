import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"

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
  ],
})
