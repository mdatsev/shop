const assert = require('../utils/assert.js');
const db = require('../db.js');

module.exports = {
  async create ({ name, value, itemId }, client) {
    await db.doTransaction(async client => {
      const result = await client.query(`
        INSERT INTO spec (name)
        VALUES ($name)
        ON CONFLICT (name) DO
          UPDATE
          SET
            name=EXCLUDED.name
        RETURNING id;`, {
        name,
      });

      await client.query(`
        INSERT INTO item_spec (item_id, spec_id, value)
        VALUES ($itemId, $specId, $value);`, {
        itemId,
        specId: result.rows[0].id,
        value,
      });
    }, client);
  },

  async get ({ itemId, compact = false }) {
    const result = await db.query(`
      SELECT spec.name, item_spec.value
      FROM item
      INNER JOIN item_spec ON item.id = item_spec.item_id
      INNER JOIN spec on spec.id = item_spec.spec_id
      WHERE item.id = $itemId`, {
      itemId,
    });

    return compact
      ? result.rows.reduce((a, { name, value }) => ({ [name]: value, ...a }), {})
      : result.rows;
  },

};
