const product = require('./product.js');
const subscription = require('./subscription.js');

const api = {
  createProduct: product.create,
  createSubscription: subscription.create,
};

module.exports = api;
