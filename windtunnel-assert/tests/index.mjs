import assert from 'assert';
import * as lib from '../dist/index.mjs';

function testAssert() {
  assert.doesNotThrow(() => {
    lib.assert(true, 'message');
  }, 'assert(true) should not throw');
  assert.throws(() => {
    lib.assert(false, 'message');
  }, 'assert(false) should throw');
}

function testAssertEqual() {
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

function testAssertThrows() {
  assert.doesNotThrow(() => {
    lib.assertThrows(() => {
      throw new Error();
    });
  }, 'should not throw when the inner function throws');
  assert.throws(() => {
    lib.assertThrows(() => {});
  }, 'should throw when the inner function does not throw');
}

(async () => {
  try {
    testAssert();
    testAssertEqual();
    testAssertThrows();
    console.log('Passed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed:');
    console.error(error);
    process.exit(1);
  }
})();
