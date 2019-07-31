const router = new (require('koa-router'))();
const { loggedIn, notLoggedIn } = require('../middleware/user_auth.js');
const user = require('../dbmodels/user.js');
const item = require('../dbmodels/item.js');

const product = require('../dbmodels/product.js');

router.get('/login', notLoggedIn, ctx => ctx.render('login'));
router.post('/login', notLoggedIn, async ctx => {
  const { email, password, remember } = ctx.request.body;

  const userId = await user.login({ email, password });

  if (userId !== null) {
    await ctx.auth.login(userId, remember);
    ctx.redirect(ctx.query.redirect || '/');
  } else {
    ctx.body = 'INVALID LOGIN';
  }
});

router.post('/logout', async ctx => {
  await ctx.auth.logout();
  ctx.redirect('/');
});

router.get('/register', notLoggedIn, ctx => ctx.render('register'));
router.post('/register', notLoggedIn, async ctx => {
  const { name, email, password } = ctx.request.body;

  await user.create({ name, email, password });
  ctx.redirect('/');
});

router.get('/private', loggedIn, ctx => ctx.render('private', { name: ctx.auth.userName }));

router.get('/', async ctx => ctx.render('index', { items: await item.getAll() }));

router.get('/basket', async ctx => {
  const items = JSON.parse(ctx.query.items);
  const products = [];

  for (const { type, id, basketId } of items) {
    if (type === 'product') {
      products.push({ basketId, ...await product.get(id) });
    }
  }
  await ctx.render('basket', { products });
});

module.exports = router;
