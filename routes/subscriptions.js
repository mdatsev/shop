const router = new (require('koa-router'))({ prefix: '/subscriptions' });

const subscription = require('../dbmodels/subscription.js');

router.get('/:id/show', async ctx => {
  const subscr = await subscription.get(ctx.params.id);

  subscr.period = Object.entries(subscr.period).map(([duration, number]) => `${number} ${duration}`).join(' ');
  await ctx.render('subscriptions/show', subscr);
});

module.exports = router;
