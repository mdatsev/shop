const product = require('./product.js');
const subscription = require('./subscription.js');

const api = {
  createProduct: product.create,
  getProduct: product.get,
  deleteProduct: product.delete,
  getAllOrgProducts: product.getAllOrg,

  createSubscription: subscription.create,
  getSubscription: subscription.get,
  deleteSubscription: subscription.delete,
  getAllOrgSubscriptions: subscription.getAllOrg,
};

module.exports = api;
