const assert = require('../utils/assert.js');
const secrets = require('../utils/secrets.js');
const organization = require('../dbmodels/organization.js');

module.exports = {
  async auth (authInfo) {
    const { organizationId, organizationSecret } = authInfo;

    const org = await organization.get(organizationId);

    assert.user(org, 'Invalid organization id');

    const realSecret = org.secret_key;

    assert.user(secrets.compare(organizationSecret, realSecret), 'Invalid organization secret');

    return { organizationId };
  },
};
