import assert from 'assert';
import process from 'child_process';
import util from 'util';

const run = util.promisify(process.exec);

async function testEmpty() {
  const output = await run('windtunnel tests/cases/empty.mjs');
  assert(output.stderr === '');
  assert(output.stdout.includes('0 passed.'));
  assert(output.stdout.includes('0 failed.'));
}

async function testSuccess() {
  const output = await run('windtunnel tests/cases/success.mjs');
  assert(output.stderr === '');
  assert(output.stdout.includes('1 passed.'));
  assert(output.stdout.includes('0 failed.'));
}

async function testFail() {
  const output = await run('windtunnel tests/cases/fail.mjs')
    .catch(err => err);
  assert(output.stderr === '');
  assert(output.stdout.includes('0 passed.'));
  assert(output.stdout.includes('1 failed.'));
  assert(output.stdout.includes('testFail: false == true'))
}

(async () => {
  try {
    await Promise.all([
      testEmpty(),
      testSuccess(),
      testFail(),
    ]);
    console.log('Passed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed:');
    console.error(error);
    process.exit(1);
  }
})();
