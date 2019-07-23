const db = require('../db.js');
const item = require('./item.js');

const EXPOSED_FIELDS = `
  product.id as "id",
  product.available_quantity as "availableQuantity",
  item.name as "name",
  item.type as "type",
  item.price as "price"
`;

module.exports = {
  async create ({ name, price, specs, availableQuantity, organizationId }, client) {
    return db.doTransaction(async client => {
      const id = await item.create({
        name,
        price,
        type: 'product',
        specs,
        organizationId,
      }, client);

      await db.query(`
        INSERT INTO "product" ("id", "available_quantity")
        VALUES ($id, $availableQuantity)`, {
        id,
        availableQuantity,
      }, client);
      return id;
    }, client);
  },

  async get (id) {
    const result = await db.query(`
      SELECT ${EXPOSED_FIELDS}
      FROM product
      INNER JOIN item on product.id = item.id
      WHERE product.id = $id`, {
      id,
    });

    return result.rows[0];
  },

  async getAllOrg (id) {
    const result = await db.query(`
      SELECT ${EXPOSED_FIELDS}
      FROM product 
      INNER JOIN item on product.id = item.id 
      WHERE item.organization_id = $id;`, {
      id,
    });

    return result.rows;
  },
};
