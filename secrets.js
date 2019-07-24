const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);

module.exports = {
  async generate () {
    return (await randomBytes(64)).toString('base64');
  },
  compare (a, b) {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  },
};
