import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { timeModule, TimeModule, TimeResult, TimeReport } from '@windtunnel/core';

const importModule = async (arg: string): Promise<TimeModule> => {
	const file = resolve(arg);
	const url = pathToFileURL(file);
	const mod = await import(url.href);
	return mod;
};

const reportResults = (report: TimeReport) => {
	console.log('');

	for (const result of report.results) {
		reportResult(result);
	}
};

const reportResult = (result: TimeResult) => {
	const nanoseconds = result.mean;
	const microseconds = nanoseconds / 1_000n;
	const milliseconds = microseconds / 1_000n;
	const seconds = Number(milliseconds) / 1_000;
	const hertz = (1 / seconds);
	const rme = result.relativeMarginOfError;
	const size = result.sample.length;
	console.log(`${result.name}: ${hertz.toFixed(hertz < 100 ? 2 : 0)} ops/sec ± ${rme.toFixed(2)}% (${size} run${size === 1 ? '' : 's'} sampled)`);
};

interface Args {
	path: string,
}

const parseArgs = (args: string[]): Args => {
	let path: string | undefined;
	for (const arg of args) {
		if (arg.startsWith('--')) {
			console.error('Unexpected option:');
			console.error(arg);
			console.error('help: invoke with --help to see options');
		} else if (path !== undefined) {
			console.error('Unexpected argument:');
			console.error(arg);
			console.error('help: invoke with --help to see options');
		} else {
			path = arg;
		}
	}

	if (path !== undefined) {
		return {
			path,
		}
	} else {
		console.error('Missing required argument `path`');
		console.error('help: invoke with --help to see options');
		process.exit(1);
	}
};

export const time = async (args: string[]) => {
	const options = parseArgs(args);
	const mod = await importModule(options.path);
	const report = timeModule(mod, { now: () => process.hrtime.bigint() });
	reportResults(report);
};
