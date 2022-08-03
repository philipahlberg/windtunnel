export const assert = (t: boolean, message: string) => {
	if (!t) {
		throw new Error(message);
	}
};

const format = (value: unknown): string => {
	switch (typeof value) {
		case "bigint":
			return `${value}n`;
		case "boolean":
			return `${value}`;
		case "function":
			return `Function(${value.name})`;
		case "number":
			return `${value}`;
		case "object":
			if (value === null) {
				return "null";
			} else if (Array.isArray(value)) {
				return `[ ${value.map((v) => format(v)).join(", ")} ]`;
			} else {
				return `{ ${Object.entries(value)
					.map(([key, val]) => `${key}: ${format(val)}`)
					.join(", ")} }`;
			}
		case "string":
			return `"${value}"`;
		case "symbol":
			return `Symbol(${value.toString()})`;
		case "undefined":
			return "undefined";
		default:
			return "?";
	}
};

export const assertEqual = <T>(actual: T, expected: T, message?: string) => {
	const lhs = format(actual);
	const rhs = format(expected);
	if (lhs !== rhs) {
		const explanation = message ?? "Expected values to be equal:";
		const output = [
			"",
			"",
			`  ${explanation}`,
			`    actual:   ${lhs}`,
			`    expected: ${rhs}`,
			"",
		].join("\n");

		throw new Error(output);
	}
};

export const assertThrows = (f: () => void, message: string) => {
	try {
		f();
	} catch (error) {
		return;
	}
	throw new Error(message);
};

export const assertDoesNotThrow = (f: () => void, message: string) => {
	try {
		f();
	} catch (error) {
		const output = ["Expected function not to throw:", message, error].join(
			"\n"
		);
		throw new Error(output);
	}
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Call {
	input: any[];
	output: any[];
}

export interface Spy {
	(...args: any[]): any;
	calls: Call[];
}

export const createSpy = (fn: (...args: any[]) => any) => {
	const calls: Call[] = [];
	const spy = Object.assign(fn, { calls });
	return new Proxy(spy, {
		apply(target: Spy, context: any, input: any) {
			const output = target.apply(context, input);
			target.calls.push({ input, output });
			return output;
		},
	});
};

/* eslint-enable @typescript-eslint/no-explicit-any */
