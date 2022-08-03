import { Module, Entry, SyncFn, getEntries } from "./module";

export type TimeModule = Module<SyncFn>;

export interface TimeReport {
	results: TimeResult[];
}

export interface TimeResult {
	name: string;
	sample: bigint[];
	mean: bigint;
	variance: bigint;
	marginOfError: number;
	relativeMarginOfError: number;
	standardError: number;
}

export interface TimeOptions {
	now: () => bigint;
}

export const timeModule = (
	mod: Module<SyncFn>,
	options: TimeOptions
): TimeReport => {
	const items = getEntries(mod);
	const results = timeItems(items, options.now);
	const report = createReport(results);
	return report;
};

const timeItems = (
	entries: Entry<SyncFn>[],
	now: () => bigint
): TimeResult[] => {
	return entries.map((item) => timeItem(item, now));
};

const MIN_ITERATIONS = 5;
const MAX_TIME = 5_000_000_000n;

const timeItem = (entry: Entry<SyncFn>, now: () => bigint): TimeResult => {
	const sample = [];
	const [name, fn] = entry;
	for (let i = 0; i < MIN_ITERATIONS; i++) {
		const start = now();
		fn();
		const end = now();
		const time = end - start;
		sample.push(time);
	}
	let elapsedTime = sample.reduce((sum, time) => sum + time, 0n);
	while (elapsedTime < MAX_TIME) {
		const start = now();
		fn();
		const end = now();
		const time = end - start;
		sample.push(time);
		elapsedTime = elapsedTime + time;
	}
	const stats = computeStats(sample);
	return {
		name,
		...stats,
	};
};

interface Stats {
	sample: bigint[];
	mean: bigint;
	variance: bigint;
	marginOfError: number;
	relativeMarginOfError: number;
	standardError: number;
}

const computeStats = (sample: bigint[]): Stats => {
	const sampleSize = sample.length;
	const sum = sample.reduce((sum, time) => sum + time, 0n);
	const mean = sum / BigInt(sampleSize);
	const variance = sample.reduce((sum, x) => sum + (x - mean) ** 2n, 0n);
	const standardDeviaton = Number(variance) ** 0.5;
	const standardError = standardDeviaton / sampleSize ** 0.5;
	const degreesOfFreedom = sampleSize - 1;
	const criticalValue = getCriticalValue(degreesOfFreedom);
	const marginOfError = standardError * criticalValue;
	const relativeMarginOfError = (marginOfError / Number(mean)) * 100;
	return {
		sample,
		mean,
		variance,
		marginOfError,
		relativeMarginOfError,
		standardError,
	};
};

// T-Distribution two-tailed critical values for 95% confidence.
// For more info see: http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm
const T_TABLE = {
	1: 12.706,
	2: 4.303,
	3: 3.182,
	4: 2.776,
	5: 2.571,
	6: 2.447,
	7: 2.365,
	8: 2.306,
	9: 2.262,
	10: 2.228,
	11: 2.201,
	12: 2.179,
	13: 2.16,
	14: 2.145,
	15: 2.131,
	16: 2.12,
	17: 2.11,
	18: 2.101,
	19: 2.093,
	20: 2.086,
	21: 2.08,
	22: 2.074,
	23: 2.069,
	24: 2.064,
	25: 2.06,
	26: 2.056,
	27: 2.052,
	28: 2.048,
	29: 2.045,
	30: 2.042,
};

const T_INFINITY = 1.96;

const criticalValueIsDefinedFor = (df: number): df is keyof typeof T_TABLE => {
	return 1 <= df && df <= 30;
};

const getCriticalValue = (df: number): number => {
	if (criticalValueIsDefinedFor(df)) {
		return T_TABLE[df];
	} else {
		return T_INFINITY;
	}
};

const createReport = (results: TimeResult[]): TimeReport => {
	return {
		results,
	};
};
