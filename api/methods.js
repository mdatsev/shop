const product = require('../dbmodels/product.js');
const subscription = require('../dbmodels/subscription.js');

const api = {
  async createProduct ({ name, price, description, specs, availableQuantity }, apiCtx) {
    return product.create({
      name,
      description,
      price,
      specs,
      availableQuantity,
      organizationId: apiCtx.organizationId,
    });
  },

  async updateProduct ({ id, name, price, description, specs, availableQuantity }, apiCtx) {
    await product.update({
      id,
      name,
      description,
      price,
      specs,
      availableQuantity,
    });
    return {};
  },

  // async getProduct ({ id }, apiCtx) {
  //   return product.get(id);
  // },

  // async deleteProduct ({ id }, apiCtx) {
  //   await product.delete(id);
  //   return {};
  // },

  // async getAllOrgProducts (_params, apiCtx) {
  //   return product.getAllOrg(apiCtx.organizationId);
  // },

  // async createSubscription ({ name, description, price, specs, period }, apiCtx) {
  //   return subscription.create({
  //     name,
  //     description,
  //     price,
  //     specs,
  //     period,
  //     organizationId: apiCtx.organizationId,
  //   });
  // },

  // async updateSubscription ({ id, name, price, description, specs, period }, apiCtx) {
  //   await subscription.update({
  //     id,
  //     name,
  //     description,
  //     price,
  //     specs,
  //     period,
  //   });
  //   return {};
  // },

  // async getSubscription ({ id }, apiCtx) {
  //   return subscription.get(id);
  // },

  // async deleteSubscription ({ id }, apiCtx) {
  //   await subscription.delete(id);
  //   return {};
  // },

  // async getAllOrgSubscriptions (_params, apiCtx) {
  //   return subscription.getAllOrg(apiCtx.organizationId);
  // },
};

module.exports = api;
