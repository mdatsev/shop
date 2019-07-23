const product = require('../controllers/product.js');

module.exports = {
  async create ({ name, price, specs, availableQuantity }, apiCtx) {
    return product.create({
      name,
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
