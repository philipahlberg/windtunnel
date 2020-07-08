export interface Module {
  [name: string]: TestFn;
}

export type TestFn = SyncFn | AsyncFn;

export type SyncFn = () => void;

export type AsyncFn = () => Promise<void>;

export interface Report {
  passed: Result[];
  failed: Result[];
}

export interface Result {
  name: string;
  passed: boolean;
  message: string;
}

export const runModule = async (mod: Module): Promise<Report> => {
  const tests = getTests(mod);
  const results = await runTests(tests);
  const report = createReport(results);
  return report;
};

interface Test {
  name: string;
  fn: TestFn;
}

const getTests = (mod: Module): Test[] => {
  return Object.entries(mod)
    .map(([name, fn]) => ({ name, fn }));
};

const runTests = (tests: Test[]): Promise<Result[]> => {
  return Promise.all(tests.map(runTest));
};

const runTest = async (test: Test): Promise<Result> => {
  try {
    await test.fn();
    return {
      name: test.name,
      passed: true,
      message: 'Passed.',
    };
  } catch (error) {
    return {
      name: test.name,
      passed: false,
      message: error.message,
    };
  }
};

const createReport = (results: Result[]): Report => {
  const passed = filterPassed(results);
  const failed = filterFailed(results);
  return {
    passed,
    failed,
  };
};

const filterPassed = (results: Result[]): Result[] => {
  return results.filter(result => result.passed);
};

const filterFailed = (results: Result[]): Result[] => {
  return results.filter(result => !result.passed);
};
