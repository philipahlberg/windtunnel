import { assert, assertEqual } from '@windtunnel/assert';
import { testModule } from '../dist/index.mjs';

async function collect(asyncIterable) {
  const values = [];
  for await (const value of asyncIterable) {
    values.push(value);
  }
  return values;
}

export async function testSyncSuccess() {
  const run = testModule({
    syncSuccess: () => {
      assert(true, 'true == true');
    },
  });

  const results = await collect(run);

  assertEqual(results.length, 1);
  assertEqual(results[0].name, 'syncSuccess');
  assertEqual(results[0].passed, true);
  assertEqual(results[0].message, 'Passed.');
}

export async function testAsyncSuccess() {
  const run = testModule({
    asyncSuccess: async () => {
      await Promise.resolve();
      assert(true, 'true == true');
    },
  });

  const results = await collect(run);

  assertEqual(results.length, 1);
  assertEqual(results[0].name, 'asyncSuccess');
  assertEqual(results[0].passed, true);
  assertEqual(results[0].message, 'Passed.');
}

export async function testSyncFail() {
  const run = testModule({
    syncFail: () => {
      assert(false, 'false == true');
    },
  });

  const results = await collect(run);

  assertEqual(results.length, 1);
  assertEqual(results[0].name, 'syncFail');
  assertEqual(results[0].passed, false);
  assertEqual(results[0].message, 'false == true');
}

export async function testAsyncFail() {
  const run = testModule({
    asyncFail: async () => {
      await Promise.resolve();
      assert(false, 'false == true');
    },
  });

  const results = await collect(run);
  
  assertEqual(results.length, 1);
  assertEqual(results[0].name, 'asyncFail');
  assertEqual(results[0].passed, false);
  assertEqual(results[0].message, 'false == true');
}

export async function testMixed() {
  const run = testModule({
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

  const results = await collect(run);

  const syncSuccess = results.find((result) => result.name === 'syncSuccess');
  const asyncSuccess = results.find((result) => result.name === 'asyncSuccess');
  const syncFail = results.find((result) => result.name === 'syncFail');
  const asyncFail = results.find((result) => result.name === 'asyncFail');

  assertEqual(results.length, 4);

  assertEqual(syncSuccess.name, 'syncSuccess');
  assertEqual(syncSuccess.passed, true);
  assertEqual(syncSuccess.message, 'Passed.');

  assertEqual(asyncSuccess.name, 'asyncSuccess');
  assertEqual(asyncSuccess.passed, true);
  assertEqual(asyncSuccess.message, 'Passed.');

  assertEqual(syncFail.name, 'syncFail');
  assertEqual(syncFail.passed, false);
  assertEqual(syncFail.message, 'false == true');

  assertEqual(asyncFail.name, 'asyncFail');
  assertEqual(asyncFail.passed, false);
  assertEqual(asyncFail.message, 'false == true');
}
