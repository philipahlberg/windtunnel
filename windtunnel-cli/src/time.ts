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

export const main = async (file: string) => {
  const mod = await importModule(file);
  const report = timeModule(mod);
  reportResults(report);
};
