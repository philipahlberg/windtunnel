import { builtinModules } from "node:module";
// import type { RollupOptions } from 'rollup';
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

// export interface Package {
// 	name: string;
// 	version: string;
// 	author: string;
// 	type: string;
// 	main: string;
// 	types: string;
// 	bin?: Record<string, string>,
// 	dependencies?: Record<string, string>,
// }

// export const createConfig = (pkg: Package): RollupOptions => ({
// 	input: "src/index.ts",
// 	output: {
// 		dir: "dist",
// 		format: "esm",
// 		entryFileNames: "[name].mjs",
// 		banner: pkg.bin !== undefined
// 			? "#!/usr/bin/env node"
// 			: undefined,
// 	},
// 	plugins: [
// 		typescript(),
// 		resolve({ preferBuiltins: true }),
// 	],
// 	external: [
// 		...builtinModules,
// 		...Object.keys(pkg.dependencies ?? {}),
// 	]
// });

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
