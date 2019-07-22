const subscription = require('../controllers/subscription.js');

module.exports = {
  async create ({ name, price, specs, period }, apiCtx) {
    return subscription.create({
      name,
      price,
      specs,
      period,
      organizationId: apiCtx.organizationId,
    });
  },
};
