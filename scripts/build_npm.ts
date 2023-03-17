import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: {
      test: "dev",
    },
  },
  compilerOptions: {
    lib: ["dom", "esnext"],
  },
  package: {
    name: "@shun-shobon/littlexml",
    // x-release-please-start-version
    version: "0.4.0",
    // x-release-please-end
    description: "A small and simple XML builder for JavaScript/TypeScript.",
    license: "MIT",
    main: "./script/mod.js",
    unpkg: "./esm/mod.js",
    repository: {
      type: "git",
      url: "git+https://github.com/shun-shobon/littlexml.git",
    },
    sideEffects: false,
    keywords: [
      "xml",
      "builder",
      "utility",
    ],
  },
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
