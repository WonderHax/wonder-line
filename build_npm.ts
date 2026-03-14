// build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./linejs/packages/linejs/client/login.ts"],
  outDir: "./npm",

  // ★ import map を完全に無効化
  importMap: undefined,
  importMapPath: undefined,
  compilerOptions: {
    importMap: undefined,
  },

  // ★ テストファイルを完全に除外
  exclude: [
    "**/*.test.ts",
    "**/*.test.js",
    "**/test/**",
    "**/tests/**",
  ],

  shims: {
    deno: true,
  },

  package: {
    name: "wonder-line",
    version: "1.0.0",
    description: "Node.js compatible build of wonder-line",
    license: "MIT",
  },
});