const assert = require('assert').strict;

module.exports = {
  assert,
  assertType (value, type, message) {
    assert.strictEqual(typeof value, type, message);
  },
};
