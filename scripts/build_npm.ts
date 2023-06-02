import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

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
    version: "0.5.0",
    // x-release-please-end
    description: "1kB XML library for Node.js, Deno, Browser, Edge runtime.",
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
