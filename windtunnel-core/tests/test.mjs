import { assert, assertEqual } from '@windtunnel/assert';
import { testModule } from '../dist/index.mjs';

export async function testSyncSuccess() {
  const report = await testModule({
    syncSuccess: () => {
      assert(true, 'true == true');
    },
  });

  assertEqual(report.passed.length, 1);
  assertEqual(report.failed.length, 0);
  assertEqual(report.passed[0].name, 'syncSuccess');
  assertEqual(report.passed[0].passed, true);
  assertEqual(report.passed[0].message, 'Passed.');
}

export async function testAsyncSuccess() {
  const report = await testModule({
    asyncSuccess: async () => {
      await Promise.resolve();
      assert(true, 'true == true');
    },
  });

  assertEqual(report.passed.length, 1);
  assertEqual(report.failed.length, 0);
  assertEqual(report.passed[0].name, 'asyncSuccess');
  assertEqual(report.passed[0].passed, true);
  assertEqual(report.passed[0].message, 'Passed.');
}

export async function testSyncFail() {
  const report = await testModule({
    syncFail: () => {
      assert(false, 'false == true');
    },
  });

  assertEqual(report.passed.length, 0);
  assertEqual(report.failed.length, 1);
  assertEqual(report.failed[0].name, 'syncFail');
  assertEqual(report.failed[0].passed, false);
  assertEqual(report.failed[0].message, 'false == true');
}

export async function testAsyncFail() {
  const report = await testModule({
    asyncFail: async () => {
      await Promise.resolve();
      assert(false, 'false == true');
    },
  });
  
  assertEqual(report.passed.length, 0);
  assertEqual(report.failed.length, 1);
  assertEqual(report.failed[0].name, 'asyncFail');
  assertEqual(report.failed[0].passed, false);
  assertEqual(report.failed[0].message, 'false == true');
}

export async function testMixed() {
  const report = await testModule({
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

  assertEqual(report.passed.length, 2);
  assertEqual(report.failed.length, 2);
  assertEqual(report.passed[0].name, 'syncSuccess');
  assertEqual(report.passed[0].passed, true);
  assertEqual(report.passed[0].message, 'Passed.');
  assertEqual(report.passed[1].name, 'asyncSuccess');
  assertEqual(report.passed[1].passed, true);
  assertEqual(report.passed[1].message, 'Passed.');
  assertEqual(report.failed[0].name, 'syncFail');
  assertEqual(report.failed[0].passed, false);
  assertEqual(report.failed[0].message, 'false == true');
  assertEqual(report.failed[1].name, 'asyncFail');
  assertEqual(report.failed[1].passed, false);
  assertEqual(report.failed[1].message, 'false == true');
}
