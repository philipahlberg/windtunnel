import * as external from '@windtunnel/assert';
import * as internal from '../dist/index.mjs';

export function testAssert() {
  internal.assert(true, 'assert(true) should not throw');
  external.assertThrows(() => {
    internal.assert(false, 'message');
  }, 'assert(false) should throw');
}

export function testAssertEqual() {
  internal.assertEqual(null, null, 'should work for null');
  internal.assertEqual(undefined, undefined, 'should work for undefined');
  internal.assertEqual(1, 1, 'should work for numbers (1/2)');
  internal.assertEqual(1n, 1n, 'should work for bigints (1/2)');
  internal.assertEqual('foo', 'foo', 'should work for strings (1/2)');
  internal.assertEqual([1, 2, 3], [1, 2, 3], 'should work for arrays (1/2)');
  internal.assertEqual({ a: 1, b: 2 }, { a: 1, b: 2 }, 'should work for objects (1/2)');
  external.assertThrows(() => {
    internal.assertEqual(null, undefined, 'null and undefined should not be equal');
  }, 'should work for null and undefined');
  external.assertThrows(() => {
    internal.assertEqual(1, 2, '1 === 2');
  }, 'should work for numbers (2/2)');
  external.assertThrows(() => {
    internal.assertEqual(1n, 2n, '1n === 2n');
  }, 'should work for bigints (2/2)');
  external.assertThrows(() => {
    internal.assertEqual('foo', 'bar', 'foo === bar');
  }, 'should work for strings (2/2)');
  external.assertThrows(() => {
    internal.assertEqual([1, 2, 3], [4, 5, 6], '[1, 2, 3] === [4, 5, 6]');
  }, 'should work for arrays (2/2)');
  external.assertThrows(() => {
    internal.assertEqual({ a: 1, b: 2 }, { a: 3, b: 4 }, '{ a: 1, b: 2 } === { a: 3, b: 4 }');
  }, 'should work for objects (2/2)');
}

export function testAssertThrows() {
  internal.assertThrows(() => {
    throw new Error();
  }, 'should not throw when the inner function throws');
  external.assertThrows(() => {
    internal.assertThrows(() => {});
  }, 'should throw when the inner function does not throw');
}

export function testCreateSpy() {
  const spy = internal.createSpy(v => v);
  external.assertEqual(spy.calls.length, 0);
}

export function testCallSpy() {
  const spy = internal.createSpy(v => v * 2);
  spy(123);
  external.assertEqual(spy.calls.length, 1);
  external.assertEqual(spy.calls[0].input, [123]);
  external.assertEqual(spy.calls[0].output, 123 * 2);
  spy(456);
  external.assertEqual(spy.calls.length, 2);
  external.assertEqual(spy.calls[1].input, [456]);
  external.assertEqual(spy.calls[1].output, 456 * 2);
}
