import { createRaceIterable } from 'nurburgring';
import { Module, Entry, Fn, getEntries } from './module';

export type TestModule = Module<Fn>;

export interface TestResult {
	name: string;
	passed: boolean;
	message: string;
}

const Serial = 'Serial';
const Concurrent = 'Concurrent';

export type Mode = typeof Serial | typeof Concurrent;
export const Mode = { Serial, Concurrent } as const;

export interface TestOptions {
	mode: Mode,
}

export const testModule = (mod: TestModule, options: TestOptions): AsyncIterable<TestResult> => {
	const tests = getEntries(mod);
	return runTests(tests, options);
};

const runTests = (items: Entry<Fn>[], options: TestOptions): AsyncIterable<TestResult> => {
	switch (options.mode) {
		case Mode.Serial:
			return runTestsSerially(items);
		case Mode.Concurrent:
			return runTestsConcurrently(items);
		default:
			return assertUnreachable(options.mode);
	}
};

const runTestsConcurrently = (items: Entry<Fn>[]): AsyncIterable<TestResult> => {
	return createRaceIterable(items.map(runTest));
};

async function* runTestsSerially(items: Entry<Fn>[]): AsyncIterable<TestResult> {
	for (const item of items) {
		yield (await runTest(item));
	}
}

const assertUnreachable = (_: never): never => {
	throw new Error('should be unreachable');
};

const runTest = async (item: Entry<Fn>): Promise<TestResult> => {
	const [name, fn] = item;
	try {
		await fn();
		return {
			name: name,
			passed: true,
			message: 'Passed.',
		};
	} catch (error) {
		if (error instanceof Error) {
			if (error.stack != null) {
				return {
					name,
					passed: false,
					message: error.stack,
				}
			} else {
				return {
					name,
					passed: false,
					message: error.message,
				}
			}
		} else {
			return {
				name,
				passed: false,
				message: String(error),
			};
		}
	}
};
