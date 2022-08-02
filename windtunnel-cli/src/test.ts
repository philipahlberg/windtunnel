import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { testModule, TestModule, TestResult, Mode } from '@windtunnel/core';
import { format, ForegroundColors, Attributes } from '@windtunnel/colors';

interface TestReport {
	passed: TestResult[];
	failed: TestResult[];
}

const importModule = async (path: string): Promise<TestModule> => {
	const res = resolve(path);
	const url = pathToFileURL(res);
	const mod = await import(url.href);
	return mod;
};

const reportResults = async (results: AsyncIterable<TestResult>): Promise<TestReport> => {
	const report: TestReport = {
		passed: [],
		failed: [],
	};
	console.log('');
	for await (const result of results) {
		const status = formatStatus(result);
		const message = `${status} ${result.name}`;
		console.log(message);
		if (result.passed) {
			report.passed.push(result);
		} else {
			report.failed.push(result);
		};
	}
	return report;
};

const formatStatus = (result: TestResult): string => {
	if (result.passed) {
		return format(' PASSED ', {
			foreground: ForegroundColors.Green,
			attributes: new Set([Attributes.Invert]),
		});
	} else {
		return format(' FAILED ', {
			foreground: ForegroundColors.Red,
			attributes: new Set([Attributes.Invert]),
		});
	}
};

const reportFailed = (report: TestReport) => {
	if (report.failed.length > 0) {
		const failures = report.failed.map((result) => {
			return `${result.name}: ${result.message}`;
		});
		console.log('');
		console.log(failures.join('\n\n'));
	}
};

const reportSummary = (report: TestReport) => {
	console.log('');
	console.log(`${report.passed.length} passed.`);
	if (report.failed.length > 0) {
		console.log(`${report.failed.length} failed.`);
	}
};

const exitProcess = (report: TestReport) => {
	const exitCode = report.failed.length > 0 ? 1 : 0;
	process.exit(exitCode);
};

interface Args {
	path: string,
	mode: Mode,
}

const parseArgs = (args: string[]): Args => {
	let mode: Mode | undefined;
	let path: string | undefined;
	for (const arg of args) {
		switch (arg) {
			case '--mode':
				const value = args.shift();
				switch (value) {
					case 'concurrent':
						mode = Mode.Concurrent;
						break;
					case 'serial':
						mode = Mode.Serial;
						break;
					default:
						console.error('Unknown value for option --mode:');
						console.error(value);
				}
				break;
			default:
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
				break;
		}
	}

	if (path !== undefined) {
		return {
			path,
			mode: mode ?? Mode.Concurrent,
		}
	} else {
		console.error('Missing required argument `path`');
		console.error('help: invoke with --help to see options');
		process.exit(1);
	}
};

export const test = async (args: string[]) => {
	const options = parseArgs(args);
	const mod = await importModule(options.path);
	const results = testModule(mod, { mode: options.mode });
	const report = await reportResults(results);
	reportFailed(report);
	reportSummary(report);
	exitProcess(report);
};
