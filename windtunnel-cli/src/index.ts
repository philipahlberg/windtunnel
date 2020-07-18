import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { runModule, Module, Result, Report } from '@windtunnel/core';
import { format, Attributes, ForegroundColors } from '@windtunnel/colors';

const importModule = async (arg: string): Promise<Module> => {
	const file = resolve(arg);
	const url = pathToFileURL(file);
	const mod = await import(url.href);
	return mod;
};

const reportPassed = (passed: Result[]) => {
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

const reportFailed = (failed: Result[]) => {
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

const reportResults = (report: Report) => {
	console.log('');
	reportPassed(report.passed);
	reportFailed(report.failed);
};

const exitProcess = (report: Report) => {
	const exitCode = report.failed.length > 0 ? 1 : 0;
	process.exit(exitCode);
};

(async () => {
	const arg = process.argv[2];
	const mod = await importModule(arg);
	const report = await runModule(mod);
	reportResults(report);
	exitProcess(report);
})();
