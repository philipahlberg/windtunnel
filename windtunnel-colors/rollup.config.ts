import type { RollupOptions } from 'rollup';
import common from "../rollup.config.js";
import * as pkg from "./package.json";

const dependencies = Object.keys(pkg.dependencies ?? {});

const options: RollupOptions = {
	...common,
	external: [...common.external, ...dependencies],
};

export default options;
