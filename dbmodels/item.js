const assert = require('../utils/assert.js');
const db = require('../db.js');
const spec = require('./spec.js')

function validate ({ price, name }) {
  assert.user(BigInt(price) > 0, 'price must be greater than 0');
  assert.user(name, 'name must be present');
}

module.exports = {
  async create ({ name, description, organizationId, type, specs = [], price, image }, client) {
    validate({ price, name });
    return db.doTransaction(async client => {
      const result = await client.query(`
        INSERT INTO item (name, organization_id, type, price, description, image)
        VALUES ($name, $organizationId, $type, $price, $description, $image)
        RETURNING id`, {
        name,
        price,
        type,
        organizationId,
        description,
        image,
      });
      const itemId = result.rows[0].id;

      for (const { name, value } of specs) {
        spec.create({ name, value, itemId }, client);
      }

      return itemId;
    }, client);
  },

  async update ({ id, name, description, specs, price }, client) {
    validate({ price, name });
    await db.query(`
      UPDATE item
      SET
        name = $name,
        price = $price,
        description = $description
      WHERE id = $id`, {
      name,
      price,
      description,
      id,
    }, client);
  },

  async delete (id, client) {
    await db.query(`
      DELETE FROM item
      WHERE item.id = $id`, {
      id,
    }, client);
  },

  async getAll ({ limit, offset, order, ascending }) {
    const result = await db.query(`
      SELECT
        COALESCE(p.id, s.id) as id,
        i.name as name, 
        i.description as description,
        i.type as type,
        i.price as price,
        i.image as image,
        p.available_quantity as "availableQuantity",
        s.period as period
      FROM item i
      LEFT JOIN product p ON p.item_id = i.id
      LEFT JOIN subscription s ON s.item_id = i.id
      ORDER BY ${db.escapeIdentifier(order)} ${ascending ? 'ASC' : 'DESC'}, i.id
      LIMIT $limit
      OFFSET $offset`, {
      limit,
      offset,
    });

    return result.rows;
  },
};
