import { deepStrictEqual as deepEqual, strict as assert } from 'assert';
import { runModule } from '../dist/index.mjs';

export async function testSyncSuccess() {
  const report = await runModule({
    syncSuccess: () => {
      assert(true);
    },
  });

  deepEqual(report, {
    passed: [
      {
        name: 'syncSuccess',
        passed: true,
        message: 'Passed.',
      },
    ],
    failed: [],
  });
}

export async function testAsyncSuccess() {
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
        passed: true,
        message: 'Passed.',
      },
    ],
    failed: [],
  });
}

export async function testSyncFail() {
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
        passed: false,
        message: 'false == true',
      },
    ],
  });
}

export async function testAsyncFail() {
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
        passed: false,
        message: 'false == true',
      },
    ],
  });
}

export async function testMixed() {
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
        passed: true,
        message: 'Passed.',
      },
      {
        name: 'asyncSuccess',
        passed: true,
        message: 'Passed.',
      },
    ],
    failed: [
      {
        name: 'syncFail',
        passed: false,
        message: 'false == true',
      },
      {
        name: 'asyncFail',
        passed: false,
        message: 'false == true',
      },
    ]
  });
}
