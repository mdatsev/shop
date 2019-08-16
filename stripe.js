const stripe = require('stripe')('sk_test_0gAU6tNbblQnwj3ynIg4t4Mk00voPXU34K');
const request = require('request-promise-native');

const assert = require('./utils/assert.js');

module.exports = {
  stripe,
  recieveStripeAuth: async ({ code }) => {
    const data = {
      code,
      client_secret: 'sk_test_0gAU6tNbblQnwj3ynIg4t4Mk00voPXU34K',
      grant_type: 'authorization_code',
    };

    const response = JSON.parse(await request.post('https://connect.stripe.com/oauth/token', { form: data }));
    const {
      access_token: accessToken,
      livemode,
      refresh_token: refreshToken,
      token_type: tokenType,
      stripe_publishable_key: stripePublishableKey,
      stripe_user_id: stripeUserId,
      scope: responseScope,
    } = response;

    assert.peer(accessToken);
    assert.peer(livemode === false);
    assert.peer(refreshToken);
    assert.peer(tokenType === 'bearer');
    assert.peer(stripePublishableKey);
    assert.peer(stripeUserId);
    assert.peer(responseScope === 'read_only');

    return { stripeUserId, accessToken };
  },
};
