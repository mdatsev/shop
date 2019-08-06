const crypto = require('crypto');
const util = require('util');
const _ = require('lodash');
const randomBytes = util.promisify(crypto.randomBytes);

module.exports = {
  async generate () {
    return (await randomBytes(64)).toString('base64');
  },

  compare (a, b) {
    if (
      !_.isString(a) ||
      !_.isString(b) ||
      a.length !== b.length
    ) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  },
};
