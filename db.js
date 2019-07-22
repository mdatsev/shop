const { Pool } = require('pg');
const { patch } = require('node-postgres-named');
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const originalConnect = pool.connect.bind(pool);

patch(pool);
pool.connect = async function () {
  return patch(await originalConnect());
};

module.exports = {
  query: async (text, params, client) => {
    if (client === undefined) {
      const client = await pool.connect();
      const result = await client.query(text, params);

      client.release();
      return result;
    } else {
      return client.query(text, params);
    }
  },

  doTransaction: async (callback, client) => {
    if (client === undefined) {
      client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await callback(client);

        await client.query('COMMIT');
        return result;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } else {
      return callback(client);
    }
  },
};
