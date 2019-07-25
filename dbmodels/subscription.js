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
  async create ({ name, price, description, specs, period, organizationId }) {
    return db.doTransaction(async client => {
      const itemId = await item.create({
        name,
        price,
        type: 'subscription',
        specs,
        organizationId,
        description,
      }, client);

      const result = await client.query(`
        INSERT INTO subscription (item_id, period)
        VALUES ($itemId, $period)
        RETURNING id`, {
        itemId,
        period,
      });

      return result.rows[0].id;
    });
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

  async delete (id) {
    await db.doTransaction(async client => {
      const result = await client.query(`
        DELETE FROM subscription
        WHERE subscription.id = $id
        RETURNING item_id`, {
        id,
      });

      await item.delete(result.rows[0].item_id, client);
    });
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
