import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: ["src/index.ts"],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["public"],
      output: {
        dir: "dist",
      },
    },
    assetsDir: "src/assets/",
  },
  base: "./",
});
