const router = new (require('koa-router'))({ prefix: '/orgs' });
const { loggedIn } = require('../middleware/user_auth.js');

const organization = require('../dbmodels/organization.js');
const product = require('../dbmodels/product.js');

router.get('/', loggedIn, async ctx =>
  ctx.render('orgs/index', {
    orgs: await organization.getAllOfUser(ctx.auth.userId),
  })
);

router.get('/create', loggedIn, ctx => ctx.render('orgs/create'));
router.post('/create', loggedIn, async ctx => {
  const { name } = ctx.request.body;

  await organization.create({ name, ownerId: ctx.auth.userId });
  ctx.redirect('/orgs');
});

router.get('/:id/edit/index', loggedIn, async ctx => {
  await ctx.render('orgs/edit', await organization.get(ctx.params.id));
});
router.post('/:id/edit/index', loggedIn, async ctx => {
  // todo
  ctx.redirect('/orgs/edit');
});

router.get('/:id/edit/products', loggedIn, async ctx => {
  await ctx.render('orgs/edit/products', { products: await product.getAllOrg(ctx.params.id) });
});

module.exports = router;
