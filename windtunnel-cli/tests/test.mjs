import { assert } from '@windtunnel/assert';
import process from 'child_process';
import util from 'util';

const run = util.promisify(process.exec);

export async function testEmpty() {
  const output = await run('windtunnel test tests/cases/empty.mjs');
  assert(output.stderr === '');
  assert(output.stdout.includes('0 passed.'));
  assert(output.stdout.includes('0 failed.'));
}

export async function testSuccess() {
  const output = await run('windtunnel test tests/cases/success.mjs');
  assert(output.stderr === '');
  assert(output.stdout.includes('1 passed.'));
  assert(output.stdout.includes('0 failed.'));
}

export async function testFail() {
  const output = await run('windtunnel test tests/cases/fail.mjs')
    .catch(err => err);
  assert(output.stderr === '');
  assert(output.stdout.includes('0 passed.'));
  assert(output.stdout.includes('1 failed.'));
  assert(output.stdout.includes('testFail: false == true'));
}
