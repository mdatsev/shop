const router = new (require('koa-router'))({ prefix: '/subscriptions' });

const subscription = require('../dbmodels/subscription.js');

router.get('/:id/show', async ctx => {
  const subscr = await subscription.get(ctx.params.id);

  await subscription.addPopularity(subscr);

  await ctx.render('subscriptions/show', subscr);
});

module.exports = router;
