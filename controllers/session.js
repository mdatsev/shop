const db = require('../db.js');
const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);
const getDefaultExpiration = () =>
  new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);//= now + approx. 1 year

module.exports = {
  async create ({ userId, expirationDate = getDefaultExpiration() }, client) {
    const result = await db.query(`
      INSERT INTO "session" ("user_id", "expiration", "secret")
      VALUES ($userId, $expirationDate, $secret)
      RETURNING "secret"`, {
      userId,
      expirationDate,
      secret: (await randomBytes(64)).toString('base64'),
    }, client);

    return result.rows[0].secret;
  },
  async verify ({ userId, secret }, client) {
    const result = await db.query(`
      SELECT NULL
      FROM session
      WHERE user_id = $userId AND secret = $secret AND expiration > NOW()`, {
      userId,
      secret,
    }, client);

    return result.rowCount > 0;
  },
};
