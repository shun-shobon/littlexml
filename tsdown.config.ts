import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/jsx-runtime.ts", "src/jsx-dev-runtime.ts"],
	format: ["cjs", "esm"],
	sourcemap: true,
	dts: true,
});
