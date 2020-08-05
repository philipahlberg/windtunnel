import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { testModule, TestModule, TestResult, TestReport } from '@windtunnel/core';
import { format, ForegroundColors, Attributes } from '@windtunnel/colors';

const importModule = async (arg: string): Promise<TestModule> => {
	const file = resolve(arg);
	const url = pathToFileURL(file);
	const mod = await import(url.href);
	return mod;
};

const reportResults = (results: TestResult[]) => {
	console.log('');
	for (const result of results) {
		const status = formatStatus(result);
		const message = `${status} ${result.name} (${result.duration} ms)`;
		console.log(message);
	}
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

const reportFailed = (failed: TestResult[]) => {
	if (failed.length > 0) {
		const failures = failed.map(result => {
			return `${result.name}: ${result.message}`;
		});
		console.log('');
		console.log(failures.join('\n'));
	}
};

const reportSummary = (report: TestReport) => {
	console.log('');
	console.log(`${report.passed.length} passed.`);
	console.log(`${report.failed.length} failed.`);
};

const exitProcess = (report: TestReport) => {
	const exitCode = report.failed.length > 0 ? 1 : 0;
	process.exit(exitCode);
};

export const test = async (file: string) => {
  const mod = await importModule(file);
	const report = await testModule(mod);
	reportResults([...report.passed, ...report.failed]);
	reportFailed(report.failed);
	reportSummary(report);
  exitProcess(report);
};
