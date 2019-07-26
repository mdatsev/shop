const db = require('../db.js');

module.exports = {
  async create ({ lat, lng, organizationId }) {
    const result = await db.query(`
      INSERT INTO shop (lat, lng, organization_id)
      VALUES ($lat, $lng, $organizationId)
      RETURNING id`, {
      lat,
      lng,
      organizationId,
    });

    return result.rows[0].id;
  },

  async update ({ id, lat, lng }) {
    await db.query(`
      UPDATE shop
      SET
        lat = $lat,
        lng = $lng
      WHERE id = $id`, {
      lat,
      lng,
      id,
    });
  },

  async delete (id) {
    await db.query(`
      DELETE FROM shop
      WHERE shop.id = $id`, {
      id,
    });
  },

  async get (id) {
    const result = await db.query(`
      SELECT lat, lng, id
      FROM shop
      WHERE id = $id`, {
      id,
    });

    return result.rows[0];
  },

  async getAllOrg (id) {
    const result = await db.query(`
      SELECT lat, lng, id
      FROM shop
      WHERE organization_id = $id`, {
      id,
    });

    return result.rows;
  },
};
