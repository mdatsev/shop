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

  async delete (id, client) {
    await db.query(`
      DELETE FROM item
      WHERE item.id = $id`, {
      id,
    }, client);
  },

  async getAll (limit) {
    const result = await db.query(`
      SELECT
        COALESCE(p.id, s.id) as id,
        i.name as name, 
        i.description as description,
        i.type as type,
        i.price as price,
        p.available_quantity as "availableQuantity",
        s.period as period
      FROM item i
      LEFT JOIN product p ON p.item_id = i.id
      LEFT JOIN subscription s ON s.item_id = i.id
      LIMIT $limit`, {
      limit,
    });

    return result.rows;
  },
};
