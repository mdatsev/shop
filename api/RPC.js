const assert = require('../utils/assert.js');
const methods = require('./methods.js');
const apiAuth = require('./auth.js');

const Ajv = require('ajv');
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const authInfoSchema = require('./schemas/authInfo.json');

for (const method in methods) {
  const schemaPath =
    `./schemas/methodParams/${method}.json`;
  let methodParamsSchema;

  try {
    methodParamsSchema = require(schemaPath);
  } catch (e) {
    assert.system(false, `Cannot import schema ${schemaPath}: ${e.message}`);
  }

  ajv.addSchema({
    type: 'object',
    properties: {
      methodParams: methodParamsSchema,
      authInfo: authInfoSchema,
    },
    required: ['methodParams', 'authInfo'],
    additionalProperties: false,
  }, method);
}

module.exports = {
  exists (method) {
    return method in methods;
  },

  validateParams ({ method, params }) {
    const valid = ajv.validate(method, params);

    return {
      valid,
      message: ajv.errorsText(undefined, { dataVar: 'params' }),
    };
  },

  async call ({ method, params }) {
    const {
      methodParams,
      authInfo,
    } = params;

    const { organizationId } = await apiAuth.auth(authInfo);

    const apiCtx = {
      organizationId,
    };

    return methods[method](methodParams, apiCtx);
  },
};
