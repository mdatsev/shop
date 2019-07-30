require('dotenv').config();
const db = require('./db.js');

(async () => {
  db.doTransaction(async t => {
    await t.query(`
    INSERT INTO "item" ("name", "organization_id", "type", "price")
    VALUES ($name, $organizationId, $type, $price)
      RETURNING "id"`, {
      type: 'product',
      organizationId: 1,
      name: '111111',
      price: 111,
    });
  });
})();

// let func;
// let someParameter;
// let someOtherFunction;

// func([],
//   'b'
// );
// func(
//   [],
//   'b'
// );
// func([
//   someParameter, someParameter, someParameter],
// someOtherFunction(someParameter));
