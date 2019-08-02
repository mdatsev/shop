const assert = require('../utils/assert.js');
const db = require('../db.js');
const item = require('./item.js');

const EXPOSED_FIELDS = `
  product.id as id,
  product.available_quantity as "availableQuantity",
  item.id as "itemId",
  item.name as name,
  item.type as type,
  item.price as price,
  item.description as description,
  item.organization_id as "organizationId",
  item.image as image
`;

function validate ({ availableQuantity }) {
  assert.user(BigInt(availableQuantity) > 0, 'available quantity must be greater than 0');
}

module.exports = {
  async create ({ name, price, description, specs, availableQuantity, organizationId, image }) {
    validate({ availableQuantity });
    return db.doTransaction(async client => {
      const itemId = await item.create({
        name,
        price,
        type: 'product',
        specs,
        organizationId,
        description,
        image,
      }, client);

      const result = await client.query(`
        INSERT INTO product (item_id, available_quantity)
        VALUES ($itemId, $availableQuantity)
        RETURNING id`, {
        itemId: itemId,
        availableQuantity,
      });

      return result.rows[0].id;
    });
  },

  async get (id) {
    const result = await db.query(`
      SELECT ${EXPOSED_FIELDS}
      FROM product
      INNER JOIN item on product.item_id = item.id
      WHERE product.id = $id`, {
      id,
    });

    return result.rows[0];
  },

  async update ({ id, name, price, description, specs, availableQuantity }) {
    validate({ availableQuantity });
    return db.doTransaction(async client => {
      const result = await client.query(`
        UPDATE product
        SET
          available_quantity = $availableQuantity
        WHERE id = $id
        RETURNING item_id`, {
        availableQuantity,
        id,
      });

      await item.update({
        id: result.rows[0].item_id,
        name,
        price,
        specs,
        description,
      }, client);
    });
  },

  async delete (id) {
    await db.doTransaction(async client => {
      const result = await client.query(`
        DELETE FROM product
        WHERE product.id = $id
        RETURNING item_id`, {
        id,
      });

      await item.delete(result.rows[0].item_id, client);
    });
  },

  async getAllOrg (id) {
    const result = await db.query(`
      SELECT ${EXPOSED_FIELDS}
      FROM product 
      INNER JOIN item on product.item_id = item.id 
      WHERE item.organization_id = $id;`, {
      id,
    });

    return result.rows;
  },
};
