import { assert, assertEqual } from "@windtunnel/assert";
import { testModule, Mode } from "../dist/index.mjs";

async function collect(asyncIterable) {
	const values = [];
	for await (const value of asyncIterable) {
		values.push(value);
	}
	return values;
}

export async function testSyncSuccess() {
	const options = {
		mode: Mode.Concurrent,
	};
	const run = testModule(
		{
			syncSuccess: () => {
				assert(true, "true == true");
			},
		},
		options
	);

	const results = await collect(run);
	const syncSuccess = results[0];

	assertEqual(results.length, 1);
	assertEqual(syncSuccess.name, "syncSuccess");
	assertEqual(syncSuccess.passed, true);
	assertEqual(syncSuccess.message, "Passed.");
}

export async function testAsyncSuccess() {
	const options = {
		mode: Mode.Concurrent,
	};
	const run = testModule(
		{
			asyncSuccess: async () => {
				await Promise.resolve();
				assert(true, "true == true");
			},
		},
		options
	);

	const results = await collect(run);
	const asyncSuccess = results[0];

	assertEqual(results.length, 1);
	assertEqual(asyncSuccess.name, "asyncSuccess");
	assertEqual(asyncSuccess.passed, true);
	assertEqual(asyncSuccess.message, "Passed.");
}

export async function testSyncFail() {
	const options = {
		mode: Mode.Concurrent,
	};
	const run = testModule(
		{
			syncFail: () => {
				assert(false, "false == true");
			},
		},
		options
	);

	const results = await collect(run);
	const syncFail = results[0];

	assertEqual(results.length, 1);
	assertEqual(syncFail.name, "syncFail");
	assertEqual(syncFail.passed, false);

	const lines = syncFail.message.split("\n");
	assert(lines[0].includes("false == true"));
}

export async function testAsyncFail() {
	const options = {
		mode: Mode.Concurrent,
	};
	const run = testModule(
		{
			asyncFail: async () => {
				await Promise.resolve();
				assert(false, "false == true");
			},
		},
		options
	);

	const results = await collect(run);
	const asyncFail = results[0];

	assertEqual(results.length, 1);
	assertEqual(asyncFail.name, "asyncFail");
	assertEqual(asyncFail.passed, false);

	const lines = asyncFail.message.split("\n");
	assert(lines[0].includes("false == true"));
}

export async function testMixed() {
	const options = {
		mode: Mode.Concurrent,
	};
	const run = testModule(
		{
			syncSuccess: () => {
				assert(true, "true == true");
			},
			asyncSuccess: async () => {
				await Promise.resolve();
				assert(true, "true == true");
			},
			syncFail: () => {
				assert(false, "false == true");
			},
			asyncFail: async () => {
				await Promise.resolve();
				assert(false, "false == true");
			},
		},
		options
	);

	const results = await collect(run);

	const syncSuccess = results.find((result) => result.name === "syncSuccess");
	const asyncSuccess = results.find((result) => result.name === "asyncSuccess");
	const syncFail = results.find((result) => result.name === "syncFail");
	const asyncFail = results.find((result) => result.name === "asyncFail");

	assertEqual(results.length, 4);

	assertEqual(syncSuccess.name, "syncSuccess");
	assertEqual(syncSuccess.passed, true);
	assertEqual(syncSuccess.message, "Passed.");

	assertEqual(asyncSuccess.name, "asyncSuccess");
	assertEqual(asyncSuccess.passed, true);
	assertEqual(asyncSuccess.message, "Passed.");

	assertEqual(syncFail.name, "syncFail");
	assertEqual(syncFail.passed, false);
	assert(syncFail.message.includes("false == true"));

	assertEqual(asyncFail.name, "asyncFail");
	assertEqual(asyncFail.passed, false);
	assert(asyncFail.message.includes("false == true"));
}
