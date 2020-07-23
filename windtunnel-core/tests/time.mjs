import { assert, createSpy } from '@windtunnel/assert';
import { timeModule } from '../dist/index.mjs';

export function testTimeResult() {
  const report = timeModule({
    foo: () => {
      let count = 0;
      for (let i = 0; i < 100000; i++) {
        count++;
      }
      return count;
    },
  });

  const result = report.results[0];

  assert('name' in result, 'should have a name');
  assert('mean' in result, 'should have a mean');
  assert('variance' in result, 'should have variance');
  assert('marginOfError' in result, 'should have margin of error');
  assert('relativeMarginOfError' in result, 'should have relative margin of error');
  assert('standardError' in result, 'should have standard error');
}

export function testTimeSamples() {
  const spy = createSpy(() => {
    let count = 0;
    for (let i = 0; i < 100000; i++) {
      count++;
    }
    return count;
  });
  const report = timeModule({
    foo: spy,
  });

  const result = report.results[0];

  assert(result.sample.length >= 5, 'should run at least 5 times');
  assert(result.sample.length === spy.calls.length, 'call count and sample size should be equal');
}
