const methods = require('./methods.js');

module.exports = async (ctx, next) => {
  const apiCtx = {
    organizationId: 1,
  };
  const { method, params, id } = ctx.request.body;
  const result = await methods[method](params, apiCtx);

  ctx.body = {
    jsonrpc: '2.0',
    result,
    id,
  };
};
