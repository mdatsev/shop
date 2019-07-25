const db = require('../db.js');
const item = require('./item.js');

const EXPOSED_FIELDS = `
  subscription.id as id,
  subscription.period as period,
  item.name as name,
  item.type as type,
  item.price as price
`;

module.exports = {
  async create ({ name, price, description, specs, period, organizationId }, client) {
    return db.doTransaction(async client => {
      const id = await item.create({
        name,
        price,
        type: 'subscription',
        specs,
        organizationId,
        description,
      }, client);

      await db.query(`
        INSERT INTO subscription (item_id, period)
        VALUES ($id, $period)`, {
        id,
        period,
      }, client);
      return id;
    }, client);
  },

  async get (id) {
    const result = await db.query(`
      SELECT ${EXPOSED_FIELDS}
      FROM subscription
      INNER JOIN item on subscription.item_id = item.id
      WHERE subscription.id = $id`, {
      id,
    });

    return result.rows[0];
  },

  async getAllOrg (id) {
    const result = await db.query(`
      SELECT ${EXPOSED_FIELDS}
      FROM subscription 
      INNER JOIN item on subscription.item_id = item.id 
      WHERE item.organization_id = $id;`, {
      id,
    });

    return result.rows;
  },
};
