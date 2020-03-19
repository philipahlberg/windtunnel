import node from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import Module from 'module';
import Package from './package.json';

const external = [
	...Object.keys(Package.dependencies),
	...Module.builtinModules,
];

export default [
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist',
			format: 'es',
		},
		plugins: [
			typescript(),
			node({
				preferBuiltins: true,
			}),
		],
		external,
	},
	{
		input: 'src/cli.ts',
		output: {
			dir: 'dist',
			format: 'es',
			banner: '#!/usr/bin/env node --experimental-modules',
		},
		plugins: [
			typescript(),
			node({
				preferBuiltins: true,
			}),
		],
		external,
	}
];
