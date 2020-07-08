import { assert, assertEqual } from '@windtunnel/assert';
import { runModule } from '../dist/index.mjs';

export async function testSyncSuccess() {
  const report = await runModule({
    syncSuccess: () => {
      assert(true, 'true == true');
    },
  });

  assertEqual(report, {
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
      assert(true, 'true == true');
    },
  });

  assertEqual(report, {
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
      assert(false, 'false == true');
    },
  });

  assertEqual(report, {
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
      assert(false, 'false == true');
    },
  });

  assertEqual(report, {
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
      assert(true, 'true == true');
    },
    asyncSuccess: async () => {
      await Promise.resolve();
      assert(true, 'true == true');
    },
    syncFail: () => {
      assert(false, 'false == true');
    },
    asyncFail: async () => {
      await Promise.resolve();
      assert(false, 'false == true');
    },
  });

  assertEqual(report, {
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
