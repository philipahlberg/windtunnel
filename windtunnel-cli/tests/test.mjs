import { assert } from "@windtunnel/assert";
import process from "child_process";
import util from "util";

const run = util.promisify(process.exec);

export async function testEmpty() {
	const output = await run("node dist/index.mjs test tests/cases/empty.mjs");
	assert(output.stderr === "");
	assert(output.stdout.includes("0 passed."));
}

export async function testSuccess() {
	const output = await run("node dist/index.mjs test tests/cases/success.mjs");
	assert(output.stderr === "");
	assert(output.stdout.includes("1 passed."));
}

export async function testFail() {
	const output = await run(
		"node dist/index.mjs test tests/cases/fail.mjs"
	).catch((err) => err);
	assert(output.stderr === "");
	assert(output.stdout.includes("0 passed."));
	assert(output.stdout.includes("4 failed."));
	assert(output.stdout.includes("testFailOne:"));
	assert(output.stdout.includes("testFailTwo:"));
	assert(output.stdout.includes("testFailThree:"));
	assert(output.stdout.includes("testFailFour:"));
}
