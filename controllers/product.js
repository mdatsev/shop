const db = require('../db.js');
const item = require('./item.js');

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
};
