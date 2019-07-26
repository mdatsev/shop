const product = require('./product.js');
const subscription = require('./subscription.js');

const api = {
  createProduct: product.create,
  getProduct: product.get,
  updateProduct: product.update,
  deleteProduct: product.delete,
  getAllOrgProducts: product.getAllOrg,

  createSubscription: subscription.create,
  getSubscription: subscription.get,
  updateSubscription: subscription.update,
  deleteSubscription: subscription.delete,
  getAllOrgSubscriptions: subscription.getAllOrg,
};

module.exports = api;
