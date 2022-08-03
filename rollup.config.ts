import { builtinModules } from "node:module";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export const options = {
	input: "src/index.ts",
	output: {
		dir: "dist",
		format: "esm",
		entryFileNames: "[name].mjs",
	} as const,
	plugins: [
		typescript(),
		resolve({
			preferBuiltins: true,
		}),
	],
	external: builtinModules,
};

export default options;
