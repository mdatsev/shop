const methods = require('./methods.js');

// const PARSE_ERROR = -32700;
// const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
// const INVALID_PARAMS = -32602;
// const INTERNAL_ERROR = -32603;
// const SERVER_ERROR = -32000 to -32099;

module.exports = async (ctx, next) => {
  const { method, params, id } = ctx.request.body;

  function success (result) {
    ctx.body = {
      jsonrpc: '2.0',
      result,
      id,
    };
  }

  function error (code, message, data) {
    ctx.body = {
      jsonrpc: '2.0',
      error: {
        code,
        message,
        data,
      },
      id,
    };
  }

  try {
    const apiCtx = {
      organizationId: 1,
    };

    if (method in methods) {
      success(await methods[method](params, apiCtx));
    } else {
      error(METHOD_NOT_FOUND, `Method not found.`, { method });
    }
  } catch (e) {
    error(-1, 'Uncaught exception', { debug: e });
    throw e;
  }
};
