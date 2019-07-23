const product = require('./product.js');
const subscription = require('./subscription.js');

const api = {
  createProduct: product.create,
  createSubscription: subscription.create,
  getAllOrgProducts: product.getAllOrg,
  getProduct: product.get,
  getAllOrgSubscriptions: subscription.getAllOrg,
  getSubscription: subscription.get,
};

module.exports = api;
