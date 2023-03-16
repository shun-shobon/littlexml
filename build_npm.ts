import { build, emptyDir } from "./dev_deps.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: {
      test: true,
    },
  },
  package: {
    name: "@shun-shobon/littlexml",
    // x-release-please-start-version
    version: "1.0.0",
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
