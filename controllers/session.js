const db = require('../db.js');
const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);

module.exports = {
  async create ({ userId, expirationDate }, client) {
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

  async delete ({ secret }, client) {
    await db.query(`
      DELETE
      FROM session
      WHERE secret = $secret`, {
      secret,
    }, client);
  },

  async verify ({ userId, secret }, client) {
    const result = await db.query(`
      SELECT secret
      FROM session
      WHERE user_id = $userId AND expiration > NOW()`, {
      userId,
    }, client);

    return result.rowCount > 0 &&
      crypto.timingSafeEqual(Buffer.from(result.secret), Buffer.from(secret));
  },
};
