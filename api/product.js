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

  async update ({ id, name, price, description, specs, availableQuantity }, apiCtx) {
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

  async get ({ id }, apiCtx) {
    return product.get(id);
  },

  async delete ({ id }, apiCtx) {
    await product.delete(id);
    return {};
  },

  async getAllOrg (_params, apiCtx) {
    return product.getAllOrg(apiCtx.organizationId);
  },
};
