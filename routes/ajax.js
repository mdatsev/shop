const router = new (require('koa-router'))({ prefix: '/ajax' });
const stripe = require('stripe')('sk_test_0gAU6tNbblQnwj3ynIg4t4Mk00voPXU34K');
const shop = require('../dbmodels/shop.js');

router.post('/shopLocations', async ctx => {
  const { organizationId } = ctx.request.body;

  ctx.body = await shop.getAllOrg(organizationId);
});

const generatePaymentResponse = (intent) => {
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    };
  } else if (intent.status === 'succeeded') {
    return {
      success: true,
    };
  } else {
    return {
      error: 'Invalid PaymentIntent status',
    };
  }
};

router.post('/confirm_payment', async ctx => {
  try {
    let intent;

    if (ctx.request.body.payment_method_id) {
      intent = await stripe.paymentIntents.create({
        payment_method: ctx.request.body.payment_method_id,
        amount: 1099,
        currency: 'usd',
        confirmation_method: 'manual',
        confirm: true, // on_behalf_of, application_fee_amount, customer, metadata
      });
    } else if (ctx.request.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
        ctx.request.body.payment_intent_id
      );
    }
    ctx.body = (generatePaymentResponse(intent));
  } catch (e) {
    console.log(e);
    // Display error on client
    ctx.body = ({ error: e.message });
  }
});

module.exports = router;
