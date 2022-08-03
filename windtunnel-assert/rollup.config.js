import common from "../rollup.config.js";
import pkg from "./package.json";

const dependencies = Object.keys(pkg.dependencies ?? {});

export default {
	...common,
	external: [...common.external, ...dependencies],
};
