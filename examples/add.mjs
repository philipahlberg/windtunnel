import { assertEqual, assertThrows } from '../dist/index.mjs';

export function onePlusOne() {
    assertEqual(1 + 1, 1, '1 + 1 should equal 2');
}

export function onePlusTwo() {
    assertEqual(1 + 2, 2, '1 + 2 should equal 3');
}

export async function onePlusThree() {
    await Promise.resolve();
    assertEqual(1 + 3, 3, '1 + 3 should equal 4');
}

export function onePlusFour() {
    assertThrows(() => assert(false), 'oops');
}
