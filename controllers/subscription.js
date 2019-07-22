const db = require('../db.js');
const item = require('./item.js');

module.exports = {
  async create ({ name, price, specs, period, organizationId }, client) {
    return db.doTransaction(async client => {
      const id = await item.create({
        name,
        price,
        type: 'subscription',
        specs,
        organizationId,
      }, client);

      await db.query(`
        INSERT INTO "subscription" ("id", "period")
        VALUES ($id, $period)`, {
        id,
        period,
      }, client);
      return id;
    }, client);
  },
};
