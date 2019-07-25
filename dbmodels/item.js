const db = require('../db.js');

module.exports = {
  async create ({ name, description, organizationId, type, specs, price }, client) {
    const result = await db.query(`
      INSERT INTO item (name, organization_id, type, price, description)
      VALUES ($name, $organizationId, $type, $price, $description)
      RETURNING id`, {
      name,
      price,
      type,
      organizationId,
      description,
    }, client);

    return result.rows[0].id;
  },

  async getAll (limit) {
    const result = await db.query(`
      SELECT name, description, type, price
      FROM item
      LIMIT $limit`, {
      limit,
    });

    return result.rows;
  },
};
