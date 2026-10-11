import { defineConfig } from "vitest/config";

export default defineConfig({
	oxc: {
		jsx: { throwIfNamespace: false },
	},
	resolve: {
		// Resolves the `jsxImportSource` in tsconfig.json to the local source.
		tsconfigPaths: true,
	},
});
