const router = new (require('koa-router'))();
const { notLoggedIn } = require('../middleware/user_auth.js');
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

router.get('/', async ctx => {
  let { perPage = 15, pageNum = 1, order = 'created_at', ascending = 'desc' } = ctx.query;

  // convert types
  pageNum = +pageNum;
  perPage = +perPage;
  ascending = ascending === 'asc';

  const pageIndex = pageNum - 1; // 0 indexed
  const offset = pageIndex * perPage;

  const items = await item.getAll({ limit: perPage, offset, order, ascending });

  const pages = [...Array(11).keys()] // number of displayed page buttons
    .map(i => +pageNum + i - Math.min(5, pageIndex)); // center on current but no negative

  await ctx.render('index', { items, pageNum, pages, query: ctx.query });
});

module.exports = router;
