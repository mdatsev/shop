const product = require('../dbmodels/product.js');

module.exports = {
  async create ({ name, price, description, specs, availableQuantity }, apiCtx) {
    return product.create({
      name,
      description,
      price,
      specs,
      availableQuantity,
      organizationId: apiCtx.organizationId,
    });
  },

  async get ({ id }, apiCtx) {
    return product.get(id);
  },

  async getAllOrg (_params, apiCtx) {
    return product.getAllOrg(apiCtx.organizationId);
  },
};
