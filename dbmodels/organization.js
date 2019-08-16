const assert = require('../utils/assert.js');
const db = require('../db.js');
const secrets = require('../utils/secrets.js');

function validate ({ name }) {
  assert.user(name, 'name must be present');
}

module.exports = {
  async create ({ name, ownerId }) {
    validate({ name });
    const result = await db.query(`
      INSERT INTO organization (name, owner_id, secret_key)
      VALUES ($name, $ownerId, $secretKey)
      RETURNING id`, {
      name,
      ownerId,
      secretKey: await secrets.generate(),
    });

    return result.rows[0];
  },

  async get (id) {
    const result = await db.query(`
      SELECT id, name, owner_id, secret_key, stripe_user_id
      FROM organization
      WHERE id = $id`, {
      id,
    });

    return result.rows[0];
  },

  async update ({ id, name }) {
    await db.query(`
      UPDATE organization
      SET
        name = $name
      WHERE id = $id`, {
      id,
      name,
    });
  },

  async delete (id) {
    await db.query(`
      DELETE FROM organization
      WHERE id = $id`, {
      id,
    });
  },

  async getAllOfUser (id) {
    const result = await db.query(`
      SELECT name, id
      FROM organization
      WHERE owner_id = $id`, {
      id,
    });

    return result.rows;
  },

  async setStripeAccount ({ id, stripeUserId, stripeAccessToken }) {
    await db.query(`
      UPDATE organization
      SET
        stripe_user_id = $stripeUserId,
        stripe_access_token = $stripeAccessToken
      WHERE id = $id`, {
      id,
      stripeUserId,
      stripeAccessToken,
    });
  },

  async regenerateKey ({ id }) {
    const secretKey = await secrets.generate();

    await db.query(`
      UPDATE organization
      SET
        secret_key = $secretKey
      WHERE id = $id`, {
      id,
      secretKey,
    });
  },
};
