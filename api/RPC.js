const methods = require('./methods.js');
const apiAuth = require('./auth.js');

module.exports = {
  exists (method) {
    return method in methods;
  },
  paramsValid ({ method, params }) {
    return true; // todo
  },
  async call ({ method, params }) {
    const {
      functionParams,
      authInfo,
    } = params;

    const { organizationId } = await apiAuth.auth(authInfo);

    const apiCtx = {
      organizationId,
    };

    return methods[method](functionParams, apiCtx);
  },
};
