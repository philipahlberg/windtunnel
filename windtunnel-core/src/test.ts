import { createRaceIterable } from 'nurburgring';
import { Module, Entry, Fn, getEntries } from './module';

export type TestModule = Module<Fn>;

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export const testModule = (mod: TestModule): AsyncIterable<TestResult> => {
  const tests = getEntries(mod);
  return runTests(tests);
};

const runTests = (items: Entry<Fn>[]): AsyncIterable<TestResult> => {
  return createRaceIterable(items.map(runTest));
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
    return {
      name: name,
      passed: false,
      message: error.message,
    };
  }
};
