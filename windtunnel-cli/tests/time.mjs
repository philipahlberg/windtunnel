import { assert } from '@windtunnel/assert';
import process from 'child_process';
import util from 'util';

const run = util.promisify(process.exec);

export async function testTime() {
  const output = await run(`windtunnel time tests/cases/time.mjs`);
  assert(output.stderr === '');

  const lines = output.split('\n');
  const reallySlow = lines.find(line => line.startsWith('reallySlow'));

  assert(reallySlow.includes('reallySlow:'));
  assert(reallySlow.includes('±'));
  assert(reallySlow.includes('ops/sec'));
  assert(reallySlow.includes('runs sampled'));
}
