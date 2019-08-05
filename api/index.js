const parse = require('co-body');
const _ = require('lodash');
const assert = require('../utils/assert.js');
const RPC = require('./RPC.js');

const MAX_CONTENT_LENGTH = 1000 * 1000;

const STATUS_UNSUPORTED_MEDIA_TYPE = 415;
const STATUS_METHOD_NOT_ALLOWED = 405;

const ERR_PARSE_ERROR = -32700;
const ERR_INVALID_REQUEST = -32600;
const ERR_METHOD_NOT_FOUND = -32601;
const ERR_INTERNAL_ERROR = -32603;
const ERR_INVALID_PARAMS = -32602;

const ERR_PAYLOAD_TOO_LARGE = -1;
const ERR_USER_ERROR = -2;

// todo:
// handle notification
// handle batch

module.exports = async ctx => {
  let id = null;

  function success (result) {
    assert.system(_.isObjectLike(result), 'Result must be object');
    ctx.body = {
      jsonrpc: '2.0',
      result,
      id,
    };
  }

  function error (code, message, data) {
    assert.system(_.inRange(-32000, -32100), 'Error code reserved');
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

  if (ctx.method !== 'POST')
    return (ctx.status = STATUS_METHOD_NOT_ALLOWED);

  if (!ctx.request.is('application/json'))
    return (ctx.status = STATUS_UNSUPORTED_MEDIA_TYPE);

  if (ctx.length > MAX_CONTENT_LENGTH) {
    return error(ERR_PAYLOAD_TOO_LARGE, 'Payload too large');
  }

  let body;

  try {
    body = await parse.json(ctx, { strict: true });
  } catch (e) {
    return error(ERR_PARSE_ERROR, 'Parse error');
  }

  id = body.id;
  const { method, params } = body;

  const isVersionValid = body.jsonrpc === '2.0';
  const isIdValid = _.isInteger(id) || _.isString(id) || _.isNull(id);
  const isMethodValid = _.isString(body.method);
  const isParamsValid = _.isObjectLike(params);

  if (
    !isVersionValid ||
    !isMethodValid ||
    !isIdValid ||
    !isParamsValid
  ) {
    return error(ERR_INVALID_REQUEST, 'Invalid Request', { isVersionValid, isMethodValid, isIdValid, isParamsValid });
  }

  if (!RPC.exists(method))
    return error(ERR_METHOD_NOT_FOUND, 'Method not found', { method });

  const { valid: paramsValid, message } = RPC.validateParams({ method, params });

  if (!paramsValid)
    return error(ERR_INVALID_PARAMS, 'Invalid params', message);

  try {
    const result = await RPC.call({ method, params });

    return success(result);
  } catch (err) {
    if (err instanceof assert.UserError)
      return error(ERR_USER_ERROR, err.message);

    console.log(err);
    return error(ERR_INTERNAL_ERROR, 'Internal error');
  }
};
