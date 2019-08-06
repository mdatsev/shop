const assert = require('../utils/assert.js');

const product = require('../dbmodels/product.js');
const subscription = require('../dbmodels/subscription.js');

async function hasProductAccess (id, apiCtx) {
  const { organizationId } = apiCtx;

  const prod = await product.get(id);

  if (!prod)
    return false;

  return prod.organizationId === organizationId;
}

async function hasSubscriptionAccess (id, apiCtx) {
  const { organizationId } = apiCtx;

  const subscr = await subscription.get(id);

  if (!subscr)
    return false;

  return subscr.organizationId === organizationId;
}

const api = {
  async createProduct ({ name, price, description, specs, image, availableQuantity }, apiCtx) {
    return product.create({
      name,
      description,
      price,
      specs,
      availableQuantity,
      image,
      organizationId: apiCtx.organizationId,
    });
  },

  async getProduct ({ id }, apiCtx) {
    assert.user(await hasProductAccess(id, apiCtx), 'Unauthorized for this product');
    return product.get(id);
  },

  async updateProduct ({ id, name, price, description, specs, availableQuantity }, apiCtx) {
    assert.user(await hasProductAccess(id, apiCtx), 'Unauthorized for this product');
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

  async deleteProduct ({ id }, apiCtx) {
    assert.user(await hasProductAccess(id, apiCtx), 'Unauthorized for this product');
    await product.delete(id);
    return {};
  },

  async getAllOrgProducts (_params, apiCtx) {
    return product.getAllOrg(apiCtx.organizationId);
  },

  async createSubscription ({ name, description, price, image, specs, period }, apiCtx) {
    return subscription.create({
      name,
      description,
      price,
      image,
      specs,
      period,
      organizationId: apiCtx.organizationId,
    });
  },

  async getSubscription ({ id }, apiCtx) {
    assert.user(await hasSubscriptionAccess(id, apiCtx), 'Unauthorized for this subscription');
    return subscription.get(id);
  },

  async updateSubscription ({ id, name, price, description, specs, period }, apiCtx) {
    assert.user(await hasSubscriptionAccess(id, apiCtx), 'Unauthorized for this subscription');
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

  async deleteSubscription ({ id }, apiCtx) {
    assert.user(await hasSubscriptionAccess(id, apiCtx), 'Unauthorized for this subscription');
    await subscription.delete(id);
    return {};
  },

  async getAllOrgSubscriptions (_params, apiCtx) {
    return subscription.getAllOrg(apiCtx.organizationId);
  },
};

module.exports = api;
