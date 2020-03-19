import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { Module, runModule } from './run/index';

const importTestSuite = async (arg: string): Promise<Module> => {
	const file = resolve(arg);
	const url = pathToFileURL(file);
	const mod = await import(url.href);
	return mod;
};

(async () => {
	const arg = process.argv[2];
	const mod = await importTestSuite(arg);
	await runModule(mod);
})();
