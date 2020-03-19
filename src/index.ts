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
            `\t \t actual:`,
            `\t \t ${lhs}`,
            `\t \t expected:`,
            `\t \t ${rhs}`
        ].join('\n');

        throw new Error(output);
    }
};

export const assertThrows = (f: () => any, message: string) => {
    try {
        f();
        throw new Error(message);
    } catch {}
};
