const subscription = require('../dbmodels/subscription.js');

module.exports = {
  async create ({ name, description, price, specs, period, image }, apiCtx) {
    return subscription.create({
      name,
      description,
      price,
      specs,
      period,
      image,
      organizationId: apiCtx.organizationId,
    });
  },

  async update ({ id, name, price, description, specs, period }, apiCtx) {
    await subscription.update({
      id,
      name,
      description,
      price,
      specs,
      period,
    });
    return {};
  },

  async get ({ id }, apiCtx) {
    return subscription.get(id);
  },

  async delete ({ id }, apiCtx) {
    await subscription.delete(id);
    return {};
  },

  async getAllOrg (_params, apiCtx) {
    return subscription.getAllOrg(apiCtx.organizationId);
  },
};
