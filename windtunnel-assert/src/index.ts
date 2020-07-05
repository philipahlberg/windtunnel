export const assert = (t: boolean, message: string) => {
  if (!t) {
    throw new Error(message);
  }
};

export const assertEqual = <T>(actual: T, expected: T, message: string) => {
  const lhs = JSON.stringify(actual);
  const rhs = JSON.stringify(expected);
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
