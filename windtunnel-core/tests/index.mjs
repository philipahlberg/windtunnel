import { deepStrictEqual as deepEqual, strict as assert } from 'assert';
import { runModule } from '../dist/index.mjs';

async function testSyncSuccess() {
  const report = await runModule({
    syncSuccess: () => {
      assert(true);
    },
  });

  deepEqual(report, {
    passed: [
      {
        name: 'syncSuccess',
        output: {
          passed: true,
          message: 'Passed.',
        },
      },
    ],
    failed: [],
  });
}

async function testAsyncSuccess() {
  const report = await runModule({
    asyncSuccess: async () => {
      await Promise.resolve();
      assert(true);
    },
  });

  deepEqual(report, {
    passed: [
      {
        name: 'asyncSuccess',
        output: {
          passed: true,
          message: 'Passed.',
        },
      },
    ],
    failed: [],
  });
}

async function testSyncFail() {
  const report = await runModule({
    syncFail: () => {
      assert(false);
    },
  });

  deepEqual(report, {
    passed: [],
    failed: [
      {
        name: 'syncFail',
        output: {
          passed: false,
          message: 'false == true',
        },
      },
    ],
  });
}

async function testAsyncFail() {
  const report = await runModule({
    asyncFail: async () => {
      await Promise.resolve();
      assert(false);
    },
  });

  deepEqual(report, {
    passed: [],
    failed: [
      {
        name: 'asyncFail',
        output: {
          passed: false,
          message: 'false == true',
        },
      },
    ],
  });
}

async function testMixed() {
  const report = await runModule({
    syncSuccess: () => {
      assert(true);
    },
    asyncSuccess: async () => {
      await Promise.resolve();
      assert(true);
    },
    syncFail: () => {
      assert(false);
    },
    asyncFail: async () => {
      await Promise.resolve();
      assert(false);
    },
  });

  deepEqual(report, {
    passed: [
      {
        name: 'syncSuccess',
        output: {
          passed: true,
          message: 'Passed.',
        },
      },
      {
        name: 'asyncSuccess',
        output: {
          passed: true,
          message: 'Passed.',
        },
      },
    ],
    failed: [
      {
        name: 'syncFail',
        output: {
          passed: false,
          message: 'false == true',
        },
      },
      {
        name: 'asyncFail',
        output: {
          passed: false,
          message: 'false == true',
        },
      },
    ]
  });
}

(async () => {
  try {
    await Promise.all([
      testSyncSuccess(),
      testAsyncSuccess(),
      testSyncFail(),
      testAsyncFail(),
      testMixed(),
    ]);
    console.log('Passed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed:');
    console.error(error);
    process.exit(1);
  }
})();
