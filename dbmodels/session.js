const db = require('../db.js');
const secrets = require('../util/secrets.js');

module.exports = {
  async create ({ userId, expirationDate }) {
    const result = await db.query(`
      INSERT INTO session (user_id, expiration, secret)
      VALUES ($userId, $expirationDate, $secret)
      RETURNING secret`, {
      userId,
      expirationDate,
      secret: await secrets.generate(),
    });

    return result.rows[0].secret;
  },

  async delete ({ secret }) {
    await db.query(`
      DELETE
      FROM session
      WHERE secret = $secret`, {
      secret,
    });
  },

  async verify ({ userId, secret }) {
    const result = await db.query(`
      SELECT secret
      FROM session
      WHERE user_id = $userId AND $secret = secret AND expiration > NOW()`, {
      userId,
      secret,
    });

    return result.rowCount > 0;
  },
};
