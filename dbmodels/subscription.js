const db = require('../db.js');
const item = require('./item.js');

// function validate ({ period }) {
// // todo
// }

module.exports = {
  async create ({ name, price, description, specs, period, organizationId, image }) {
    return db.doTransaction(async client => {
      const itemId = await item.create({
        name,
        price,
        type: 'subscription',
        specs,
        organizationId,
        description,
        image,
      }, client);

      const result = await client.query(`
        INSERT INTO subscription (item_id, period)
        VALUES ($itemId, $period)
        RETURNING id`, {
        itemId,
        period,
      });

      return result.rows[0];
    });
  },

  async get (id) {
    const result = await db.query(`
      SELECT 
        subscription.id as id,
        subscription.period as period,
        item.id as "itemId",
        item.name as name,
        item.type as type,
        item.price as price,
        item.organization_id as "organizationId",
        item.image as image,
        organization.name as "organizationName"
      FROM subscription
      INNER JOIN item on subscription.item_id = item.id
      INNER JOIN organization on item.organization_id = organization.id
      WHERE subscription.id = $id`, {
      id,
    });

    return result.rows[0];
  },

  async update ({ id, name, price, description, specs, period }) {
    return db.doTransaction(async client => {
      const result = await client.query(`
        UPDATE subscription
        SET
          period = $period
        WHERE id = $id
        RETURNING item_id`, {
        period,
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
      SELECT
        subscription.id as id,
        subscription.period as period,
        item.id as "itemId",
        item.name as name,
        item.type as type,
        item.price as price,
        item.organization_id as "organizationId",
        item.image as image
      FROM subscription 
      INNER JOIN item on subscription.item_id = item.id
      WHERE item.organization_id = $id;`, {
      id,
    });

    return result.rows;
  },

  async addPopularity ({ itemId }) {
    await item.addPopularity({ id: itemId });
  },
};
