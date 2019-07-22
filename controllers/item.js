const db = require('../db.js');

module.exports = {
  async create ({ name, organizationId, type, specs, price }, client) {
    const result = await db.query(`
      INSERT INTO "item" ("name", "organization_id", "type", "price")
      VALUES ($name, $organizationId, $type, $price)
      RETURNING "id"`, {
      name,
      price,
      type,
      organizationId,
    }, client);

    return result.rows[0].id;
  },
};
