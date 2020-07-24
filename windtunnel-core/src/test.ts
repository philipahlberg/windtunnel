import { Module, Entry, Fn, getEntries } from './module';

export type TestModule = Module<Fn>;

export interface TestReport {
  passed: TestResult[];
  failed: TestResult[];
}

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export const testModule = async (mod: TestModule): Promise<TestReport> => {
  const tests = getEntries(mod);
  const results = await runTests(tests);
  const report = createReport(results);
  return report;
};

const runTests = (items: Entry<Fn>[]): Promise<TestResult[]> => {
  return Promise.all(items.map(runTest));
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

const createReport = (results: TestResult[]): TestReport => {
  const passed = filterPassed(results);
  const failed = filterFailed(results);
  return {
    passed,
    failed,
  };
};

const filterPassed = (results: TestResult[]): TestResult[] => {
  return results.filter(result => result.passed);
};

const filterFailed = (results: TestResult[]): TestResult[] => {
  return results.filter(result => !result.passed);
};
