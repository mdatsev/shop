require('dotenv').config();

const item = require('../dbmodels/item.js');

const request = require('request-promise-native');

(async () => {
  const items = await item.getAll();

  for (const { id, name, description, quantity, price } of items) {
    const { result } = await request.post('http://10.20.1.158:3000/rpc', {
      json: {
        jsonrpc: '2.0',
        method: 'createClassified',
        params: {
          title: name,
          description,
          quantity,
          price,
          api_key: '8710ed58072f4ab4dbadbcbd1d841969af25ec00bd6f3ff61cbb24856d59',
          type: 'other',
        },
        id: 1,
      },
    });

    console.log(result, id);
  }
})();
