export interface Module {
	[name: string]: TestFn;
}

interface Test {
    name: string;
    fn: TestFn;
}

type SyncTestFn = () => Output;

type AsyncTestFn = () => Promise<Output>;

type TestFn = SyncTestFn | AsyncTestFn;

interface Output {
    outcome: Outcome;
    message: string;
}

interface Result {
    name: string;
    output: Output;
}

enum Outcome {
    Passed,
    Failed
}

export const runModule = async (mod: Module) => {
    const tests = getTests(mod);
    const results = await runTests(tests);
    const passed = filterPassed(results);
    const failed = filterFailed(results);
    reportPassed(passed);
    reportFailed(failed);
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
                outcome: Outcome.Passed,
                message: '',
            }
        };
    } catch (error) {
        return {
            name: test.name,
            output: {
                outcome: Outcome.Failed,
                message: error.message,
            }
        };
    }
};

const filterPassed = (results: Result[]): Result[] => {
    return results.filter(result => result.output.outcome === Outcome.Passed);
};

const filterFailed = (results: Result[]): Result[] => {
    return results.filter(result => result.output.outcome === Outcome.Failed);
};

const reportPassed = (results: Result[]) => {
    console.log(`${results.length} passed.`);
};

const reportFailed = (results: Result[]) => {
    console.log(`${results.length} failed.`);

    const lines = results.map(result => {
        return `\t ${result.name}: ${result.output.message}`;
    });

    console.log(lines.join('\n'));
};
