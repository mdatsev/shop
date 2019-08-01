const assert = require('../util/assert.js');
const db = require('../db.js');

function validate ({ name }) {
  assert.user(name, 'name must be present');
}

module.exports = {
  async create ({ name, ownerId }) {
    validate({ name });
    const result = await db.query(`
      INSERT INTO organization (name, owner_id)
      VALUES ($name, $ownerId)
      RETURNING id`, {
      name,
      ownerId,
    });

    return result.rows[0].id;
  },

  async get (id) {
    const result = await db.query(`
      SELECT name, owner_id
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

  async getSecret (id) {
    const result = await db.query(`
      SELECT secret
      FROM organization
      WHERE id = $id`, {
      id,
    });

    return result.rows[0].secret;
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
};
