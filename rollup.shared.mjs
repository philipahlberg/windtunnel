import { builtinModules } from "node:module";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export const createConfig = (pkg) => ({
	input: "src/index.ts",
	output: {
		dir: "dist",
		format: "esm",
		entryFileNames: "[name].mjs",
		banner: pkg.bin !== undefined
			? "#!/usr/bin/env node"
			: undefined,
	},
	plugins: [
		typescript(),
		resolve({ preferBuiltins: true }),
	],
	external: [
		...builtinModules,
		...Object.keys(pkg.dependencies ?? {}),
	]
});
