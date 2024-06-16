import dts from "rollup-plugin-dts";

export default {
  input: "./types/index.d.ts",
  output: [
    {
      file: "./dist/zodactive-form-svelte.d.ts",
      format: "es",
    },
  ],
  external: [/\.svelte$/],
  plugins: [dts()],
};
