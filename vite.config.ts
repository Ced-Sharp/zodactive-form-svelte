import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ZodactiveFormSvelte",
      fileName: (format) =>
        format === "es"
          ? "zodactive-form-svelte.js"
          : `zodactive-form-svelte.${format}.js`,
    },
    rollupOptions: {
      external: ["svelte", "svelte/internal", "zod", "@zodactive-form/core"],
      output: {
        globals: {
          "@zodactive-form/core": "@zodactive-form/core",
          svelte: "svelte",
          "svelte/internal": "svelte/internal",
          zod: "zod",
        },
      },
    },
  },
});
