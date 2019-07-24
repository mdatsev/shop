const db = require('../db.js');

module.exports = {
  async create ({ name, ownerId }) {
    const result = await db.query(`
      INSERT INTO "organization" ("name", "owner_id")
      VALUES ($name, $ownerId)
      RETURNING "id"`, {
      name,
      ownerId,
    });

    return result.rows[0].id;
  },

  async get (id) {
    const result = await db.query(`
      SELECT name
      FROM organization
      WHERE id = $id`, {
      id,
    });

    return result.rows[0];
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
