import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { Module, Result, Report, runModule } from '../../windtunnel-core';

const importTestSuite = async (arg: string): Promise<Module> => {
	const file = resolve(arg);
	const url = pathToFileURL(file);
	const mod = await import(url.href);
	return mod;
};

const reportPassed = (results: Result[]) => {
  console.log(`${results.length} passed.`);
};

const reportFailed = (results: Result[]) => {
  console.log(`${results.length} failed.`);

  const lines = results.map(result => {
    return `  ${result.name}: ${result.output.message}`;
  });

  console.log(lines.join('\n'));
};

const exitProcess = (report: Report) => {
	if (report.failed.length > 0) {
		process.exit(1);
	} else {
		process.exit(0);
	}
};

(async () => {
	const arg = process.argv[2];
	const mod = await importTestSuite(arg);
	const report = await runModule(mod);
	reportPassed(report.passed);
	reportFailed(report.failed);
	exitProcess(report);
})();
