import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { testModule, TestModule, TestResult, TestReport } from '@windtunnel/core';
import { format, Attributes, ForegroundColors } from '@windtunnel/colors';

const importModule = async (arg: string): Promise<TestModule> => {
	const file = resolve(arg);
	const url = pathToFileURL(file);
	const mod = await import(url.href);
	return mod;
};

const reportPassed = (passed: TestResult[]) => {
	const message = `${passed.length} passed.`;

	if (passed.length > 0) {
		console.log(format(message, {
			foreground: ForegroundColors.Green,
		}));
	} else {
		console.log(format(message, {
			attributes: new Set([Attributes.Dimmed])
		}));
	}
};

const reportFailed = (failed: TestResult[]) => {
	const message = `${failed.length} failed.`;

	if (failed.length > 0) {
		console.log(format(message, {
			foreground: ForegroundColors.Red,
		}));

		const failures = failed.map(result => {
			return `${result.name}: ${result.message}`;
		});

		console.log('');
		console.log(failures.join('\n'));
	} else {
		console.log(format(message, {
			attributes: new Set([Attributes.Dimmed]),
		}));
	}
};

const reportResults = (report: TestReport) => {
	console.log('');
	reportPassed(report.passed);
	reportFailed(report.failed);
};

const exitProcess = (report: TestReport) => {
	const exitCode = report.failed.length > 0 ? 1 : 0;
	process.exit(exitCode);
};

export const main = async (file: string) => {
  const mod = await importModule(file);
  const report = await testModule(mod);
  reportResults(report);
  exitProcess(report);
};
