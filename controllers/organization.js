const db = require('../db.js');

module.exports = {
  async getAllOfUser (id) {
    const result = await db.query(`
      SELECT name
      FROM organization
      WHERE owner_id = $id`, {
      id,
    });

    return result.rows;
  },
};
