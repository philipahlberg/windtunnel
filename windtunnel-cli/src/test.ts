import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { testModule, TestModule, TestResult } from '@windtunnel/core';
import { format, ForegroundColors, Attributes } from '@windtunnel/colors';

interface TestReport {
	passed: TestResult[];
	failed: TestResult[];
}

const importModule = async (arg: string): Promise<TestModule> => {
	const file = resolve(arg);
	const url = pathToFileURL(file);
	const mod = await import(url.href);
	return mod;
};

const reportResults = async (results: AsyncIterable<TestResult>): Promise<TestReport> => {
	const passed = [];
	const failed = [];
	console.log('');
	for await (const result of results) {
		const status = formatStatus(result);
		const message = `${status} ${result.name}`;
		console.log(message);
		if (result.passed) {
			passed.push(result);
		} else {
			failed.push(result);
		};
	}
	return {
		passed,
		failed,
	};
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

export const test = async (file: string) => {
  const mod = await importModule(file);
	const results = testModule(mod);
	const report = await reportResults(results);
	reportFailed(report);
	reportSummary(report);
  exitProcess(report);
};
