import { assertEqual } from "@windtunnel/assert";
import assert from "assert";

export function testFailOne() {
	assert(false);
}

export function testFailTwo() {
	const foo = () => {
		assert(false);
	};
	foo();
}

export async function testFailThree() {
	const foo = async () => {
		await Promise.resolve();
		assert(false);
	};
	const bar = async () => {
		await Promise.resolve();
		await foo();
	};
	await bar();
}

export function testFailFour() {
	assertEqual(
		[{ a: [1, 2, 3], b: 2, c: 3 }, 123],
		[{ a: [1, 2, 3], b: 3, d: 4 }, 123]
	);
}
