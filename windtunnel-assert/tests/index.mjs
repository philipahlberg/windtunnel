import assert from 'assert';
import * as lib from '../dist/index.mjs';

export function testAssert() {
  assert.doesNotThrow(() => {
    lib.assert(true, 'message');
  }, 'assert(true) should not throw');
  assert.throws(() => {
    lib.assert(false, 'message');
  }, 'assert(false) should throw');
}

export function testAssertEqual() {
  assert.doesNotThrow(() => {
    lib.assertEqual(1, 1);
  }, 'should work for numbers');
  assert.doesNotThrow(() => {
    lib.assertEqual('foo', 'foo');
  }, 'should work for strings');
  assert.doesNotThrow(() => {
    lib.assertEqual([1, 2, 3], [1, 2, 3]);
  }, 'should work for arrays');
  assert.doesNotThrow(() => {
    lib.assertEqual({ a: 1, b: 2}, { a: 1, b: 2});
  }, 'should work for objects');
}

export function testAssertThrows() {
  assert.doesNotThrow(() => {
    lib.assertThrows(() => {
      throw new Error();
    });
  }, 'should not throw when the inner function throws');
  assert.throws(() => {
    lib.assertThrows(() => {});
  }, 'should throw when the inner function does not throw');
}

export function testCreateSpy() {
  const spy = lib.createSpy(v => v);
  assert.strictEqual(spy.calls.length, 0);
}

export function testCallSpy() {
  const spy = lib.createSpy(v => v * 2);
  spy(123);
  assert.deepStrictEqual(spy.calls.length, 1);
  assert.deepStrictEqual(spy.calls[0].input, [123]);
  assert.deepStrictEqual(spy.calls[0].output, 123 * 2);
  spy(456);
  assert.deepStrictEqual(spy.calls.length, 2);
  assert.deepStrictEqual(spy.calls[1].input, [456]);
  assert.deepStrictEqual(spy.calls[1].output, 456 * 2);
}
