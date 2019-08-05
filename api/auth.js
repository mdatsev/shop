const assert = require('../utils/assert.js');
const _ = require('lodash');
// const organization = require('../controllers/organization.js');

module.exports = {
  async auth (authInfo) {
    assert.user(_.isObjectLike(authInfo), 'Invalid or missing authInfo');
    const { organizationId/*, organizationSecret */ } = authInfo;

    // const realSecret = organization.getSecret(organizationId);
    // todo some real checking
    return { organizationId };
  },
};
