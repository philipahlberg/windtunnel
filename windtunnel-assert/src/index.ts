export const assert = (t: boolean, message: string) => {
  if (!t) {
    throw new Error(message);
  }
};

const stringify = (_key: string, value: unknown) => {
  if (typeof value === 'bigint') {
    return `${value.toString()}n`;
  } else {
    return value;
  }
};

export const assertEqual = <T>(actual: T, expected: T, message: string) => {
  const lhs = JSON.stringify(actual, stringify);
  const rhs = JSON.stringify(expected, stringify);
  if (lhs !== rhs) {
    const output = [
      message,
      `    actual:`,
      `    ${lhs}`,
      `    expected:`,
      `    ${rhs}`
    ].join('\n');

    throw new Error(output);
  }
};

export const assertThrows = (f: () => any, message: string) => {
  try {
    f();
  } catch (error) {
    return;
  }
  throw new Error(message);
};

export const assertDoesNotThrow = (f: () => any, message: string) => {
  try {
    f();
  } catch (error) {
    const output = [
      'Expected function not to throw:',
      message,
      error,
    ].join('\n');
    throw new Error(output);
  }
};

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
