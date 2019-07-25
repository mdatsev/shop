const subscription = require('../dbmodels/subscription.js');

module.exports = {
  async create ({ name, description, price, specs, period }, apiCtx) {
    return subscription.create({
      name,
      description,
      price,
      specs,
      period,
      organizationId: apiCtx.organizationId,
    });
  },

  async get ({ id }, apiCtx) {
    return subscription.get(id);
  },

  async getAllOrg (_params, apiCtx) {
    return subscription.getAllOrg(apiCtx.organizationId);
  },
};
