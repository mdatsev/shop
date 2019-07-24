// const organization = require('../controllers/organization.js');

module.exports = {
  async auth (authInfo) {
    if (!authInfo) {
      throw Error('No auth info provided');
    }
    const { organizationId/*, organizationSecret */ } = authInfo;

    // const realSecret = organization.getSecret(organizationId);
    // todo some real checking
    return { organizationId };
  },
};
