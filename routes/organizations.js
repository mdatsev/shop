const Router = require('koa-router');

const assert = require('../util/assert');

const { loggedIn } = require('../middleware/user_auth.js');

const organization = require('../dbmodels/organization.js');
const product = require('../dbmodels/product.js');
const subscription = require('../dbmodels/subscription.js');
const shop = require('../dbmodels/shop.js');

const productsRouter = new Router()

  .get('/', async ctx => {
    await ctx.render('orgs/edit/products/index', { products: await product.getAllOrg(ctx.params.orgId) });
  })

  .get('/create', async ctx => {
    await ctx.render('orgs/edit/products/create', { products: await product.getAllOrg(ctx.params.orgId) });
  })
  .post('/create', async ctx => {
    const { name, description, price, availableQuantity } = ctx.request.body;

    await product.create({
      name,
      description,
      price,
      availableQuantity,
      organizationId: ctx.params.orgId,
    });

    ctx.redirect('.');
  })

  .get('/:productId/', async ctx => {
    await ctx.render('orgs/edit/products/edit', await product.get(ctx.params.productId));
  })
  .post('/:productId/', async ctx => {
    const { name, description, price, availableQuantity } = ctx.request.body;

    await product.update({
      name,
      description,
      price,
      availableQuantity,
      id: ctx.params.productId,
    });

    ctx.redirect('..');
  })

  .post('/:productId/delete', async ctx => {
    await product.delete(ctx.params.productId);
    ctx.redirect('..');
  });

const subscriptionsRouter = new Router()

  .get('/', async ctx => {
    await ctx.render('orgs/edit/subscriptions/index', { subscriptions: await subscription.getAllOrg(ctx.params.orgId) });
  })

  .get('/create', async ctx => {
    await ctx.render('orgs/edit/subscriptions/create', { subscriptions: await subscription.getAllOrg(ctx.params.orgId) });
  })
  .post('/create', async ctx => {
    const { name, description, price, period } = ctx.request.body;

    await subscription.create({
      name,
      description,
      price,
      period,
      organizationId: ctx.params.orgId,
    });

    ctx.redirect('.');
  })

  .get('/:subscriptionId', async ctx => {
    const subscr = await subscription.get(ctx.params.subscriptionId);

    subscr.period = Object.entries(subscr.period).map(([duration, number]) => `${number} ${duration}`).join(' ');

    await ctx.render('orgs/edit/subscriptions/edit', subscr);
  })
  .post('/:subscriptionId', async ctx => {
    const { name, description, price, period } = ctx.request.body;

    await subscription.update({
      name,
      description,
      price,
      period,
      id: ctx.params.subscriptionId,
    });

    ctx.redirect('..');
  })

  .post('/:subscriptionId/delete', async ctx => {
    await subscription.delete(ctx.params.subscriptionId);
    ctx.redirect('..');
  });

const shopsRouter = new Router()

  .get('/', async ctx => {
    await ctx.render('orgs/edit/shops/index', { shops: await shop.getAllOrg(ctx.params.orgId) });
  })

  .get('/create', async ctx => {
    await ctx.render('orgs/edit/shops/create', { shops: await shop.getAllOrg(ctx.params.orgId) });
  })
  .post('/create', async ctx => {
    const { lat, lng } = ctx.request.body;

    await shop.create({
      lat,
      lng,
      organizationId: ctx.params.orgId,
    });

    ctx.redirect('.');
  })

  .get('/:shopId/', async ctx => {
    await ctx.render('orgs/edit/shops/edit', await shop.get(ctx.params.shopId));
  })
  .post('/:shopId/', async ctx => {
    const { lat, lng } = ctx.request.body;

    await shop.update({
      lat,
      lng,
      id: ctx.params.shopId,
    });

    ctx.redirect('..');
  })

  .post('/:shopId/delete', async ctx => {
    await shop.delete(ctx.params.shopId);
    ctx.redirect('..');
  });

const orgsRouter = new Router({ prefix: '/orgs' })

  .use(loggedIn)

  .get('/', async ctx =>
    ctx.render('orgs/index', {
      orgs: await organization.getAllOfUser(ctx.auth.userId),
    })
  )

  .get('/create', ctx => ctx.render('orgs/create'))
  .post('/create', async ctx => {
    const { name } = ctx.request.body;

    const id = await organization.create({ name, ownerId: ctx.auth.userId });

    ctx.redirect(`/orgs/${id}/edit/index`);
  })

  .get('/:orgId/edit/index', authOrg, async ctx => {
    await ctx.render('orgs/edit', await organization.get(ctx.params.orgId));
  })
  .post('/:orgId/edit/index', authOrg, async ctx => {
    const { name } = ctx.request.body;

    await organization.update({ id: ctx.params.orgId, name });

    ctx.redirect('/orgs');
  })

  .use('/:orgId/edit/products', authOrg, productsRouter.routes(), productsRouter.allowedMethods())
  .use('/:orgId/edit/subscriptions', authOrg, subscriptionsRouter.routes(), subscriptionsRouter.allowedMethods())
  .use('/:orgId/edit/shops', authOrg, shopsRouter.routes(), shopsRouter.allowedMethods());

async function authOrg (ctx, next) {
  const org = await organization.get(ctx.params.orgId);
  const userId = ctx.auth.userId;

  assert.user(org.owner_id === userId, 'User unauthorized to this org');
  await next();
}

module.exports = orgsRouter;
