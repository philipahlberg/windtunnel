import { assert, assertEqual, createSpy } from '@windtunnel/assert';
import { timeModule } from '../dist/index.mjs';

export function testTimeResult() {
	const options = {
		now: () => process.hrtime.bigint(),
	};
	const report = timeModule({
		foo: () => {
			let count = 0;
			for (let i = 0; i < 100000; i++) {
				count++;
			}
			return count;
		},
	}, options);

	const result = report.results[0];

	assert('name' in result, 'should have a name');
	assert('sample' in result, 'should have the sample');
	assert('mean' in result, 'should have a mean');
	assert('variance' in result, 'should have variance');
	assert('marginOfError' in result, 'should have margin of error');
	assert('relativeMarginOfError' in result, 'should have relative margin of error');
	assert('standardError' in result, 'should have standard error');
}

export function testTimeSamples() {
	const options = {
		now: () => process.hrtime.bigint(),
	};
	const spy = createSpy(() => {
		let count = 0;
		for (let i = 0; i < 100_000; i++) {
			count++;
		}
		return count;
	});
	const report = timeModule({
		foo: spy,
	}, options);

	const result = report.results[0];

	assert(result.sample.length >= 5, 'should run at least 5 times');
	assertEqual(result.sample.length, spy.calls.length, 'call count and sample size should be equal');
}
