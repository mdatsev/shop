const router = new (require('koa-router'))({ prefix: '/orgs' });
const { loggedIn } = require('../middleware/user_auth.js');

const organization = require('../dbmodels/organization.js');
const product = require('../dbmodels/product.js');
const subscription = require('../dbmodels/subscription.js');

router.get('/', loggedIn, async ctx =>
  ctx.render('orgs/index', {
    orgs: await organization.getAllOfUser(ctx.auth.userId),
  })
);

router.get('/create', loggedIn, ctx => ctx.render('orgs/create'));
router.post('/create', loggedIn, async ctx => {
  const { name } = ctx.request.body;

  const id = await organization.create({ name, ownerId: ctx.auth.userId });

  ctx.redirect(`/orgs/${id}/edit/index`);
});

router.get('/:id/edit/index', loggedIn, async ctx => {
  await ctx.render('orgs/edit', await organization.get(ctx.params.id));
});
router.post('/:id/edit/index', loggedIn, async ctx => {
  // todo
  ctx.redirect('/orgs/edit');
});

router.get('/:id/edit/products', loggedIn, async ctx => {
  await ctx.render('orgs/edit/products/index', { products: await product.getAllOrg(ctx.params.id) });
});

router.get('/:id/edit/products/create', loggedIn, async ctx => {
  await ctx.render('orgs/edit/products/create', { products: await product.getAllOrg(ctx.params.id) });
});

router.post('/:id/edit/products/create', loggedIn, async ctx => {
  const { name, description, price, availableQuantity } = ctx.request.body;

  await product.create({
    name,
    description,
    price,
    availableQuantity,
    organizationId: ctx.params.id,
  });

  ctx.redirect('..');
});

router.get('/:orgId/edit/products/:productId/', loggedIn, async ctx => {
  await ctx.render('orgs/edit/products/edit', await product.get(ctx.params.productId));
});

router.post('/:orgId/edit/products/:productId/', loggedIn, async ctx => {
  const { name, description, price, availableQuantity } = ctx.request.body;

  await product.update({
    name,
    description,
    price,
    availableQuantity,
    id: ctx.params.productId,
  });

  ctx.redirect('..');
});

router.post('/:orgId/edit/products/:productId/delete', loggedIn, async ctx => {
  await product.delete(ctx.params.productId);
  ctx.redirect('..');
});

router.get('/:id/edit/subscriptions', loggedIn, async ctx => {
  await ctx.render('orgs/edit/subscriptions/index', { subscriptions: await subscription.getAllOrg(ctx.params.id) });
});

router.get('/:id/edit/subscriptions/create', loggedIn, async ctx => {
  await ctx.render('orgs/edit/subscriptions/create', { subscriptions: await subscription.getAllOrg(ctx.params.id) });
});

router.post('/:id/edit/subscriptions/create', loggedIn, async ctx => {
  const { name, description, price, period } = ctx.request.body;

  await subscription.create({
    name,
    description,
    price,
    period,
    organizationId: ctx.params.id,
  });

  ctx.redirect('.');
});

router.get('/:orgId/edit/subscriptions/:subscriptionId', loggedIn, async ctx => {
  const subscr = await subscription.get(ctx.params.subscriptionId);

  subscr.period = Object.entries(subscr.period).map(([duration, number]) => `${number} ${duration}`).join(' ');

  await ctx.render('orgs/edit/subscriptions/edit', subscr);
});

router.post('/:orgId/edit/subscriptions/:subscriptionId', loggedIn, async ctx => {
  const { name, description, price, period } = ctx.request.body;

  await subscription.update({
    name,
    description,
    price,
    period,
    id: ctx.params.subscriptionId,
  });

  ctx.redirect('..');
});

router.post('/:orgId/edit/subscriptions/:subscriptionId/delete', loggedIn, async ctx => {
  await subscription.delete(ctx.params.subscriptionId);
  ctx.redirect('..');
});

module.exports = router;
