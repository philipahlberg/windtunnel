export interface Module {
  [name: string]: TestFn;
}

interface Test {
  name: string;
  fn: TestFn;
}

export type SyncTestFn = () => Output;

export type AsyncTestFn = () => Promise<Output>;

export type TestFn = SyncTestFn | AsyncTestFn;

export interface Output {
  passed: boolean;
  message: string;
}

export interface Result {
  name: string;
  output: Output;
}

export interface Report {
  passed: Result[];
  failed: Result[];
}

export const runModule = async (mod: Module): Promise<Report> => {
  const tests = getTests(mod);
  const results = await runTests(tests);
  const report = createReport(results);
  return report;
};

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
      output: {
        passed: true,
        message: 'Passed.',
      }
    };
  } catch (error) {
    return {
      name: test.name,
      output: {
        passed: false,
        message: error.message,
      }
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
  return results.filter(result => result.output.passed);
};

const filterFailed = (results: Result[]): Result[] => {
  return results.filter(result => !result.output.passed);
};
