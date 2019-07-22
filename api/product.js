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
};
